import { Octokit } from '@octokit/rest';
class DatabaseManager {
    connection = null;
    config = null;
    async connect(config) {
        try {
            const octokit = new Octokit({ auth: config.token });
            // Test the connection by trying to get repo info
            await octokit.repos.get({
                owner: config.owner,
                repo: config.repo
            });
            this.connection = {
                octokit,
                owner: config.owner,
                repo: config.repo,
                isConnected: true
            };
            this.config = config;
            return this.connection;
        }
        catch (error) {
            throw new Error(`Failed to connect to database: ${error.message}`);
        }
    }
    async disconnect() {
        this.connection = null;
        this.config = null;
    }
    getConnection() {
        return this.connection;
    }
    isConnected() {
        return this.connection?.isConnected || false;
    }
    async ensureConnected() {
        if (!this.connection || !this.connection.isConnected) {
            if (!this.config) {
                throw new Error('No database configuration available. Please connect first.');
            }
            return await this.connect(this.config);
        }
        return this.connection;
    }
    // Database initialization
    async initializeDatabase() {
        const conn = await this.ensureConnected();
        try {
            // Create a README file to initialize the repo structure
            await conn.octokit.repos.createOrUpdateFileContents({
                owner: conn.owner,
                repo: conn.repo,
                path: 'README.md',
                message: 'Initialize GitDB database',
                content: Buffer.from('# GitDB Database\n\nThis repository serves as a NoSQL database using Git as storage.\n\n## Collections\n\nCollections are stored as directories, and documents as JSON files.\n').toString('base64')
            });
        }
        catch (error) {
            // If file already exists, that's fine
            console.log('Database already initialized');
        }
    }
    // Collection management
    async createCollection(name) {
        const conn = await this.ensureConnected();
        try {
            await conn.octokit.repos.createOrUpdateFileContents({
                owner: conn.owner,
                repo: conn.repo,
                path: `${name}/.gitkeep`,
                message: `Create collection: ${name}`,
                content: Buffer.from('').toString('base64')
            });
        }
        catch (error) {
            throw new Error(`Failed to create collection ${name}: ${error.message}`);
        }
    }
    async listCollections() {
        const conn = await this.ensureConnected();
        try {
            const { data } = await conn.octokit.repos.getContent({
                owner: conn.owner,
                repo: conn.repo,
                path: ''
            });
            if (Array.isArray(data)) {
                return data
                    .filter(item => item.type === 'dir' && !item.name.startsWith('.'))
                    .map(item => item.name);
            }
            return [];
        }
        catch (error) {
            throw new Error(`Failed to list collections: ${error.message}`);
        }
    }
    async deleteCollection(name) {
        const conn = await this.ensureConnected();
        try {
            // Get all files in the collection
            const { data } = await conn.octokit.repos.getContent({
                owner: conn.owner,
                repo: conn.repo,
                path: name
            });
            if (Array.isArray(data)) {
                // Delete all files in the collection
                for (const file of data) {
                    if (file.type === 'file') {
                        await conn.octokit.repos.deleteFile({
                            owner: conn.owner,
                            repo: conn.repo,
                            path: file.path,
                            message: `Delete file from collection ${name}`,
                            sha: file.sha
                        });
                    }
                }
            }
        }
        catch (error) {
            throw new Error(`Failed to delete collection ${name}: ${error.message}`);
        }
    }
    // Document operations
    async createDocument(collection, data) {
        const conn = await this.ensureConnected();
        const id = data._id || this.generateId();
        const path = `${collection}/${id}.json`;
        try {
            const documentData = { _id: id, ...data, createdAt: new Date().toISOString() };
            const content = Buffer.from(JSON.stringify(documentData, null, 2)).toString('base64');
            // Try to create the file, retry if SHA error occurs
            try {
                await conn.octokit.repos.createOrUpdateFileContents({
                    owner: conn.owner,
                    repo: conn.repo,
                    path,
                    message: `Create document ${id} in ${collection}`,
                    content
                });
            }
            catch (error) {
                // If error is a SHA mismatch, fetch the latest SHA and retry
                if (error?.message && error.message.includes('expected')) {
                    // Fetch the latest file SHA (if file exists)
                    let sha = undefined;
                    try {
                        const { data: fileData } = await conn.octokit.repos.getContent({
                            owner: conn.owner,
                            repo: conn.repo,
                            path
                        });
                        if ('sha' in fileData)
                            sha = fileData.sha;
                    }
                    catch { }
                    await conn.octokit.repos.createOrUpdateFileContents({
                        owner: conn.owner,
                        repo: conn.repo,
                        path,
                        message: `Create document ${id} in ${collection} (retry)`,
                        content,
                        sha
                    });
                }
                else {
                    throw error;
                }
            }
            return documentData;
        }
        catch (error) {
            throw new Error(`Failed to create document: ${error.message}`);
        }
    }
    async readDocument(collection, id) {
        const conn = await this.ensureConnected();
        const path = `${collection}/${id}.json`;
        try {
            const { data } = await conn.octokit.repos.getContent({
                owner: conn.owner,
                repo: conn.repo,
                path
            });
            if ('content' in data && typeof data.content === 'string') {
                return JSON.parse(Buffer.from(data.content, 'base64').toString());
            }
            throw new Error('Invalid document format');
        }
        catch (error) {
            throw new Error(`Failed to read document ${id}: ${error.message}`);
        }
    }
    async updateDocument(collection, id, data) {
        const conn = await this.ensureConnected();
        const path = `${collection}/${id}.json`;
        try {
            // Get current file to get SHA
            const { data: fileData } = await conn.octokit.repos.getContent({
                owner: conn.owner,
                repo: conn.repo,
                path
            });
            if (!('sha' in fileData) || !('content' in fileData)) {
                throw new Error('Document not found');
            }
            const currentData = JSON.parse(Buffer.from(fileData.content, 'base64').toString());
            const updatedData = {
                ...currentData,
                ...data,
                _id: id,
                updatedAt: new Date().toISOString()
            };
            const content = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');
            await conn.octokit.repos.createOrUpdateFileContents({
                owner: conn.owner,
                repo: conn.repo,
                path,
                message: `Update document ${id} in ${collection}`,
                content,
                sha: fileData.sha
            });
            return updatedData;
        }
        catch (error) {
            throw new Error(`Failed to update document ${id}: ${error.message}`);
        }
    }
    async deleteDocument(collection, id) {
        const conn = await this.ensureConnected();
        const path = `${collection}/${id}.json`;
        try {
            const { data: fileData } = await conn.octokit.repos.getContent({
                owner: conn.owner,
                repo: conn.repo,
                path
            });
            if (!('sha' in fileData)) {
                throw new Error('Document not found');
            }
            await conn.octokit.repos.deleteFile({
                owner: conn.owner,
                repo: conn.repo,
                path,
                message: `Delete document ${id} from ${collection}`,
                sha: fileData.sha
            });
            return true;
        }
        catch (error) {
            throw new Error(`Failed to delete document ${id}: ${error.message}`);
        }
    }
    async listDocuments(collection) {
        const conn = await this.ensureConnected();
        try {
            const { data } = await conn.octokit.repos.getContent({
                owner: conn.owner,
                repo: conn.repo,
                path: collection
            });
            if (Array.isArray(data)) {
                return data
                    .filter(item => item.type === 'file' && item.name.endsWith('.json'))
                    .map(item => item.name.replace('.json', ''));
            }
            return [];
        }
        catch (error) {
            throw new Error(`Failed to list documents in ${collection}: ${error.message}`);
        }
    }
    async findDocuments(collection, query) {
        const conn = await this.ensureConnected();
        const documents = [];
        try {
            const { data } = await conn.octokit.repos.getContent({
                owner: conn.owner,
                repo: conn.repo,
                path: collection
            });
            if (Array.isArray(data)) {
                for (const file of data) {
                    if (file.type === 'file' && file.name.endsWith('.json')) {
                        const document = await this.readDocument(collection, file.name.replace('.json', ''));
                        if (this.matchesQuery(document, query)) {
                            documents.push(document);
                        }
                    }
                }
            }
            return documents;
        }
        catch (error) {
            throw new Error(`Failed to find documents in ${collection}: ${error.message}`);
        }
    }
    // MongoDB-style findOne - returns first matching document
    async findOne(collection, query) {
        const documents = await this.findDocuments(collection, query);
        return documents.length > 0 ? documents[0] : null;
    }
    // MongoDB-style find with limit
    async find(collection, query, limit) {
        const documents = await this.findDocuments(collection, query);
        return limit ? documents.slice(0, limit) : documents;
    }
    // MongoDB-style count
    async count(collection, query = {}) {
        const documents = await this.findDocuments(collection, query);
        return documents.length;
    }
    // MongoDB-style updateMany
    async updateMany(collection, query, update) {
        const documents = await this.findDocuments(collection, query);
        let updatedCount = 0;
        for (const doc of documents) {
            try {
                await this.updateDocument(collection, doc._id, update);
                updatedCount++;
            }
            catch (error) {
                console.error(`Failed to update document ${doc._id}: ${error}`);
            }
        }
        return updatedCount;
    }
    // MongoDB-style deleteMany
    async deleteMany(collection, query) {
        const documents = await this.findDocuments(collection, query);
        let deletedCount = 0;
        for (const doc of documents) {
            try {
                await this.deleteDocument(collection, doc._id);
                deletedCount++;
            }
            catch (error) {
                console.error(`Failed to delete document ${doc._id}: ${error}`);
            }
        }
        return deletedCount;
    }
    // MongoDB-style distinct
    async distinct(collection, field, query = {}) {
        const documents = await this.findDocuments(collection, query);
        const values = documents.map(doc => doc[field]).filter(value => value !== undefined);
        return [...new Set(values)];
    }
    generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    matchesQuery(document, query) {
        for (const [key, value] of Object.entries(query)) {
            if (!this.matchesField(document[key], value)) {
                return false;
            }
        }
        return true;
    }
    matchesField(documentValue, queryValue) {
        // Handle different query operators
        if (typeof queryValue === 'object' && queryValue !== null) {
            for (const [operator, operatorValue] of Object.entries(queryValue)) {
                switch (operator) {
                    case '$eq':
                        return documentValue === operatorValue;
                    case '$ne':
                        return documentValue !== operatorValue;
                    case '$gt':
                        return documentValue > operatorValue;
                    case '$gte':
                        return documentValue >= operatorValue;
                    case '$lt':
                        return documentValue < operatorValue;
                    case '$lte':
                        return documentValue <= operatorValue;
                    case '$in':
                        return Array.isArray(operatorValue) && operatorValue.includes(documentValue);
                    case '$nin':
                        return Array.isArray(operatorValue) && !operatorValue.includes(documentValue);
                    case '$regex':
                        return typeof documentValue === 'string' &&
                            new RegExp(operatorValue).test(documentValue);
                    case '$exists':
                        return operatorValue ? documentValue !== undefined : documentValue === undefined;
                    default:
                        return false;
                }
            }
        }
        // Simple equality match
        return documentValue === queryValue;
    }
}
// Export singleton instance
export const databaseManager = new DatabaseManager();
//# sourceMappingURL=database.js.map