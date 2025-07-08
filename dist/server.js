"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const database_1 = require("./core/database");
const logger_1 = require("./utils/logger");
const logger = (0, logger_1.createLogger)('Server');
// Initialize database
const db = new database_1.GitDatabase();
// Server configuration
const config = {
    port: parseInt(process.env.PORT || '7896'),
    host: process.env.HOST || '0.0.0.0',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    logLevel: process.env.LOG_LEVEL || 'info'
};
// Create Express app
const app = express();
// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// API Router
const apiRouter = express.Router();
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: db.getDatabaseInfo().name,
        cacheSize: db.getCacheSize()
    });
});
// Collection Management Endpoints
apiRouter.post('/collections', (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Collection name is required'
            });
        }
        const collection = db.createCollection(name);
        return res.status(201).json({
            success: true,
            collection: {
                name: collection.name,
                createdAt: collection.createdAt,
                updatedAt: collection.updatedAt
            }
        });
    }
    catch (error) {
        logger.error('Error creating collection', { error: error.message });
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.get('/collections', (req, res) => {
    try {
        const collections = db.listCollections();
        const response = {
            success: true,
            collections
        };
        res.json(response);
    }
    catch (error) {
        logger.error('Error listing collections', { error: error.message });
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.delete('/collections/:name', (req, res) => {
    try {
        const { name } = req.params;
        const deleted = db.deleteCollection(name);
        if (deleted) {
            res.json({ success: true, message: `Collection '${name}' deleted` });
        }
        else {
            res.status(404).json({
                success: false,
                error: `Collection '${name}' not found`
            });
        }
    }
    catch (error) {
        logger.error('Error deleting collection', { error: error.message });
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Document Operations Endpoints
apiRouter.post('/documents', (req, res) => {
    try {
        const { collection, document } = req.body;
        if (!collection || !document) {
            return res.status(400).json({
                success: false,
                error: 'Collection name and document are required'
            });
        }
        const id = db.insert(collection, document);
        const response = {
            success: true,
            id,
            message: 'Document inserted successfully'
        };
        return res.status(201).json(response);
    }
    catch (error) {
        logger.error('Error inserting document', { error: error.message });
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.get('/documents/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { collection } = req.query;
        if (!collection || typeof collection !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Collection name is required'
            });
        }
        const document = db.find(collection, id);
        const response = {
            success: true,
            document
        };
        if (document) {
            return res.json(response);
        }
        else {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }
    }
    catch (error) {
        logger.error('Error finding document', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.post('/documents/findone', (req, res) => {
    try {
        const { collection, query } = req.body;
        if (!collection || !query) {
            return res.status(400).json({
                success: false,
                error: 'Collection name and query are required'
            });
        }
        const document = db.findOne(collection, query);
        const response = {
            success: true,
            document
        };
        if (document) {
            return res.json(response);
        }
        else {
            return res.status(404).json({
                success: false,
                error: 'No document found matching query'
            });
        }
    }
    catch (error) {
        logger.error('Error finding document', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.get('/documents', (req, res) => {
    try {
        const { collection, query } = req.query;
        if (!collection || typeof collection !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Collection name is required'
            });
        }
        let parsedQuery = undefined;
        if (query && typeof query === 'string') {
            try {
                parsedQuery = JSON.parse(query);
            }
            catch (e) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid query format'
                });
            }
        }
        const documents = db.findMany(collection, parsedQuery);
        const response = {
            success: true,
            documents
        };
        return res.json(response);
    }
    catch (error) {
        logger.error('Error showing documents', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.post('/documents/count', (req, res) => {
    try {
        const { collection, query } = req.body;
        if (!collection) {
            return res.status(400).json({
                success: false,
                error: 'Collection name is required'
            });
        }
        const count = db.count(collection, query);
        const response = {
            success: true,
            count
        };
        return res.json(response);
    }
    catch (error) {
        logger.error('Error counting documents', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.put('/documents/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { collection, updates } = req.body;
        if (!collection || !updates) {
            return res.status(400).json({
                success: false,
                error: 'Collection name and updates are required'
            });
        }
        const updated = db.update(collection, id, updates);
        const response = {
            success: updated,
            modifiedCount: updated ? 1 : 0,
            message: updated ? 'Document updated successfully' : 'Document not found'
        };
        if (updated) {
            return res.json(response);
        }
        else {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }
    }
    catch (error) {
        logger.error('Error updating document', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.post('/documents/updatemany', (req, res) => {
    try {
        const { collection, query, updates } = req.body;
        if (!collection || !query || !updates) {
            return res.status(400).json({
                success: false,
                error: 'Collection name, query, and updates are required'
            });
        }
        const modifiedCount = db.updateMany(collection, query, updates);
        const response = {
            success: true,
            modifiedCount,
            message: `${modifiedCount} documents updated`
        };
        return res.json(response);
    }
    catch (error) {
        logger.error('Error updating documents', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.delete('/documents/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { collection } = req.query;
        if (!collection || typeof collection !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Collection name is required'
            });
        }
        const deleted = db.delete(collection, id);
        const response = {
            success: deleted,
            deletedCount: deleted ? 1 : 0,
            message: deleted ? 'Document deleted successfully' : 'Document not found'
        };
        if (deleted) {
            return res.json(response);
        }
        else {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }
    }
    catch (error) {
        logger.error('Error deleting document', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.post('/documents/deletemany', (req, res) => {
    try {
        const { collection, query } = req.body;
        if (!collection || !query) {
            return res.status(400).json({
                success: false,
                error: 'Collection name and query are required'
            });
        }
        const deletedCount = db.deleteMany(collection, query);
        const response = {
            success: true,
            deletedCount,
            message: `${deletedCount} documents deleted`
        };
        return res.json(response);
    }
    catch (error) {
        logger.error('Error deleting documents', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
apiRouter.post('/documents/distinct', (req, res) => {
    try {
        const { collection, field, query } = req.body;
        if (!collection || !field) {
            return res.status(400).json({
                success: false,
                error: 'Collection name and field are required'
            });
        }
        const distinctValues = db.distinct(collection, field, query);
        return res.json({
            success: true,
            field,
            values: distinctValues,
            count: distinctValues.length
        });
    }
    catch (error) {
        logger.error('Error getting distinct values', { error: error.message });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Mount API router
app.use('/api', apiRouter);
// Database management endpoints
app.post('/clear-cache', (req, res) => {
    try {
        db.clearCache();
        res.json({
            success: true,
            message: 'Cache cleared successfully'
        });
    }
    catch (error) {
        logger.error('Error clearing cache', { error: error.message });
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.get('/database-info', (req, res) => {
    try {
        const info = db.getDatabaseInfo();
        res.json({
            success: true,
            database: info
        });
    }
    catch (error) {
        logger.error('Error getting database info', { error: error.message });
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error', { error: error.message, stack: error.stack });
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});
// Start server
const server = app.listen(config.port, config.host, () => {
    logger.info(`GitDB Server running on http://${config.host}:${config.port}`);
    logger.info(`Health check: http://${config.host}:${config.port}/health`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map