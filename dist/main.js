#!/usr/bin/env node
"use strict";
const { Command } = require('commander');
const program = new Command();
const databaseManager = require('./core/database');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
// Import the different modes
const shell = require('./shell');
const server = require('./server');
program
    .name('gitdb')
    .description('GitDB - GitHub-backed NoSQL Database')
    .version('2.0.0');
let nodeWindows = undefined;
if (os.platform() === 'win32') {
    nodeWindows = require('node-windows');
}
// Server mode
program
    .command('server')
    .description('Start the REST API server')
    .option('-p, --port <port>', 'Port to run server on', '7896')
    .option('-h, --host <host>', 'Host to bind server to', '0.0.0.0')
    .action(async (options) => {
    try {
        console.log('🚀 Starting GitDB Server...');
        console.log(`📍 Server will run on ${options.host}:${options.port}`);
        await server.startServer(parseInt(options.port), options.host);
    }
    catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
});
// Shell mode
program
    .command('shell')
    .description('Start interactive shell')
    .action(async () => {
    try {
        console.log('🚀 Starting GitDB Shell...');
        await shell.startShell();
    }
    catch (error) {
        console.error('❌ Failed to start shell:', error.message);
        process.exit(1);
    }
});
// CLI mode - Database operations
program
    .command('connect')
    .description('Connect to a GitHub repository database')
    .requiredOption('-t, --token <token>', 'GitHub personal access token')
    .requiredOption('-o, --owner <owner>', 'GitHub username or organization')
    .requiredOption('-r, --repo <repo>', 'GitHub repository name')
    .action(async (options) => {
    try {
        await databaseManager.connect({
            token: options.token,
            owner: options.owner,
            repo: options.repo
        });
        await databaseManager.initializeDatabase();
        console.log(`✅ Connected to database: ${options.owner}/${options.repo}`);
    }
    catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
});
program
    .command('collections')
    .description('List all collections')
    .action(async () => {
    try {
        const collections = await databaseManager.listCollections();
        console.log('📁 Collections:');
        collections.forEach((collection) => console.log(`  - ${collection}`));
    }
    catch (error) {
        console.error('❌ Failed to list collections:', error.message);
        process.exit(1);
    }
});
program
    .command('create-collection')
    .description('Create a new collection')
    .argument('<name>', 'Collection name')
    .action(async (name) => {
    try {
        await databaseManager.createCollection(name);
        console.log(`✅ Collection '${name}' created successfully`);
    }
    catch (error) {
        console.error('❌ Failed to create collection:', error.message);
        process.exit(1);
    }
});
program
    .command('delete-collection')
    .description('Delete a collection')
    .argument('<name>', 'Collection name')
    .action(async (name) => {
    try {
        await databaseManager.deleteCollection(name);
        console.log(`✅ Collection '${name}' deleted successfully`);
    }
    catch (error) {
        console.error('❌ Failed to delete collection:', error.message);
        process.exit(1);
    }
});
program
    .command('documents')
    .description('List documents in a collection')
    .argument('<collection>', 'Collection name')
    .action(async (collection) => {
    try {
        const documents = await databaseManager.listDocuments(collection);
        console.log(`📄 Documents in '${collection}':`);
        documents.forEach((doc) => console.log(`  - ${doc}`));
    }
    catch (error) {
        console.error('❌ Failed to list documents:', error.message);
        process.exit(1);
    }
});
program
    .command('create-doc')
    .description('Create a new document')
    .argument('<collection>', 'Collection name')
    .argument('<data>', 'JSON document data')
    .action(async (collection, data) => {
    try {
        const documentData = JSON.parse(data);
        const document = await databaseManager.createDocument(collection, documentData);
        console.log('✅ Document created successfully');
        console.log(JSON.stringify(document, null, 2));
    }
    catch (error) {
        console.error('❌ Failed to create document:', error.message);
        process.exit(1);
    }
});
program
    .command('read-doc')
    .description('Read a document by ID')
    .argument('<collection>', 'Collection name')
    .argument('<id>', 'Document ID')
    .action(async (collection, id) => {
    try {
        const document = await databaseManager.readDocument(collection, id);
        console.log(JSON.stringify(document, null, 2));
    }
    catch (error) {
        console.error('❌ Failed to read document:', error.message);
        process.exit(1);
    }
});
program
    .command('update-doc')
    .description('Update a document')
    .argument('<collection>', 'Collection name')
    .argument('<id>', 'Document ID')
    .argument('<data>', 'JSON update data')
    .action(async (collection, id, data) => {
    try {
        const updateData = JSON.parse(data);
        const document = await databaseManager.updateDocument(collection, id, updateData);
        console.log('✅ Document updated successfully');
        console.log(JSON.stringify(document, null, 2));
    }
    catch (error) {
        console.error('❌ Failed to update document:', error.message);
        process.exit(1);
    }
});
program
    .command('delete-doc')
    .description('Delete a document')
    .argument('<collection>', 'Collection name')
    .argument('<id>', 'Document ID')
    .action(async (collection, id) => {
    try {
        await databaseManager.deleteDocument(collection, id);
        console.log('✅ Document deleted successfully');
    }
    catch (error) {
        console.error('❌ Failed to delete document:', error.message);
        process.exit(1);
    }
});
program
    .command('find')
    .description('Find documents by query')
    .argument('<collection>', 'Collection name')
    .argument('<query>', 'JSON query')
    .action(async (collection, query) => {
    try {
        const queryData = JSON.parse(query);
        const documents = await databaseManager.findDocuments(collection, queryData);
        console.log(`📄 Found ${documents.length} document(s):`);
        documents.forEach((doc) => console.log(JSON.stringify(doc, null, 2)));
    }
    catch (error) {
        console.error('❌ Failed to find documents:', error.message);
        process.exit(1);
    }
});
program
    .command('status')
    .description('Show connection status')
    .action(() => {
    const connection = databaseManager.getConnection();
    console.log('🔗 Connection Status:');
    console.log(`  Connected: ${databaseManager.isConnected()}`);
    if (connection) {
        console.log(`  Database: ${connection.owner}/${connection.repo}`);
    }
});
// Service/daemon management
program
    .command('install-service')
    .description('Install GitDB as a background service/daemon')
    .action(async () => {
    const platform = os.platform();
    if (platform === 'win32') {
        // Windows: use node-windows
        try {
            const Service = nodeWindows.Service;
            const svc = new Service({
                name: 'GitDB',
                description: 'GitDB Server Service',
                script: path.resolve(process.execPath),
                scriptOptions: 'server',
            });
            svc.on('install', () => {
                svc.start();
                console.log('✅ GitDB service installed and started.');
            });
            svc.install();
        }
        catch (e) {
            console.error('❌ node-windows is required. Please install it with: npm install node-windows');
        }
    }
    else if (platform === 'linux') {
        // Linux: create systemd service
        const serviceFile = `/etc/systemd/system/gitdb.service`;
        const execPath = process.execPath;
        const serviceContent = `[Unit]\nDescription=GitDB Server\nAfter=network.target\n\n[Service]\nExecStart=${execPath} server\nRestart=always\nUser=${process.env['USER'] || 'gitdb'}\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target\n`;
        try {
            await require('fs/promises').then((fs) => fs.writeFile(serviceFile, serviceContent, { mode: 0o644 }));
            await require('child_process').then((cp) => cp.execSync('systemctl daemon-reload && systemctl enable gitdb && systemctl start gitdb'));
            console.log('✅ GitDB systemd service installed and started.');
        }
        catch (e) {
            console.error('❌ Failed to install systemd service. Try running as sudo.');
        }
    }
    else if (platform === 'darwin') {
        // macOS: create launchd plist
        const plistFile = `${process.env['HOME']}/Library/LaunchAgents/com.gitdb.server.plist`;
        const execPath = process.execPath;
        const plistContent = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n  <key>Label</key>\n  <string>com.gitdb.server</string>\n  <key>ProgramArguments</key>\n  <array>\n    <string>${execPath}</string>\n    <string>server</string>\n  </array>\n  <key>RunAtLoad</key>\n  <true/>\n  <key>KeepAlive</key>\n  <true/>\n</dict>\n</plist>\n`;
        try {
            await require('fs/promises').then((fs) => fs.writeFile(plistFile, plistContent, { mode: 0o644 }));
            await require('child_process').then((cp) => cp.execSync(`launchctl load ${plistFile}`));
            console.log('✅ GitDB launchd service installed and started.');
        }
        catch (e) {
            console.error('❌ Failed to install launchd service. Try running as sudo.');
        }
    }
    else {
        console.error('❌ Unsupported platform for service install.');
    }
});
program
    .command('uninstall-service')
    .description('Uninstall GitDB background service/daemon')
    .action(async () => {
    const platform = os.platform();
    if (platform === 'win32') {
        try {
            const Service = nodeWindows.Service;
            const svc = new Service({
                name: 'GitDB',
                script: path.resolve(process.execPath),
            });
            svc.on('uninstall', () => {
                console.log('✅ GitDB service uninstalled.');
            });
            svc.uninstall();
        }
        catch (e) {
            console.error('❌ node-windows is required. Please install it with: npm install node-windows');
        }
    }
    else if (platform === 'linux') {
        try {
            await require('child_process').then((cp) => cp.execSync('systemctl stop gitdb && systemctl disable gitdb && rm /etc/systemd/system/gitdb.service && systemctl daemon-reload'));
            console.log('✅ GitDB systemd service uninstalled.');
        }
        catch (e) {
            console.error('❌ Failed to uninstall systemd service. Try running as sudo.');
        }
    }
    else if (platform === 'darwin') {
        const plistFile = `${process.env['HOME']}/Library/LaunchAgents/com.gitdb.server.plist`;
        try {
            await require('child_process').then((cp) => cp.execSync(`launchctl unload ${plistFile}`));
            await require('fs/promises').then((fs) => fs.unlink(plistFile));
            console.log('✅ GitDB launchd service uninstalled.');
        }
        catch (e) {
            console.error('❌ Failed to uninstall launchd service. Try running as sudo.');
        }
    }
    else {
        console.error('❌ Unsupported platform for service uninstall.');
    }
});
program
    .command('start-service')
    .description('Start GitDB background service/daemon')
    .action(async () => {
    const platform = os.platform();
    if (platform === 'win32') {
        try {
            await require('child_process').then((cp) => cp.execSync('net start GitDB'));
            console.log('✅ GitDB service started.');
        }
        catch (e) {
            console.error('❌ Failed to start service. Try running as administrator.');
        }
    }
    else if (platform === 'linux') {
        try {
            await require('child_process').then((cp) => cp.execSync('systemctl start gitdb'));
            console.log('✅ GitDB systemd service started.');
        }
        catch (e) {
            console.error('❌ Failed to start systemd service. Try running as sudo.');
        }
    }
    else if (platform === 'darwin') {
        const plistFile = `${process.env['HOME']}/Library/LaunchAgents/com.gitdb.server.plist`;
        try {
            await require('child_process').then((cp) => cp.execSync(`launchctl load ${plistFile}`));
            console.log('✅ GitDB launchd service started.');
        }
        catch (e) {
            console.error('❌ Failed to start launchd service. Try running as sudo.');
        }
    }
    else {
        console.error('❌ Unsupported platform for service start.');
    }
});
program
    .command('stop-service')
    .description('Stop GitDB background service/daemon')
    .action(async () => {
    const platform = os.platform();
    if (platform === 'win32') {
        try {
            await require('child_process').then((cp) => cp.execSync('net stop GitDB'));
            console.log('✅ GitDB service stopped.');
        }
        catch (e) {
            console.error('❌ Failed to stop service. Try running as administrator.');
        }
    }
    else if (platform === 'linux') {
        try {
            await require('child_process').then((cp) => cp.execSync('systemctl stop gitdb'));
            console.log('✅ GitDB systemd service stopped.');
        }
        catch (e) {
            console.error('❌ Failed to stop systemd service. Try running as sudo.');
        }
    }
    else if (platform === 'darwin') {
        const plistFile = `${process.env['HOME']}/Library/LaunchAgents/com.gitdb.server.plist`;
        try {
            await require('child_process').then((cp) => cp.execSync(`launchctl unload ${plistFile}`));
            console.log('✅ GitDB launchd service stopped.');
        }
        catch (e) {
            console.error('❌ Failed to stop launchd service. Try running as sudo.');
        }
    }
    else {
        console.error('❌ Unsupported platform for service stop.');
    }
});
// If run with no arguments (double-click), start server in background and open shell in new terminal
if (process.argv.length <= 2) {
    // Start server in background
    const serverProc = spawn(process.execPath, [__filename, 'server'], {
        detached: true,
        stdio: 'ignore',
    });
    serverProc.unref();
    // Open a new terminal window with the shell
    if (os.platform() === 'win32') {
        spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', `${process.execPath} ${__filename} shell`], {
            detached: true,
            stdio: 'ignore',
        });
    }
    else if (os.platform() === 'linux' || os.platform() === 'darwin') {
        spawn('x-terminal-emulator', ['-e', `${process.execPath} ${__filename} shell`], {
            detached: true,
            stdio: 'ignore',
        });
    }
    process.exit(0);
}
// Default action - show help
program.action(() => {
    console.log('🚀 GitDB - GitHub-backed NoSQL Database');
    console.log('=====================================');
    console.log('');
    console.log('Available modes:');
    console.log('  gitdb server    - Start REST API server');
    console.log('  gitdb shell     - Start interactive shell');
    console.log('');
    console.log('Available commands:');
    console.log('  gitdb connect <token> <owner> <repo>  - Connect to database');
    console.log('  gitdb collections                     - List collections');
    console.log('  gitdb create-collection <name>        - Create collection');
    console.log('  gitdb delete-collection <name>        - Delete collection');
    console.log('  gitdb documents <collection>          - List documents');
    console.log('  gitdb create-doc <collection> <json>  - Create document');
    console.log('  gitdb read-doc <collection> <id>      - Read document');
    console.log('  gitdb update-doc <collection> <id> <json> - Update document');
    console.log('  gitdb delete-doc <collection> <id>    - Delete document');
    console.log('  gitdb find <collection> <json>        - Find documents');
    console.log('  gitdb status                          - Show status');
    console.log('');
    console.log('For more information, run: gitdb --help');
});
program.parse(process.argv);
//# sourceMappingURL=main.js.map