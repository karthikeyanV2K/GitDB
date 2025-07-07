export interface Document {
    _id: string;
    _metadata: {
        created_at: string;
        updated_at: string;
        version: number;
    };
    data: Record<string, any>;
}
//# sourceMappingURL=document.d.ts.map