# 🗂️ GitDB: Essential Guide & SDK Reference

**Production-ready NoSQL database that stores data in Git repositories with advanced features like GraphQL, AI-powered queries, version control, and performance optimizations.**

---

## 🚀 Quick Links

| SDK / Language   | Docs / Repo                                                                 | Package Registry                                  |
|------------------|-----------------------------------------------------------------------------|---------------------------------------------------|
| **JavaScript/TS**| [gitdb-client (npm)](https://www.npmjs.com/package/gitdb-client)            | [Docs](https://www.npmjs.com/package/gitdb-client) |
| **Go**           | [gitdb-go-client (GitHub)](https://github.com/karthikeyanV2K/gitdb-go-client)| [GoDoc](https://pkg.go.dev/github.com/karthikeyanV2K/gitdb-go-client) |
| **PHP**          | [gitdb-php-client (GitHub)](https://github.com/karthikeyanV2K/gitdb-php-client) | [Packagist](https://packagist.org/packages/gitdb/client) |
| **Rust**         | [gitdb-client (crates.io)](https://crates.io/crates/gitdb-client)           | [Docs](https://docs.rs/gitdb-client)              |
| **Python**       | [gitdb-client (PyPI)](https://pypi.org/project/gitdb-client/)               | [Docs](https://pypi.org/project/gitdb-client/)    |
| **Ruby**         | [gitdb-client (RubyGems)](https://rubygems.org/gems/gitdb-client)           | [Docs](https://rubygems.org/gems/gitdb-client)    |

---

## 📝 GitDB CLI Command Table

| Command | Usage & Options | Description |
|---------|-----------------|-------------|
| **Connect** | `gitdb connect -t <token> -o <owner> -r <repo>` | Connect CLI to a GitHub repo as your database |
| **List Collections** | `gitdb collections` | List all collections (tables) |
| **Create Collection** | `gitdb create-collection <name>` | Create a new collection |
| **Delete Collection** | `gitdb delete-collection <name>` | Delete a collection and all its documents |
| **List Documents** | `gitdb documents <collection>` | List all documents in a collection |
| **Create Document** | `gitdb create-doc <collection> <json-data>` | Add a new document to a collection |
| **Read Document** | `gitdb read-doc <collection> <id>` | Read a document by its ID |
| **Update Document** | `gitdb update-doc <collection> <id> <json-data>` | Update a document by its ID |
| **Delete Document** | `gitdb delete-doc <collection> <id>` | Delete a document by its ID |
| **Find Documents** | `gitdb find <collection> <query>` | Find documents matching a MongoDB-style query |
| **Find One Document** | `gitdb findone <collection> <query>` | Find a single document matching the query |
| **Version History** | `gitdb version history <collection>` | Show Git commit history for a collection |
| **Rollback Version** | `gitdb version rollback <collection> --commit <hash>` | Roll back a collection to a previous commit |
| **Start Server** | `gitdb server` | Start the GitDB server (REST/GraphQL API) |
| **Start Server (bg)** | `gitdb server-start` | Start the server in the background |
| **Stop Server** | `gitdb server-stop` | Stop the server |
| **Server Status** | `gitdb server-status` | Check the server status |
| **Enable SuperMode** | `gitdb supermode enable --cache-size <n>` | Enable performance optimizations |
| **Show GraphQL Schema** | `gitdb graphql schema` | Show the current GraphQL schema |
| **Interactive Shell** | `gitdb shell` | Start an interactive shell for running commands |
| **Shell: Set Token** | `set token <token>` | Set GitHub token (in shell) |
| **Shell: Set Owner** | `set owner <owner>` | Set repository owner (in shell) |
| **Shell: Set Repo** | `set repo <repo>` | Set repository name (in shell) |
| **Shell: Use Collection** | `use <collection>` | Switch to a collection (in shell) |
| **Shell: Show Collections** | `show collections` | List all collections (in shell) |
| **Shell: Show Docs** | `show docs` | List documents in current collection (in shell) |
| **Shell: Insert** | `insert <JSON>` | Insert a document (in shell) |
| **Shell: Find by ID** | `find <id>` | Find document by ID (in shell) |
| **Shell: Find by Query** | `findone <json-query>` | Find document by query (in shell) |
| **Shell: Count** | `count [json-query]` | Count documents (optionally by query, in shell) |
| **Shell: Update** | `update <id> <JSON>` | Update document by ID (in shell) |
| **Shell: Delete** | `delete <id>` | Delete document by ID (in shell) |
| **Shell: Help** | `help` | Show help (in shell) |
| **Shell: Exit** | `exit` | Exit the shell |

---

## 🏁 Getting Started

1. **Create a GitHub repo** for your data.
2. **Generate a GitHub token** with `repo` permissions.
3. **Install the CLI:**
```bash
npm install -g gitdb-database
   ```
4. **Connect:**
```bash
   gitdb connect -t <token> -o <owner> -r <repo>
   ```

---

# 🗂️ GitDB Command Reference & Workflow Guide

## 1. **GitDB CLI: Core Commands**

### **Database Connection & Setup**
- `gitdb connect -t <token> -o <owner> -r <repo>`
  - Connects your CLI to a GitHub repository as your database.
  - **Example:**  
    `gitdb connect -t ghp_abc123 -o myuser -r mydb-repo`

### **Collection Management**
- `gitdb collections` — List all collections
- `gitdb create-collection <name>` — Create a new collection
- `gitdb delete-collection <name>` — Delete a collection

### **Document Operations**
- `gitdb documents <collection>` — List all documents in a collection
- `gitdb create-doc <collection> <json-data>` — Add a new document
- `gitdb read-doc <collection> <id>` — Read a document by ID
- `gitdb update-doc <collection> <id> <json-data>` — Update a document
- `gitdb delete-doc <collection> <id>` — Delete a document by ID

### **Querying**
- `gitdb find <collection> <query>` — Find documents matching a MongoDB-style query
- `gitdb findone <collection> <query>` — Find a single document matching the query

### **Version Control & History**
- `gitdb version history <collection>` — Show Git commit history for a collection
- `gitdb version rollback <collection> --commit <hash>` — Roll back a collection to a previous commit

### **Server Management**
- `gitdb server` — Start the GitDB server (REST/GraphQL API)
- `gitdb server-start` / `gitdb server-stop` / `gitdb server-status` — Manage the server process

### **Advanced Features**
- `gitdb supermode enable --cache-size <n>` — Enable performance optimizations
- `gitdb graphql schema` — Show the current GraphQL schema
- `gitdb shell` — Start an interactive shell for running commands

---

## 2. **Typical GitDB Workflow**

### **A. Initial Setup**
1. **Create a GitHub repo** for your data.
2. **Generate a GitHub token** with `repo` permissions.
3. **Connect** using the CLI:
```bash
gitdb connect -t <token> -o <owner> -r <repo>
   ```

### **B. Creating Collections & Documents**
1. **Create collections** for your data types:
```bash
   gitdb create-collection users
   gitdb create-collection products
   ```
2. **Insert documents**:
```bash
   gitdb create-doc users '{"name":"Alice","email":"alice@example.com"}'
   gitdb create-doc products '{"name":"Laptop","price":999.99}'
   ```

### **C. Querying & Updating Data**
- **Find users over 25:**
```bash
  gitdb find users '{"age":{"$gt":25}}'
  ```
- **Update a user:**
  ```bash
  gitdb update-doc users <id> '{"email":"new@email.com"}'
  ```
- **Delete a product:**
```bash
  gitdb delete-doc products <id>
  ```

### **D. Version Control**
- **View history:**
  ```bash
  gitdb version history users
  ```
- **Rollback:**
```bash
  gitdb version rollback users --commit <hash>
  ```

### **E. Server/API Usage**
- **Start the server:**
```bash
gitdb server
```
- **Access REST API:**  
  `http://localhost:7896/api/v1/collections/users`
- **Access GraphQL API:**  
  `http://localhost:7896/graphql`

---

## 3. **Interactive Shell Commands**

Inside `gitdb shell`, you can use:
- `set token <token>`
- `set owner <owner>`
- `set repo <repo>`
- `use <collection>`
- `create-collection <name>`
- `show collections`
- `show docs`
- `insert <JSON>`
- `find <id>`
- `findone <json-query>`
- `count [json-query]`
- `update <id> <JSON>`
- `delete <id>`
- `help`
- `exit`

---

## 4. **SDK Usage Example (JavaScript/TypeScript)**

```js
import { GitDBClient } from 'gitdb-client';

const client = new GitDBClient({
  owner: 'your-github-username',
  repo: 'your-repo',
  token: 'your-github-token',
});

// Insert a document
await client.insert('users', { name: 'Alice', email: 'alice@example.com' });

// Query documents
const users = await client.findOne('users', { name: 'Alice' });

// Update a document
await client.update('users', users[0].id, { age: 31 });

// Delete a document
await client.delete('users', users[0].id);
```

---

## 5. **Where to Find More**

- **Full Book & Advanced Docs:** [GITDB-Guide.md (Full Book)](https://github.com/karthikeyanV2K/GitDB/blob/main/GITDB-Guide.md)
- **SDK Docs:** See links in the table above for each language
- **API Reference:** [GITDB-COMPLETE-BOOK.md](GITDB-COMPLETE-BOOK.md) and server endpoints

---

**If you want a deep-dive into any specific command, workflow, or integration, just ask!**
