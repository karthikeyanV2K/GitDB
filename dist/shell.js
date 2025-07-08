"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const logger_1 = require("./utils/logger");
const chalk_1 = __importDefault(require("chalk"));
const logger = (0, logger_1.createLogger)('Shell');
class GitDBShell {
    constructor() {
        this.state = {
            currentCollection: null,
            serverUrl: 'http://localhost:7896',
            token: null,
            owner: null,
            repo: null
        };
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk_1.default.green('[gitdb]> ')
        });
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.rl.on('line', (input) => {
            this.processCommand(input.trim());
            this.rl.prompt();
        });
        this.rl.on('close', () => {
            console.log(chalk_1.default.yellow('\nGoodbye!'));
            process.exit(0);
        });
    }
    async processCommand(input) {
        if (!input)
            return;
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        try {
            switch (command) {
                case 'set':
                    await this.handleSet(args);
                    break;
                case 'use':
                    await this.handleUse(args);
                    break;
                case 'create-collection':
                    await this.handleCreateCollection(args);
                    break;
                case 'show':
                    await this.handleShow(args);
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
                case 'help':
                    this.showHelp();
                    break;
                case 'exit':
                case 'quit':
                    this.rl.close();
                    break;
                default:
                    console.log(chalk_1.default.red(`Unknown command: ${command}. Type 'help' for available commands.`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`Error: ${error.message}`));
            logger.error('Command execution error', { command, error: error.message });
        }
    }
    async handleSet(args) {
        if (args.length < 2) {
            console.log('Usage: set <token|owner|repo> <value>');
            return;
        }
        const [type, value] = args;
        switch (type.toLowerCase()) {
            case 'token':
                this.state.token = value;
                console.log('Token set successfully');
                break;
            case 'owner':
                this.state.owner = value;
                console.log('Owner set successfully');
                break;
            case 'repo':
                this.state.repo = value;
                console.log('Repository set successfully');
                break;
            default:
                console.log('Invalid set type. Use: token, owner, or repo');
        }
    }
    async handleUse(args) {
        if (args.length < 1) {
            console.log('Usage: use <collection>');
            return;
        }
        const collectionName = args[0];
        this.state.currentCollection = collectionName;
        console.log(`Using collection: ${collectionName}`);
    }
    async handleCreateCollection(args) {
        if (args.length < 1) {
            console.log('Usage: create-collection <name>');
            return;
        }
        const collectionName = args[0];
        try {
            const response = await this.makeRequest('POST', '/collections', { name: collectionName });
            if (response.success) {
                console.log(`Collection '${collectionName}' created successfully`);
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error creating collection: ${error.message}`);
        }
    }
    async handleShow(args) {
        if (args.length < 1) {
            console.log('Usage: show <collections|docs>');
            return;
        }
        const type = args[0].toLowerCase();
        switch (type) {
            case 'collections':
                await this.showCollections();
                break;
            case 'docs':
                await this.showDocs();
                break;
            default:
                console.log('Invalid show type. Use: collections or docs');
        }
    }
    async showCollections() {
        try {
            const response = await this.makeRequest('GET', '/collections');
            if (response.success && response.collections) {
                console.log('Collections:');
                response.collections.forEach((collection) => {
                    console.log(`  - ${collection}`);
                });
            }
            else {
                console.log('No collections found');
            }
        }
        catch (error) {
            console.log(`Error listing collections: ${error.message}`);
        }
    }
    async showDocs() {
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const response = await this.makeRequest('POST', '/show-docs', {
                collection: this.state.currentCollection
            });
            if (response.success && response.documents) {
                console.log(`Documents in '${this.state.currentCollection}':`);
                response.documents.forEach((doc) => {
                    console.log(`  ID: ${doc._id}`);
                    console.log(`  Data: ${JSON.stringify(doc, null, 2)}`);
                    console.log('  ---');
                });
            }
            else {
                console.log('No documents found');
            }
        }
        catch (error) {
            console.log(`Error showing documents: ${error.message}`);
        }
    }
    async handleInsert(args) {
        if (args.length < 1) {
            console.log('Usage: insert <JSON>');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const jsonStr = args.join(' ');
            const document = JSON.parse(jsonStr);
            const response = await this.makeRequest('POST', '/insert', {
                collection: this.state.currentCollection,
                document
            });
            if (response.success) {
                console.log(`Document inserted with ID: ${response.id}`);
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error inserting document: ${error.message}`);
        }
    }
    async handleFind(args) {
        if (args.length < 1) {
            console.log('Usage: find <id>');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        const id = args[0];
        try {
            const response = await this.makeRequest('GET', `/find/${id}?collection=${this.state.currentCollection}`);
            if (response.success && response.document) {
                console.log('Document found:');
                console.log(JSON.stringify(response.document, null, 2));
            }
            else {
                console.log('Document not found');
            }
        }
        catch (error) {
            console.log(`Error finding document: ${error.message}`);
        }
    }
    async handleFindOne(args) {
        if (args.length < 1) {
            console.log('Usage: findone <JSON-query>');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const jsonStr = args.join(' ');
            const query = JSON.parse(jsonStr);
            const response = await this.makeRequest('POST', '/findone', {
                collection: this.state.currentCollection,
                query
            });
            if (response.success && response.document) {
                console.log('Document found:');
                console.log(JSON.stringify(response.document, null, 2));
            }
            else {
                console.log('No document found matching query');
            }
        }
        catch (error) {
            console.log(`Error finding document: ${error.message}`);
        }
    }
    async handleCount(args) {
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            let query = undefined;
            if (args.length > 0) {
                const jsonStr = args.join(' ');
                query = JSON.parse(jsonStr);
            }
            const response = await this.makeRequest('POST', '/count', {
                collection: this.state.currentCollection,
                query
            });
            if (response.success) {
                console.log(`Count: ${response.count}`);
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error counting documents: ${error.message}`);
        }
    }
    async handleUpdate(args) {
        if (args.length < 2) {
            console.log('Usage: update <id> <JSON>');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        const id = args[0];
        try {
            const jsonStr = args.slice(1).join(' ');
            const updates = JSON.parse(jsonStr);
            const response = await this.makeRequest('PUT', `/update/${id}`, {
                collection: this.state.currentCollection,
                updates
            });
            if (response.success) {
                console.log('Document updated successfully');
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error updating document: ${error.message}`);
        }
    }
    async handleUpdateMany(args) {
        if (args.length < 2) {
            console.log('Usage: updatemany <query> <JSON>');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            // Find the boundary between query and updates
            let queryEndIndex = -1;
            for (let i = 0; i < args.length; i++) {
                if (args[i].startsWith('{') && args[i].endsWith('}')) {
                    queryEndIndex = i;
                    break;
                }
            }
            if (queryEndIndex === -1) {
                console.log('Invalid format. Use: updatemany <query> <JSON>');
                return;
            }
            const queryStr = args.slice(0, queryEndIndex + 1).join(' ');
            const updatesStr = args.slice(queryEndIndex + 1).join(' ');
            const query = JSON.parse(queryStr);
            const updates = JSON.parse(updatesStr);
            const response = await this.makeRequest('POST', '/updatemany', {
                collection: this.state.currentCollection,
                query,
                updates
            });
            if (response.success) {
                console.log(`${response.modifiedCount} documents updated`);
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error updating documents: ${error.message}`);
        }
    }
    async handleDelete(args) {
        if (args.length < 1) {
            console.log('Usage: delete <id>');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        const id = args[0];
        try {
            const response = await this.makeRequest('DELETE', `/delete/${id}?collection=${this.state.currentCollection}`);
            if (response.success) {
                console.log('Document deleted successfully');
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error deleting document: ${error.message}`);
        }
    }
    async handleDeleteMany(args) {
        if (args.length < 1) {
            console.log('Usage: deletemany <JSON-query>');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        try {
            const jsonStr = args.join(' ');
            const query = JSON.parse(jsonStr);
            const response = await this.makeRequest('POST', '/deletemany', {
                collection: this.state.currentCollection,
                query
            });
            if (response.success) {
                console.log(`${response.deletedCount} documents deleted`);
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error deleting documents: ${error.message}`);
        }
    }
    async handleDistinct(args) {
        if (args.length < 1) {
            console.log('Usage: distinct <field> [query]');
            return;
        }
        if (!this.state.currentCollection) {
            console.log('No collection selected. Use "use <collection>" first.');
            return;
        }
        const field = args[0];
        try {
            let query = undefined;
            if (args.length > 1) {
                const jsonStr = args.slice(1).join(' ');
                query = JSON.parse(jsonStr);
            }
            const response = await this.makeRequest('POST', '/distinct', {
                collection: this.state.currentCollection,
                field,
                query
            });
            if (response.success) {
                console.log(`Distinct values for field '${field}':`);
                response.values.forEach((value) => {
                    console.log(`  - ${value}`);
                });
                console.log(`Total: ${response.count} unique values`);
            }
            else {
                console.log(`Error: ${response.error}`);
            }
        }
        catch (error) {
            console.log(`Error getting distinct values: ${error.message}`);
        }
    }
    async makeRequest(method, endpoint, data) {
        const url = `${this.state.serverUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        if (this.state.token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${this.state.token}`
            };
        }
        const response = await fetch(url, options);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `HTTP ${response.status}`);
        }
        return result;
    }
    showHelp() {
        console.log('\nGitDB Shell Commands:');
        console.log('====================');
        console.log('set token <token>           - Set GitHub token');
        console.log('set owner <owner>           - Set repository owner');
        console.log('set repo <repo>             - Set repository name');
        console.log('use <collection>            - Switch to collection');
        console.log('create-collection <name>    - Create new collection');
        console.log('show collections            - List all collections');
        console.log('show docs                   - Show documents in current collection');
        console.log('insert <JSON>               - Insert document');
        console.log('find <id>                   - Find document by ID');
        console.log('findone <JSON-query>        - Find one document by query');
        console.log('count [JSON-query]          - Count documents');
        console.log('update <id> <JSON>          - Update document');
        console.log('updatemany <query> <JSON>   - Update multiple documents');
        console.log('delete <id>                 - Delete document');
        console.log('deletemany <JSON-query>     - Delete multiple documents');
        console.log('distinct <field> [query]    - Get distinct values');
        console.log('help                        - Show this help');
        console.log('exit                        - Exit shell');
        console.log('');
    }
    start() {
        console.log(chalk_1.default.bold.green('───────────────────────────────────────────────'));
        console.log(chalk_1.default.bold.green('   GitDB Shell v1.0.0'));
        console.log(chalk_1.default.gray('   Type "help" for available commands'));
        console.log(chalk_1.default.gray('   Connected to server: ') + chalk_1.default.cyan(this.state.serverUrl));
        console.log(chalk_1.default.bold.green('───────────────────────────────────────────────'));
        this.rl.prompt();
    }
}
// Start the shell if this file is run directly
if (require.main === module) {
    const shell = new GitDBShell();
    shell.start();
}
exports.default = GitDBShell;
//# sourceMappingURL=shell.js.map