#!/usr/bin/env node
import * as readline from 'readline';
import { databaseManager } from './core/database.js';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import chalk from 'chalk';
const CONFIG_PATH = path.join(os.homedir(), '.gitdbconfig');
const LOG_PATH = path.join(os.homedir(), '.gitdb-shell.log');
function saveConfig(token, owner, repo) {
    const config = { token, owner, repo };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
function loadConfig() {
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            return {
                token: data.token || null,
                owner: data.owner || null,
                repo: data.repo || null
            };
        }
        catch { }
    }
    return { token: null, owner: null, repo: null };
}
function clearConfig() {
    if (fs.existsSync(CONFIG_PATH))
        fs.unlinkSync(CONFIG_PATH);
}
function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_PATH, `[${timestamp}] ${message}\n`);
}
class GitDBShell {
    rl;
    currentCollection = null;
    token = null;
    owner = null;
    repo = null;
    isConnected = false;
    lastInsertedId = null;
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'gitdb> '
        });
        // Load config on startup
        const config = loadConfig();
        this.token = config.token;
        this.owner = config.owner;
        this.repo = config.repo;
        if (this.token && this.owner && this.repo) {
            console.log('💾 Loaded credentials from .gitdbconfig');
        }
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        this.rl.on('line', (line) => {
            this.processCommand(line.trim());
        });
        this.rl.on('close', () => {
            console.log('\n👋 Goodbye!');
            process.exit(0);
        });
        // Handle Ctrl+C gracefully
        process.on('SIGINT', () => {
            console.log('\n👋 Goodbye!');
            process.exit(0);
        });
    }
    async processCommand(input) {
        if (!input) {
            this.rl.prompt();
            return;
        }
        // Skip comments (lines starting with #)
        if (input.trim().startsWith('#')) {
            this.rl.prompt();
            return;
        }
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        logToFile(`> ${input}`);
        try {
            switch (command) {
                case 'help':
                case '-h':
                case 'h':
                    this.showHelp();
                    break;
                case 'set':
                    await this.handleSet(args);
                    break;
                case 'connect':
                    await this.handleConnect();
                    break;
                case 'disconnect':
                    await this.handleDisconnect();
                    break;
                case 'status':
                    this.showStatus();
                    break;
                case 'use':
                    this.handleUse(args);
                    break;
                case 'collections':
                case 'show':
                    if (args[0] === 'collections') {
                        await this.handleCollections();
                    }
                    else if (args[0] === 'docs') {
                        await this.handleDocuments();
                    }
                    else if (args[0] === 'config') {
                        this.showConfig();
                    }
                    else {
                        console.log('❌ Usage: show collections | show docs | show config');
                    }
                    break;
                case 'create-collection':
                    await this.handleCreateCollection(args);
                    break;
                case 'delete-collection':
                    await this.handleDeleteCollection(args);
                    break;
                case 'docs':
                case 'documents':
                    await this.handleDocuments();
                    break;
                case 'insert':
                    await this.handleInsert(args);
                    break;
                case 'find':
                    await this.handleFind(args);
                    break;
                case 'findone':
                    await this.handleFindOne(args);
                    break;
                case 'count':
                    await this.handleCount(args);
                    break;
                case 'update':
                    await this.handleUpdate(args);
                    break;
                case 'updatemany':
                    await this.handleUpdateMany(args);
                    break;
                case 'delete':
                    await this.handleDelete(args);
                    break;
                case 'deletemany':
                    await this.handleDeleteMany(args);
                    break;
                case 'distinct':
                    await this.handleDistinct(args);
                    break;
                case 'last':
                    this.showLastInserted();
                    break;
                case 'clear':
                    if (args[0] === 'config') {
                        clearConfig();
                        this.token = null;
                        this.owner = null;
                        this.repo = null;
                        this.isConnected = false;
                        console.log('🧹 Cleared saved credentials.');
                    }
                    else if (args.length === 0) {
                        console.clear();
                    }
                    else {
                        console.log('❌ Usage: clear | clear config');
                    }
                    break;
                case 'exit':
                case 'quit':
                    console.log('👋 Goodbye!');
                    process.exit(0);
                    break;
                default:
                    console.log(`❌ Unknown command: ${command}`);
                    console.log('Type "help" for available commands');
            }
            logToFile('✔ Success');
        }
        catch (error) {
            logToFile(`✖ Error: ${error.message}`);
            console.error(chalk.red(`❌ Error: ${error.message}`));
        }
        this.rl.prompt();
    }
    async handleSet(args) {
        if (args.length !== 2) {
            console.log(chalk.red('❌ Usage: set <token|owner|repo> <value>'));
            return;
        }
        const [key, value] = args;
        switch (key.toLowerCase()) {
            case 'token':
                this.token = value;
                console.log(chalk.green('✅ Token set successfully.'));
                break;
            case 'owner':
                this.owner = value;
                console.log(chalk.green('✅ Owner set successfully.'));
                break;
            case 'repo':
                this.repo = value;
                console.log(chalk.green('✅ Repo set successfully.'));
                break;
            default:
                console.log(chalk.red('❌ Usage: set <token|owner|repo> <value>'));
        }
        // Save config on set
        saveConfig(this.token, this.owner, this.repo);
        // Auto-connect if all credentials are set
        if (this.token && this.owner && this.repo && !this.isConnected) {
            console.log('💡 All credentials set. Run "connect" to connect to the database.');
        }
    }
    async handleConnect() {
        if (!this.token || !this.owner || !this.repo) {
            console.log(chalk.red('❌ Please set token, owner, and repo first:'));
            console.log('   set token <your_token>');
            console.log('   set owner <your_username>');
            console.log('   set repo <your_repo>');
            return;
        }
        try {
            await databaseManager.connect({ token: this.token, owner: this.owner, repo: this.repo });
            await databaseManager.initializeDatabase();
            this.isConnected = true;
            console.log(chalk.green(`✅ Connected to database: ${this.owner}/${this.repo}`));
        }
        catch (error) {
            console.error(chalk.red(`❌ Connection failed: ${error.message}`));
            this.isConnected = false;
        }
    }
    async handleDisconnect() {
        try {
            await databaseManager.disconnect();
            this.isConnected = false;
            this.currentCollection = null;
            console.log('✅ Disconnected from database');
        }
        catch (error) {
            console.error(`❌ Disconnect failed: ${error.message}`);
        }
    }
    showStatus() {
        if (this.isConnected) {
            console.log(`✅ Connected to: ${this.owner}/${this.repo}`);
            if (this.currentCollection) {
                console.log(`📁 Current collection: ${this.currentCollection}`);
            }
            else {
                console.log('📁 No collection selected (use "use <collection>")');
            }
        }
        else {
            console.log('❌ Not connected to any database');
            if (this.token && this.owner && this.repo) {
                console.log('💡 Run "connect" to connect to the database');
            }
            else {
                console.log('💡 Use "set" commands to configure connection');
            }
        }
    }
    handleUse(args) {
        if (args.length !== 1) {
            console.log('❌ Usage: use <collection>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        this.currentCollection = args[0];
        console.log(`✅ Using collection: ${this.currentCollection}`);
    }
    async handleCollections() {
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        try {
            const collections = await databaseManager.listCollections();
            if (collections.length === 0) {
                console.log('📁 No collections found');
            }
            else {
                console.log('📁 Collections:');
                collections.forEach(collection => {
                    const marker = collection === this.currentCollection ? ' → ' : '   ';
                    console.log(`${marker}${collection}`);
                });
            }
        }
        catch (error) {
            console.error(`❌ Failed to list collections: ${error.message}`);
        }
    }
    async handleCreateCollection(args) {
        if (args.length !== 1) {
            console.log('❌ Usage: create-collection <name>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database.');
            if (this.token && this.owner && this.repo) {
                console.log('💡 Run "connect" to connect to the database');
            }
            else {
                console.log('💡 Set your credentials first:');
                console.log('   set token <your_token>');
                console.log('   set owner <your_username>');
                console.log('   set repo <your_repo>');
                console.log('   connect');
            }
            return;
        }
        try {
            await databaseManager.createCollection(args[0]);
            console.log(`✅ Collection '${args[0]}' created successfully.`);
        }
        catch (error) {
            console.error(`❌ Failed to create collection: ${error.message}`);
        }
    }
    async handleDeleteCollection(args) {
        if (args.length !== 1) {
            console.log('❌ Usage: delete-collection <name>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        try {
            await databaseManager.deleteCollection(args[0]);
            if (this.currentCollection === args[0]) {
                this.currentCollection = null;
            }
            console.log(`✅ Collection '${args[0]}' deleted successfully`);
        }
        catch (error) {
            console.error(`❌ Failed to delete collection: ${error.message}`);
        }
    }
    async handleDocuments() {
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const documents = await databaseManager.listDocuments(this.currentCollection);
            if (documents.length === 0) {
                console.log(`📄 No documents found in collection '${this.currentCollection}'`);
            }
            else {
                console.log(`📄 Documents in '${this.currentCollection}':`);
                documents.forEach(doc => console.log(`  - ${doc}`));
                // Also show full document details if there are few documents
                if (documents.length <= 5) {
                    console.log('\n📋 Document details:');
                    for (const docId of documents) {
                        try {
                            const doc = await databaseManager.readDocument(this.currentCollection, docId);
                            console.log(`  ID: ${docId}`);
                            console.log(`  Data: ${JSON.stringify(doc)}`);
                            console.log('');
                        }
                        catch (error) {
                            console.log(`  ID: ${docId} (Error reading: ${error.message})`);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error(`❌ Failed to list documents: ${error.message}`);
        }
    }
    async handleInsert(args) {
        if (args.length === 0) {
            console.log('❌ Usage: insert <json>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const jsonStr = args.join(' ');
            const data = JSON.parse(jsonStr);
            const document = await databaseManager.createDocument(this.currentCollection, data);
            this.lastInsertedId = document._id;
            console.log(`✅ Inserted successfully: ${document._id}`);
            console.log(JSON.stringify(document, null, 2));
            console.log(`💡 Use "find ${document._id}" to retrieve this document later`);
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.error('❌ Invalid JSON format');
            }
            else {
                console.error(`❌ Failed to insert document: ${error.message}`);
            }
        }
    }
    async handleFind(args) {
        if (args.length !== 1) {
            console.log('❌ Usage: find <id>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const document = await databaseManager.readDocument(this.currentCollection, args[0]);
            console.log(JSON.stringify(document, null, 2));
        }
        catch (error) {
            console.error(`❌ Failed to find document: ${error.message}`);
            console.log('💡 Use "show docs" to see available document IDs');
        }
    }
    async handleUpdate(args) {
        if (args.length < 2) {
            console.log('❌ Usage: update <id> <json>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const id = args[0];
            const jsonStr = args.slice(1).join(' ');
            const data = JSON.parse(jsonStr);
            const document = await databaseManager.updateDocument(this.currentCollection, id, data);
            console.log(`✅ Document updated successfully`);
            console.log(JSON.stringify(document, null, 2));
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.error('❌ Invalid JSON format');
            }
            else {
                console.error(`❌ Failed to update document: ${error.message}`);
                console.log('💡 Use "show docs" to see available document IDs');
            }
        }
    }
    async handleDelete(args) {
        if (args.length !== 1) {
            console.log('❌ Usage: delete <id>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            await databaseManager.deleteDocument(this.currentCollection, args[0]);
            console.log(`✅ Document '${args[0]}' deleted successfully`);
        }
        catch (error) {
            console.error(`❌ Failed to delete document: ${error.message}`);
        }
    }
    async handleFindOne(args) {
        if (args.length === 0) {
            console.log('❌ Usage: findone <json-query>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const jsonStr = args.join(' ');
            const query = JSON.parse(jsonStr);
            const document = await databaseManager.findOne(this.currentCollection, query);
            if (document) {
                console.log('📄 Found document:');
                console.log(JSON.stringify(document, null, 2));
            }
            else {
                console.log('❌ No document found matching the query');
            }
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.error('❌ Invalid JSON format');
            }
            else {
                console.error(`❌ Failed to find document: ${error.message}`);
            }
        }
    }
    async handleCount(args) {
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            let query = {};
            if (args.length > 0) {
                const jsonStr = args.join(' ');
                query = JSON.parse(jsonStr);
            }
            const count = await databaseManager.count(this.currentCollection, query);
            console.log(`📊 Count: ${count} document(s)`);
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.error('❌ Invalid JSON format');
            }
            else {
                console.error(`❌ Failed to count documents: ${error.message}`);
            }
        }
    }
    async handleUpdateMany(args) {
        if (args.length < 2) {
            console.log('❌ Usage: updatemany <json-query> <json-update>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            // Find the split between query and update
            let queryStr = '';
            let updateStr = '';
            let inUpdate = false;
            for (let i = 0; i < args.length; i++) {
                if (args[i].includes('"') && !inUpdate) {
                    // Check if this looks like the end of the query
                    try {
                        JSON.parse(args.slice(0, i + 1).join(' '));
                        queryStr = args.slice(0, i + 1).join(' ');
                        updateStr = args.slice(i + 1).join(' ');
                        break;
                    }
                    catch {
                        // Continue building query
                    }
                }
            }
            if (!queryStr) {
                queryStr = args[0];
                updateStr = args.slice(1).join(' ');
            }
            const query = JSON.parse(queryStr);
            const update = JSON.parse(updateStr);
            const updatedCount = await databaseManager.updateMany(this.currentCollection, query, update);
            console.log(`✅ Updated ${updatedCount} document(s)`);
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.error('❌ Invalid JSON format');
            }
            else {
                console.error(`❌ Failed to update documents: ${error.message}`);
            }
        }
    }
    async handleDeleteMany(args) {
        if (args.length === 0) {
            console.log('❌ Usage: deletemany <json-query>');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const jsonStr = args.join(' ');
            const query = JSON.parse(jsonStr);
            const deletedCount = await databaseManager.deleteMany(this.currentCollection, query);
            console.log(`✅ Deleted ${deletedCount} document(s)`);
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.error('❌ Invalid JSON format');
            }
            else {
                console.error(`❌ Failed to delete documents: ${error.message}`);
            }
        }
    }
    async handleDistinct(args) {
        if (args.length < 1) {
            console.log('❌ Usage: distinct <field> [json-query]');
            return;
        }
        if (!this.isConnected) {
            console.log('❌ Not connected to database. Use "connect" first.');
            return;
        }
        if (!this.currentCollection) {
            console.log('❌ No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const field = args[0];
            let query = {};
            if (args.length > 1) {
                const jsonStr = args.slice(1).join(' ');
                query = JSON.parse(jsonStr);
            }
            const distinctValues = await databaseManager.distinct(this.currentCollection, field, query);
            console.log(`📊 Distinct values for '${field}':`);
            distinctValues.forEach(value => console.log(`  - ${value}`));
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.error('❌ Invalid JSON format');
            }
            else {
                console.error(`❌ Failed to get distinct values: ${error.message}`);
            }
        }
    }
    showLastInserted() {
        if (this.lastInsertedId) {
            console.log(`📝 Last inserted document ID: ${this.lastInsertedId}`);
            console.log(`💡 Use "find ${this.lastInsertedId}" to retrieve it`);
        }
        else {
            console.log('📝 No document has been inserted in this session');
        }
    }
    showHelp() {
        console.log('\n🚀 GitDB Shell v1.0.0 - GitHub NoSQL Database');
        console.log('===============================================');
        console.log('');
        console.log('Commands:');
        console.log('  set token <token>         Set GitHub token');
        console.log('  set owner <owner>         Set GitHub owner');
        console.log('  set repo <repo>           Set GitHub repo');
        console.log('  connect                   Connect to database');
        console.log('  disconnect                Disconnect from database');
        console.log('  status                    Show connection status');
        console.log('  use <collection>          Set current collection');
        console.log('  create-collection <name>  Create a new collection');
        console.log('  show collections          List all collections');
        console.log('  show docs                 List documents in current collection');
        console.log('  insert <json>             Insert document (JSON string)');
        console.log('  find <id>                 Find document by ID');
        console.log('  findone <json-query>      Find first document matching query');
        console.log('  count [json-query]        Count documents (optional query)');
        console.log('  update <id> <json>        Update document by ID (JSON string)');
        console.log('  updatemany <query> <json> Update multiple documents');
        console.log('  delete <id>               Delete document by ID');
        console.log('  deletemany <json-query>   Delete multiple documents');
        console.log('  distinct <field> [query]  Get distinct values for field');
        console.log('  last                      Show last inserted document ID');
        console.log('  help                      Show this help');
        console.log('  exit                      Exit shell');
        console.log('');
        console.log('Examples:');
        console.log('  set token ghp_xxxxxxxxxxxxxxxxxxxx');
        console.log('  set owner yourusername');
        console.log('  set repo my-database');
        console.log('  connect');
        console.log('  create-collection users');
        console.log('  use users');
        console.log('  insert {"name":"John","email":"john@example.com","age":25}');
        console.log('  insert {"name":"Alice","email":"alice@example.com","age":30}');
        console.log('  insert {"name":"Bob","email":"bob@example.com","age":25}');
        console.log('');
        console.log('  # MongoDB-style queries:');
        console.log('  findone {"name":"John"}');
        console.log('  findone {"age":{"$gte":25}}');
        console.log('  count {"age":25}');
        console.log('  count  # Count all documents');
        console.log('  updatemany {"age":25} {"verified":true}');
        console.log('  deletemany {"age":{"$lt":30}}');
        console.log('  distinct "age"');
        console.log('  distinct "name" {"age":{"$gte":25}}');
        console.log('');
        console.log('  # Traditional ID-based operations:');
        console.log('  find x6nyfi6fy  # Use actual ID from insert');
        console.log('  update x6nyfi6fy {"name":"John Doe"}');
        console.log('  delete x6nyfi6fy');
        console.log('  show docs');
        console.log('  last');
        console.log('');
        console.log('===============================================');
    }
    showConfig() {
        console.log('Current saved credentials (.gitdbconfig):');
        console.log(`  token: ${this.token ? '[set]' : '[not set]'}`);
        console.log(`  owner: ${this.owner || '[not set]'}`);
        console.log(`  repo:  ${this.repo || '[not set]'}`);
    }
    start() {
        console.log(chalk.green('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.green('║                    🚀 GitDB Shell v1.0.0                    ║'));
        console.log(chalk.green('║              GitHub NoSQL Database Interface                 ║'));
        console.log(chalk.green('╠══════════════════════════════════════════════════════════════╣'));
        console.log(chalk.green('║  Welcome! This is your GitHub-backed NoSQL database shell.   ║'));
        console.log(chalk.green('║  Type \'help\' for commands or \'exit\' to quit.                ║'));
        console.log(chalk.green('╚══════════════════════════════════════════════════════════════╝'));
        console.log('');
        this.rl.prompt();
    }
}
// Start the shell
const shell = new GitDBShell();
shell.start();
//# sourceMappingURL=shell.js.map