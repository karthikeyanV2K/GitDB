import { Octokit } from '@octokit/rest';
export declare function createDocument(collection: string, data: any): Promise<any>;
export declare function readDocument(collection: string, id: string): Promise<any>;
export declare function updateDocument(collection: string, id: string, data: any): Promise<any>;
export declare function deleteDocument(collection: string, id: string): Promise<{
    _id: string;
    deleted: boolean;
}>;
export declare function createDatabase(octokit: Octokit, owner: string, repo: string): Promise<void>;
export declare function createCollection(octokit: Octokit, owner: string, repo: string, name: string): Promise<void>;
export declare function listCollections(octokit: Octokit, owner: string, repo: string): Promise<string[]>;
export declare function listDocuments(octokit: Octokit, owner: string, repo: string, collection: string): Promise<string[]>;
//# sourceMappingURL=crud.d.ts.map