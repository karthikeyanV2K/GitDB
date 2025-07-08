declare class GitDBShell {
    private rl;
    private state;
    constructor();
    private setupEventListeners;
    private processCommand;
    private handleSet;
    private handleUse;
    private handleCreateCollection;
    private handleShow;
    private showCollections;
    private showDocs;
    private handleInsert;
    private handleFind;
    private handleFindOne;
    private handleCount;
    private handleUpdate;
    private handleUpdateMany;
    private handleDelete;
    private handleDeleteMany;
    private handleDistinct;
    private makeRequest;
    private showHelp;
    start(): void;
}
export default GitDBShell;
//# sourceMappingURL=shell.d.ts.map