"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionConfig = void 0;
exports.productionConfig = {
    server: {
        port: process.env['PORT'] || 7896,
        host: process.env['HOST'] || '0.0.0.0',
        cors: {
            origin: process.env['CORS_ORIGIN'] || '*',
            credentials: true
        },
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        }
    },
    database: {
        maxRetries: 3,
        retryDelay: 1000,
        timeout: 30000,
        cache: {
            enabled: true,
            ttl: 300000 // 5 minutes
        }
    },
    github: {
        timeout: 30000,
        retries: 3,
        rateLimit: {
            enabled: true,
            requestsPerHour: 5000
        }
    },
    logging: {
        level: process.env['LOG_LEVEL'] || 'info',
        format: 'json',
        timestamp: true,
        file: {
            enabled: true,
            path: './logs/gitdb.log',
            maxSize: '10m',
            maxFiles: 5
        }
    },
    security: {
        helmet: true,
        compression: true,
        trustProxy: true
    }
};
//# sourceMappingURL=production.js.map