"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitDatabase = void 0;
const id_1 = require("../utils/id");
const logger_1 = require("../utils/logger");
const logger = (0, logger_1.createLogger)('Database');
class GitDatabase {
    constructor(name = 'gitdb') {
        this.db = {
            name,
            collections: new Map(),
            createdAt: new Date()
        };
        this.cache = new Map();
        logger.info(`Database '${name}' initialized`);
    }
    // Collection Management
    createCollection(name) {
        if (this.db.collections.has(name)) {
            throw new Error(`Collection '${name}' already exists`);
        }
        const collection = {
            name,
            documents: new Map(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.db.collections.set(name, collection);
        logger.info(`Collection '${name}' created`);
        return collection;
    }
    getCollection(name) {
        return this.db.collections.get(name);
    }
    listCollections() {
        return Array.from(this.db.collections.keys());
    }
    deleteCollection(name) {
        const deleted = this.db.collections.delete(name);
        if (deleted) {
            logger.info(`Collection '${name}' deleted`);
        }
        return deleted;
    }
    // Document Operations
    insert(collectionName, document) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        const id = (0, id_1.generateId)();
        const doc = {
            _id: id,
            ...document,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        collection.documents.set(id, doc);
        collection.updatedAt = new Date();
        this.cache.set(id, doc);
        logger.info(`Document inserted in collection '${collectionName}' with ID: ${id}`);
        return id;
    }
    find(collectionName, id) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        // Check cache first
        const cached = this.cache.get(id);
        if (cached) {
            return cached;
        }
        const document = collection.documents.get(id);
        if (document) {
            this.cache.set(id, document);
        }
        return document;
    }
    findOne(collectionName, query) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        for (const [id, document] of collection.documents) {
            if (this.matchesQuery(document, query)) {
                return document;
            }
        }
        return undefined;
    }
    findMany(collectionName, query) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        const documents = [];
        for (const [id, document] of collection.documents) {
            if (!query || this.matchesQuery(document, query)) {
                documents.push(document);
            }
        }
        return documents;
    }
    update(collectionName, id, updates) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        const document = collection.documents.get(id);
        if (!document) {
            return false;
        }
        const updatedDoc = {
            ...document,
            ...updates,
            _id: id, // Preserve the original ID
            updatedAt: new Date()
        };
        collection.documents.set(id, updatedDoc);
        collection.updatedAt = new Date();
        this.cache.set(id, updatedDoc);
        logger.info(`Document ${id} updated in collection '${collectionName}'`);
        return true;
    }
    updateMany(collectionName, query, updates) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        let modifiedCount = 0;
        for (const [id, document] of collection.documents) {
            if (this.matchesQuery(document, query)) {
                const updatedDoc = {
                    ...document,
                    ...updates,
                    _id: id,
                    updatedAt: new Date()
                };
                collection.documents.set(id, updatedDoc);
                this.cache.set(id, updatedDoc);
                modifiedCount++;
            }
        }
        if (modifiedCount > 0) {
            collection.updatedAt = new Date();
            logger.info(`${modifiedCount} documents updated in collection '${collectionName}'`);
        }
        return modifiedCount;
    }
    delete(collectionName, id) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        const deleted = collection.documents.delete(id);
        if (deleted) {
            this.cache.delete(id);
            collection.updatedAt = new Date();
            logger.info(`Document ${id} deleted from collection '${collectionName}'`);
        }
        return deleted;
    }
    deleteMany(collectionName, query) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        let deletedCount = 0;
        const toDelete = [];
        for (const [id, document] of collection.documents) {
            if (this.matchesQuery(document, query)) {
                toDelete.push(id);
            }
        }
        for (const id of toDelete) {
            collection.documents.delete(id);
            this.cache.delete(id);
            deletedCount++;
        }
        if (deletedCount > 0) {
            collection.updatedAt = new Date();
            logger.info(`${deletedCount} documents deleted from collection '${collectionName}'`);
        }
        return deletedCount;
    }
    count(collectionName, query) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        if (!query) {
            return collection.documents.size;
        }
        let count = 0;
        for (const [id, document] of collection.documents) {
            if (this.matchesQuery(document, query)) {
                count++;
            }
        }
        return count;
    }
    distinct(collectionName, field, query) {
        const collection = this.getCollection(collectionName);
        if (!collection) {
            throw new Error(`Collection '${collectionName}' not found`);
        }
        const values = new Set();
        for (const [id, document] of collection.documents) {
            if (!query || this.matchesQuery(document, query)) {
                const value = this.getNestedValue(document, field);
                if (value !== undefined) {
                    values.add(value);
                }
            }
        }
        return Array.from(values);
    }
    // Utility Methods
    matchesQuery(document, query) {
        for (const [key, value] of Object.entries(query)) {
            const docValue = this.getNestedValue(document, key);
            if (docValue !== value) {
                return false;
            }
        }
        return true;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }
    // Database Info
    getDatabaseInfo() {
        return {
            ...this.db,
            collections: new Map(this.db.collections) // Return a copy
        };
    }
    // Cache Management
    clearCache() {
        this.cache.clear();
        logger.info('Cache cleared');
    }
    getCacheSize() {
        return this.cache.size;
    }
}
exports.GitDatabase = GitDatabase;
//# sourceMappingURL=database.js.map