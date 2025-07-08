import { Octokit } from '@octokit/rest';
export interface DatabaseConfig {
    token: string;
    owner: string;
    repo: string;
}
export interface DatabaseConnection {
    octokit: Octokit;
    owner: string;
    repo: string;
    isConnected: boolean;
}
declare class DatabaseManager {
    private connection;
    private config;
    connect(config: DatabaseConfig): Promise<DatabaseConnection>;
    disconnect(): Promise<void>;
    getConnection(): DatabaseConnection | null;
    isConnected(): boolean;
    ensureConnected(): Promise<DatabaseConnection>;
    initializeDatabase(): Promise<void>;
    createCollection(name: string): Promise<void>;
    listCollections(): Promise<string[]>;
    deleteCollection(name: string): Promise<void>;
    createDocument(collection: string, data: any): Promise<any>;
    readDocument(collection: string, id: string): Promise<any>;
    updateDocument(collection: string, id: string, data: any): Promise<any>;
    deleteDocument(collection: string, id: string): Promise<boolean>;
    listDocuments(collection: string): Promise<string[]>;
    findDocuments(collection: string, query: any): Promise<any[]>;
    findOne(collection: string, query: any): Promise<any | null>;
    find(collection: string, query: any, limit?: number): Promise<any[]>;
    count(collection: string, query?: any): Promise<number>;
    updateMany(collection: string, query: any, update: any): Promise<number>;
    deleteMany(collection: string, query: any): Promise<number>;
    distinct(collection: string, field: string, query?: any): Promise<any[]>;
    private generateId;
    private matchesQuery;
    private matchesField;
}
export declare const databaseManager: DatabaseManager;
export {};
//# sourceMappingURL=database.d.ts.map