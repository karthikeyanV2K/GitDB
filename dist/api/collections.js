"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionRouter = void 0;
const express_1 = require("express");
const database_js_1 = require("../core/database.js");
exports.collectionRouter = (0, express_1.Router)();
// Middleware to check database connection
const requireConnection = (req, res, next) => {
    if (!database_js_1.databaseManager.isConnected()) {
        res.status(503).json({
            error: 'Database not connected',
            message: 'Please connect to a database first using POST /api/v1/connect'
        });
        return;
    }
    next();
};
// Connect to database
exports.collectionRouter.post('/connect', async (req, res) => {
    try {
        const { token, owner, repo } = req.body;
        if (!token || !owner || !repo) {
            res.status(400).json({
                error: 'Missing required fields',
                message: 'token, owner, and repo are required'
            });
            return;
        }
        await database_js_1.databaseManager.connect({ token, owner, repo });
        await database_js_1.databaseManager.initializeDatabase();
        res.json({
            success: true,
            message: 'Connected to database successfully',
            database: { owner, repo }
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Connection failed',
            message: error.message
        });
    }
});
// Disconnect from database
exports.collectionRouter.post('/disconnect', async (req, res) => {
    try {
        await database_js_1.databaseManager.disconnect();
        res.json({
            success: true,
            message: 'Disconnected from database'
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Disconnect failed',
            message: error.message
        });
    }
});
// Get connection status
exports.collectionRouter.get('/status', (req, res) => {
    const connection = database_js_1.databaseManager.getConnection();
    res.json({
        connected: database_js_1.databaseManager.isConnected(),
        database: connection ? { owner: connection.owner, repo: connection.repo } : null
    });
});
// List all collections
exports.collectionRouter.get('/', requireConnection, async (req, res) => {
    try {
        const collections = await database_js_1.databaseManager.listCollections();
        res.json({
            success: true,
            collections,
            count: collections.length
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to list collections',
            message: error.message
        });
    }
});
// Create a new collection
exports.collectionRouter.post('/', requireConnection, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({
                error: 'Missing collection name',
                message: 'name is required'
            });
            return;
        }
        await database_js_1.databaseManager.createCollection(name);
        res.status(201).json({
            success: true,
            message: `Collection '${name}' created successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to create collection',
            message: error.message
        });
    }
});
// Delete a collection
exports.collectionRouter.delete('/:name', requireConnection, async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            res.status(400).json({
                error: 'Missing collection name',
                message: 'name is required'
            });
            return;
        }
        await database_js_1.databaseManager.deleteCollection(name);
        res.json({
            success: true,
            message: `Collection '${name}' deleted successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to delete collection',
            message: error.message
        });
    }
});
// Get collection info
exports.collectionRouter.get('/:name', requireConnection, async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            res.status(400).json({
                error: 'Missing collection name',
                message: 'name is required'
            });
            return;
        }
        const documents = await database_js_1.databaseManager.listDocuments(name);
        res.json({
            success: true,
            collection: name,
            documentCount: documents.length,
            documents
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to get collection info',
            message: error.message
        });
    }
});
//# sourceMappingURL=collections.js.map