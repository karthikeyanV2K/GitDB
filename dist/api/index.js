"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApiRoutes = registerApiRoutes;
const collections_js_1 = require("./collections.js");
const documents_js_1 = require("./documents.js");
function registerApiRoutes(app) {
    // API root endpoint
    app.get('/api/v1', (req, res) => {
        res.json({
            name: 'GitDB API',
            version: '1.0.0',
            description: 'GitHub-backed NoSQL database API',
            endpoints: {
                collections: '/api/v1/collections',
                documents: '/api/v1/collections/:collection/documents'
            }
        });
    });
    // Collection routes
    app.use('/api/v1/collections', collections_js_1.collectionRouter);
    // Document routes - merge params to access collection from parent route
    app.use('/api/v1/collections/:collection/documents', documents_js_1.documentRouter);
}
//# sourceMappingURL=index.js.map