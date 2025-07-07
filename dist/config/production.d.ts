export declare const productionConfig: {
    server: {
        port: string | number;
        host: string;
        cors: {
            origin: string;
            credentials: boolean;
        };
        rateLimit: {
            windowMs: number;
            max: number;
        };
    };
    database: {
        maxRetries: number;
        retryDelay: number;
        timeout: number;
        cache: {
            enabled: boolean;
            ttl: number;
        };
    };
    github: {
        timeout: number;
        retries: number;
        rateLimit: {
            enabled: boolean;
            requestsPerHour: number;
        };
    };
    logging: {
        level: string;
        format: string;
        timestamp: boolean;
        file: {
            enabled: boolean;
            path: string;
            maxSize: string;
            maxFiles: number;
        };
    };
    security: {
        helmet: boolean;
        compression: boolean;
        trustProxy: boolean;
    };
};
//# sourceMappingURL=production.d.ts.map