"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRouter = void 0;
const express_1 = require("express");
const database_js_1 = require("../core/database.js");
exports.documentRouter = (0, express_1.Router)();
// Middleware to check database connection
const requireConnection = (req, res, next) => {
    if (!database_js_1.databaseManager.isConnected()) {
        res.status(503).json({
            error: 'Database not connected',
            message: 'Please connect to a database first using POST /api/v1/collections/connect'
        });
        return;
    }
    next();
};
// List all documents in a collection
exports.documentRouter.get('/', requireConnection, async (req, res) => {
    try {
        const { collection } = req.params;
        if (!collection) {
            res.status(400).json({
                error: 'Missing collection name',
                message: 'collection is required in params'
            });
            return;
        }
        const documents = await database_js_1.databaseManager.listDocuments(collection);
        res.json({
            success: true,
            collection,
            documents,
            count: documents.length
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to list documents',
            message: error.message
        });
    }
});
// Create a new document
exports.documentRouter.post('/', requireConnection, async (req, res) => {
    try {
        const { collection } = req.params;
        if (!collection) {
            res.status(400).json({
                error: 'Missing collection name',
                message: 'collection is required in params'
            });
            return;
        }
        const data = req.body;
        if (!data || typeof data !== 'object') {
            res.status(400).json({
                error: 'Invalid document data',
                message: 'Request body must be a valid JSON object'
            });
            return;
        }
        const document = await database_js_1.databaseManager.createDocument(collection, data);
        res.status(201).json({
            success: true,
            message: 'Document created successfully',
            document
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to create document',
            message: error.message
        });
    }
});
// Get a specific document by ID
exports.documentRouter.get('/:id', requireConnection, async (req, res) => {
    try {
        const { collection, id } = req.params;
        if (!collection || !id) {
            res.status(400).json({
                error: 'Missing collection or id',
                message: 'collection and id are required in params'
            });
            return;
        }
        const document = await database_js_1.databaseManager.readDocument(collection, id);
        res.json({
            success: true,
            document
        });
    }
    catch (error) {
        res.status(404).json({
            error: 'Document not found',
            message: error.message
        });
    }
});
// Update a document
exports.documentRouter.put('/:id', requireConnection, async (req, res) => {
    try {
        const { collection, id } = req.params;
        if (!collection || !id) {
            res.status(400).json({
                error: 'Missing collection or id',
                message: 'collection and id are required in params'
            });
            return;
        }
        const data = req.body;
        if (!data || typeof data !== 'object') {
            res.status(400).json({
                error: 'Invalid document data',
                message: 'Request body must be a valid JSON object'
            });
            return;
        }
        const document = await database_js_1.databaseManager.updateDocument(collection, id, data);
        res.json({
            success: true,
            message: 'Document updated successfully',
            document
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to update document',
            message: error.message
        });
    }
});
// Delete a document
exports.documentRouter.delete('/:id', requireConnection, async (req, res) => {
    try {
        const { collection, id } = req.params;
        if (!collection || !id) {
            res.status(400).json({
                error: 'Missing collection or id',
                message: 'collection and id are required in params'
            });
            return;
        }
        await database_js_1.databaseManager.deleteDocument(collection, id);
        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to delete document',
            message: error.message
        });
    }
});
// Find documents by query
exports.documentRouter.post('/find', requireConnection, async (req, res) => {
    try {
        const { collection } = req.params;
        if (!collection) {
            res.status(400).json({
                error: 'Missing collection name',
                message: 'collection is required in params'
            });
            return;
        }
        const query = req.body;
        if (!query || typeof query !== 'object') {
            res.status(400).json({
                error: 'Invalid query',
                message: 'Request body must be a valid JSON object'
            });
            return;
        }
        const documents = await database_js_1.databaseManager.findDocuments(collection, query);
        res.json({
            success: true,
            collection,
            documents,
            count: documents.length
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to find documents',
            message: error.message
        });
    }
});
//# sourceMappingURL=documents.js.map