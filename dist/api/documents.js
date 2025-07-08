import { Router } from 'express';
import { databaseManager } from '../core/database.js';
export const documentRouter = Router();
// Middleware to check database connection
const requireConnection = (req, res, next) => {
    if (!databaseManager.isConnected()) {
        res.status(503).json({
            error: 'Database not connected',
            message: 'Please connect to a database first using POST /api/v1/collections/connect'
        });
        return;
    }
    next();
};
// List all documents in a collection
documentRouter.get('/', requireConnection, async (req, res) => {
    try {
        const { collection } = req.params;
        const documents = await databaseManager.listDocuments(collection);
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
documentRouter.post('/', requireConnection, async (req, res) => {
    try {
        const { collection } = req.params;
        const data = req.body;
        if (!data || typeof data !== 'object') {
            res.status(400).json({
                error: 'Invalid document data',
                message: 'Request body must be a valid JSON object'
            });
            return;
        }
        const document = await databaseManager.createDocument(collection, data);
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
documentRouter.get('/:id', requireConnection, async (req, res) => {
    try {
        const { collection, id } = req.params;
        const document = await databaseManager.readDocument(collection, id);
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
documentRouter.put('/:id', requireConnection, async (req, res) => {
    try {
        const { collection, id } = req.params;
        const data = req.body;
        if (!data || typeof data !== 'object') {
            res.status(400).json({
                error: 'Invalid document data',
                message: 'Request body must be a valid JSON object'
            });
            return;
        }
        const document = await databaseManager.updateDocument(collection, id, data);
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
documentRouter.delete('/:id', requireConnection, async (req, res) => {
    try {
        const { collection, id } = req.params;
        await databaseManager.deleteDocument(collection, id);
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
documentRouter.post('/find', requireConnection, async (req, res) => {
    try {
        const { collection } = req.params;
        const query = req.body;
        if (!query || typeof query !== 'object') {
            res.status(400).json({
                error: 'Invalid query',
                message: 'Request body must be a valid JSON object'
            });
            return;
        }
        const documents = await databaseManager.findDocuments(collection, query);
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