import { collectionRouter } from './collections.js';
import { documentRouter } from './documents.js';
export function registerApiRoutes(app) {
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
    app.use('/api/v1/collections', collectionRouter);
    // Document routes - merge params to access collection from parent route
    app.use('/api/v1/collections/:collection/documents', documentRouter);
}
//# sourceMappingURL=index.js.map