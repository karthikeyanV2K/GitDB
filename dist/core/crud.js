"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = createDocument;
exports.readDocument = readDocument;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
exports.createDatabase = createDatabase;
exports.createCollection = createCollection;
exports.listCollections = listCollections;
exports.listDocuments = listDocuments;
async function getOctokit() {
    const { Octokit } = await Promise.resolve().then(() => require('@octokit/rest'));
    return new Octokit({ auth: process.env['GITHUB_TOKEN'] });
}
function getDocumentPath(collection, id) {
    return `${collection}/${id}.json`;
}
async function createDocument(collection, data) {
    const id = data._id || Math.random().toString(36).substr(2, 9);
    const path = getDocumentPath(collection, id);
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    try {
        const octokit = await getOctokit();
        await octokit.repos.createOrUpdateFileContents({
            owner: process.env['GITHUB_OWNER'] || 'your-github-username',
            repo: process.env['GITHUB_REPO'] || 'your-repo-name',
            path,
            message: `Create document ${id} in ${collection}`,
            content,
        });
        return { _id: id, ...data };
    }
    catch (err) {
        throw new Error('Failed to create document: ' + err.message);
    }
}
async function readDocument(collection, id) {
    const path = getDocumentPath(collection, id);
    try {
        const octokit = await getOctokit();
        const { data } = await octokit.repos.getContent({
            owner: process.env['GITHUB_OWNER'] || 'your-github-username',
            repo: process.env['GITHUB_REPO'] || 'your-repo-name',
            path,
        });
        if ('content' in data && typeof data.content === 'string') {
            return JSON.parse(Buffer.from(data.content, 'base64').toString());
        }
        throw new Error('Invalid content format');
    }
    catch (err) {
        throw new Error('Failed to read document: ' + err.message);
    }
}
async function updateDocument(collection, id, data) {
    const path = getDocumentPath(collection, id);
    try {
        const octokit = await getOctokit();
        const { data: fileData } = await octokit.repos.getContent({
            owner: process.env['GITHUB_OWNER'] || 'your-github-username',
            repo: process.env['GITHUB_REPO'] || 'your-repo-name',
            path,
        });
        if (!('sha' in fileData))
            throw new Error('File not found');
        const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
        await octokit.repos.createOrUpdateFileContents({
            owner: process.env['GITHUB_OWNER'] || 'your-github-username',
            repo: process.env['GITHUB_REPO'] || 'your-repo-name',
            path,
            message: `Update document ${id} in ${collection}`,
            content,
            sha: fileData.sha,
        });
        return { _id: id, ...data };
    }
    catch (err) {
        throw new Error('Failed to update document: ' + err.message);
    }
}
async function deleteDocument(collection, id) {
    const path = getDocumentPath(collection, id);
    try {
        const octokit = await getOctokit();
        const { data: fileData } = await octokit.repos.getContent({
            owner: process.env['GITHUB_OWNER'] || 'your-github-username',
            repo: process.env['GITHUB_REPO'] || 'your-repo-name',
            path,
        });
        if (!('sha' in fileData))
            throw new Error('File not found');
        await octokit.repos.deleteFile({
            owner: process.env['GITHUB_OWNER'] || 'your-github-username',
            repo: process.env['GITHUB_REPO'] || 'your-repo-name',
            path,
            message: `Delete document ${id} in ${collection}`,
            sha: fileData.sha,
        });
        return { _id: id, deleted: true };
    }
    catch (err) {
        throw new Error('Failed to delete document: ' + err.message);
    }
}
// CLI helpers: allow passing Octokit and owner/repo directly
async function createDatabase(octokit, owner, repo) {
    // Create a new repo if it doesn't exist
    try {
        await octokit.repos.get({ owner, repo });
    }
    catch {
        await octokit.repos.createForAuthenticatedUser({ name: repo });
    }
}
async function createCollection(octokit, owner, repo, name) {
    // Create a .gitkeep file in the collection folder
    await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `${name}/.gitkeep`,
        message: `Create collection ${name}`,
        content: '',
    });
}
async function listCollections(octokit, owner, repo) {
    const { data } = await octokit.repos.getContent({ owner, repo, path: '' });
    return (Array.isArray(data) ? data.filter(f => f.type === 'dir').map(f => f.name) : []);
}
async function listDocuments(octokit, owner, repo, collection) {
    const { data } = await octokit.repos.getContent({ owner, repo, path: collection });
    return (Array.isArray(data) ? data.filter(f => f.type === 'file').map(f => f.name.replace(/\.json$/, '')) : []);
}
//# sourceMappingURL=crud.js.map