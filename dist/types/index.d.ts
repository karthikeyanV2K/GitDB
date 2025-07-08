export interface Document {
    _id: string;
    [key: string]: any;
}
export interface Collection {
    name: string;
    documents: Map<string, Document>;
    createdAt: Date;
    updatedAt: Date;
}
export interface Database {
    collections: Map<string, Collection>;
    name: string;
    createdAt: Date;
}
export interface InsertResponse {
    success: boolean;
    id: string;
    message?: string;
    error?: string;
}
export interface FindResponse {
    success: boolean;
    document?: Document;
    documents?: Document[];
    count?: number;
    message?: string;
    error?: string;
}
export interface UpdateResponse {
    success: boolean;
    modifiedCount: number;
    message?: string;
    error?: string;
}
export interface DeleteResponse {
    success: boolean;
    deletedCount: number;
    message?: string;
    error?: string;
}
export interface CollectionResponse {
    success: boolean;
    collections?: string[];
    message?: string;
    error?: string;
}
export interface ServerConfig {
    port: number;
    host: string;
    corsOrigin: string;
    logLevel: string;
}
export interface ShellConfig {
    prompt: string;
    serverUrl: string;
}
//# sourceMappingURL=index.d.ts.map