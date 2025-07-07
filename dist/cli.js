#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const database_js_1 = require("./core/database.js");
const program = new commander_1.Command();
program
    .name('gitdb')
    .description('GitHub-backed NoSQL database CLI')
    .version('1.0.0');
// Connect to database
program
    .command('connect')
    .description('Connect to a GitHub repository database')
    .requiredOption('-t, --token <token>', 'GitHub personal access token')
    .requiredOption('-o, --owner <owner>', 'GitHub repository owner')
    .requiredOption('-r, --repo <repo>', 'GitHub repository name')
    .action(async (options) => {
    try {
        await database_js_1.databaseManager.connect({
            token: options.token,
            owner: options.owner,
            repo: options.repo
        });
        await database_js_1.databaseManager.initializeDatabase();
        console.log(`✅ Connected to database: ${options.owner}/${options.repo}`);
    }
    catch (error) {
        console.error(`❌ Connection failed: ${error.message}`);
        process.exit(1);
    }
});
// List collections
program
    .command('collections')
    .description('List all collections')
    .action(async () => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        const collections = await database_js_1.databaseManager.listCollections();
        if (collections.length === 0) {
            console.log('📁 No collections found');
        }
        else {
            console.log('📁 Collections:');
            collections.forEach(collection => console.log(`  - ${collection}`));
        }
    }
    catch (error) {
        console.error(`❌ Failed to list collections: ${error.message}`);
        process.exit(1);
    }
});
// Create collection
program
    .command('create-collection')
    .description('Create a new collection')
    .argument('<name>', 'Collection name')
    .action(async (name) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        await database_js_1.databaseManager.createCollection(name);
        console.log(`✅ Collection '${name}' created successfully`);
    }
    catch (error) {
        console.error(`❌ Failed to create collection: ${error.message}`);
        process.exit(1);
    }
});
// Delete collection
program
    .command('delete-collection')
    .description('Delete a collection')
    .argument('<name>', 'Collection name')
    .action(async (name) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        await database_js_1.databaseManager.deleteCollection(name);
        console.log(`✅ Collection '${name}' deleted successfully`);
    }
    catch (error) {
        console.error(`❌ Failed to delete collection: ${error.message}`);
        process.exit(1);
    }
});
// List documents
program
    .command('documents')
    .description('List documents in a collection')
    .argument('<collection>', 'Collection name')
    .action(async (collection) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        const documents = await database_js_1.databaseManager.listDocuments(collection);
        if (documents.length === 0) {
            console.log(`📄 No documents found in collection '${collection}'`);
        }
        else {
            console.log(`📄 Documents in '${collection}':`);
            documents.forEach(doc => console.log(`  - ${doc}`));
        }
    }
    catch (error) {
        console.error(`❌ Failed to list documents: ${error.message}`);
        process.exit(1);
    }
});
// Create document
program
    .command('create-doc')
    .description('Create a new document')
    .argument('<collection>', 'Collection name')
    .argument('<data>', 'Document data (JSON string)')
    .action(async (collection, data) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        const documentData = JSON.parse(data);
        const document = await database_js_1.databaseManager.createDocument(collection, documentData);
        console.log(`✅ Document created with ID: ${document._id}`);
        console.log(JSON.stringify(document, null, 2));
    }
    catch (error) {
        console.error(`❌ Failed to create document: ${error.message}`);
        process.exit(1);
    }
});
// Read document
program
    .command('read-doc')
    .description('Read a document by ID')
    .argument('<collection>', 'Collection name')
    .argument('<id>', 'Document ID')
    .action(async (collection, id) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        const document = await database_js_1.databaseManager.readDocument(collection, id);
        console.log(JSON.stringify(document, null, 2));
    }
    catch (error) {
        console.error(`❌ Failed to read document: ${error.message}`);
        process.exit(1);
    }
});
// Update document
program
    .command('update-doc')
    .description('Update a document by ID')
    .argument('<collection>', 'Collection name')
    .argument('<id>', 'Document ID')
    .argument('<data>', 'Update data (JSON string)')
    .action(async (collection, id, data) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        const updateData = JSON.parse(data);
        const document = await database_js_1.databaseManager.updateDocument(collection, id, updateData);
        console.log(`✅ Document updated successfully`);
        console.log(JSON.stringify(document, null, 2));
    }
    catch (error) {
        console.error(`❌ Failed to update document: ${error.message}`);
        process.exit(1);
    }
});
// Delete document
program
    .command('delete-doc')
    .description('Delete a document by ID')
    .argument('<collection>', 'Collection name')
    .argument('<id>', 'Document ID')
    .action(async (collection, id) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        await database_js_1.databaseManager.deleteDocument(collection, id);
        console.log(`✅ Document '${id}' deleted successfully`);
    }
    catch (error) {
        console.error(`❌ Failed to delete document: ${error.message}`);
        process.exit(1);
    }
});
// Find documents
program
    .command('find')
    .description('Find documents by query')
    .argument('<collection>', 'Collection name')
    .argument('<query>', 'Query (JSON string)')
    .action(async (collection, query) => {
    try {
        if (!database_js_1.databaseManager.isConnected()) {
            console.error('❌ Not connected to database. Use "gitdb connect" first.');
            process.exit(1);
        }
        const queryData = JSON.parse(query);
        const documents = await database_js_1.databaseManager.findDocuments(collection, queryData);
        if (documents.length === 0) {
            console.log('🔍 No documents found matching the query');
        }
        else {
            console.log(`🔍 Found ${documents.length} document(s):`);
            documents.forEach((doc, index) => {
                console.log(`\n--- Document ${index + 1} ---`);
                console.log(JSON.stringify(doc, null, 2));
            });
        }
    }
    catch (error) {
        console.error(`❌ Failed to find documents: ${error.message}`);
        process.exit(1);
    }
});
// Status
program
    .command('status')
    .description('Show database connection status')
    .action(() => {
    const connection = database_js_1.databaseManager.getConnection();
    if (connection) {
        console.log(`✅ Connected to: ${connection.owner}/${connection.repo}`);
    }
    else {
        console.log('❌ Not connected to any database');
    }
});
program.parse();
//# sourceMappingURL=cli.js.map