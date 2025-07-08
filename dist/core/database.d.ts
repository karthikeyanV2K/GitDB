import { Database, Collection, Document } from '../types';
export declare class GitDatabase {
    private db;
    private cache;
    constructor(name?: string);
    createCollection(name: string): Collection;
    getCollection(name: string): Collection | undefined;
    listCollections(): string[];
    deleteCollection(name: string): boolean;
    insert(collectionName: string, document: any): string;
    find(collectionName: string, id: string): Document | undefined;
    findOne(collectionName: string, query: any): Document | undefined;
    findMany(collectionName: string, query?: any): Document[];
    update(collectionName: string, id: string, updates: any): boolean;
    updateMany(collectionName: string, query: any, updates: any): number;
    delete(collectionName: string, id: string): boolean;
    deleteMany(collectionName: string, query: any): number;
    count(collectionName: string, query?: any): number;
    distinct(collectionName: string, field: string, query?: any): any[];
    private matchesQuery;
    private getNestedValue;
    getDatabaseInfo(): Database;
    clearCache(): void;
    getCacheSize(): number;
}
//# sourceMappingURL=database.d.ts.map