# GitDB

📦 **GitDB** - GitHub-backed NoSQL Database (npm: `gitdb-database`)

- Modern CLI, interactive shell, REST API
- Store your data in GitHub repositories
- Cross-platform: Windows, Linux, macOS
- Multi-language client support (Node.js, Python, Java, C#, PHP, Go, Ruby, ...)

---

## 🚀 Quick Start

```sh
npm install -g gitdb-database
```

### Start the Server
```sh
gitdb server-start      # Background service
gitdb server            # Foreground mode
```

### Interactive Shell
```sh
gitdb shell
```

### Show Help
```sh
gitdb --help
```

---

## 📋 Features
- ✅ Automatic Service Setup (Windows Service, systemd, launchd)
- ✅ Cross-Platform CLI (`gitdb`, `gitdb-shell`, `gitdb-server`)
- ✅ Zero Configuration (works out of the box)
- ✅ Production Ready (stable, reliable, REST API)
- ✅ GitHub Integration (store data in your repo)
- ✅ Multi-language SDK/Client support

---

## 🛠️ Installation
- **Node.js 18+ required**
- **npm 9+ recommended**

#### Global (recommended)
```sh
npm install -g gitdb-database
```

#### Local (for development)
```sh
npm install gitdb-database
npx gitdb --help
```

---

## 🎯 Usage

### CLI Commands
```sh
gitdb set token <YOUR_GITHUB_TOKEN>
gitdb set owner <YOUR_USERNAME>
gitdb set repo <YOUR_REPO_NAME>
gitdb use <collection>
gitdb create-collection <name>
gitdb insert '{"name": "test", "value": 123}'
gitdb findone '{"name": "test"}'
gitdb find <document_id>
gitdb update <document_id> '{"name": "updated"}'
gitdb updatemany '<query>' '<update>'
gitdb delete <document_id>
gitdb deletemany '<query>'
gitdb count '<query>'
gitdb distinct <field> [query]
```

---

## 🗂️ Collections & Documents
```sh
gitdb create-collection users
gitdb insert '{"name": "John Doe", "email": "john@example.com"}'
gitdb findone '{"name": "John Doe"}'
gitdb count '{"age": {"$gte": 25}}'
gitdb update <id> '{"age": 31}'
gitdb updatemany '{"age": {"$lt": 30}}' '{"status": "young"}'
gitdb delete <id>
gitdb deletemany '{"status": "inactive"}'
```

---

## 🌐 REST API
When the server is running, you can use the REST API:

### Collections
```sh
curl http://localhost:7896/api/collections
curl -X POST http://localhost:7896/api/collections \
  -H "Content-Type: application/json" \
  -d '{"name": "users"}'
```

### Documents
```sh
curl -X POST http://localhost:7896/api/documents \
  -H "Content-Type: application/json" \
  -d '{"collection": "users", "document": {"name": "John", "age": 30}}'
curl "http://localhost:7896/api/documents?collection=users&query={\"age\":{\"$gte\":25}}"
curl -X PUT http://localhost:7896/api/documents/abc123 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "age": 31}'
curl -X DELETE http://localhost:7896/api/documents/abc123
```

---

# 🔌 Multi-Language Developer Cookbook

Below are **full connection and query execution examples** for all major programming languages. Each section covers:
- Connect to GitDB
- Create collection
- Insert document(s)
- Find (by ID, by query)
- Update
- Delete
- Count/distinct
- Batch operations
- Error handling

---

## Node.js (Axios)
```js
const axios = require('axios');
const gitdb = axios.create({ baseURL: 'http://localhost:7896/api' });
// Connect
gitdb.post('/collections/connect', { token, owner, repo });
// Create Collection
gitdb.post('/collections', { name: 'users' });
// Insert Document
gitdb.post('/documents', { collection: 'users', document: { name: 'Alice', age: 30 } });
// Find by ID
gitdb.get('/documents/abc123?collection=users');
// Find by Query
gitdb.get('/documents', { params: { collection: 'users', query: JSON.stringify({ age: { $gte: 25 } }) } });
// Update
gitdb.put('/documents/abc123', { age: 31 });
// Delete
gitdb.delete('/documents/abc123?collection=users');
// Batch Insert
const users = [{ name: 'Bob' }, { name: 'Carol' }];
for (const user of users) {
  await gitdb.post('/documents', { collection: 'users', document: user });
}
// Error Handling
try {
  await gitdb.post('/documents', { collection: 'users', document: { name: 'Alice' } });
} catch (e) {
  console.error(e.response?.data || e.message);
}
```

---

## Python (requests)
```python
import requests, json
s = requests.Session()
s.headers.update({'Content-Type': 'application/json'})
# Connect
s.post('http://localhost:7896/api/collections/connect', json={'token': token, 'owner': owner, 'repo': repo})
# Create Collection
s.post('http://localhost:7896/api/collections', json={'name': 'users'})
# Insert Document
s.post('http://localhost:7896/api/documents', json={'collection': 'users', 'document': {'name': 'Alice', 'age': 30}})
# Find by ID
s.get('http://localhost:7896/api/documents/abc123', params={'collection': 'users'})
# Find by Query
s.get('http://localhost:7896/api/documents', params={'collection': 'users', 'query': json.dumps({'age': {'$gte': 25}})})
# Update
s.put('http://localhost:7896/api/documents/abc123', json={'age': 31})
# Delete
s.delete('http://localhost:7896/api/documents/abc123', params={'collection': 'users'})
# Batch Insert
users = [{'name': 'Bob'}, {'name': 'Carol'}]
for user in users:
    s.post('http://localhost:7896/api/documents', json={'collection': 'users', 'document': user})
# Error Handling
try:
    s.post('http://localhost:7896/api/documents', json={'collection': 'users', 'document': {'name': 'Alice'}})
except requests.exceptions.RequestException as e:
    print('Error:', e)
```

---

## Java (OkHttp)
```java
OkHttpClient client = new OkHttpClient();
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
Request request = new Request.Builder().url("http://localhost:7896/api/collections/connect").post(body).build();
Response response = client.newCall(request).execute();
```

---

## C# (HttpClient)
```csharp
var client = new HttpClient();
client.DefaultRequestHeaders.Add("Content-Type", "application/json");
        var content = new StringContent(json, Encoding.UTF8, "application/json");
await client.PostAsync("http://localhost:7896/api/collections/connect", content);
```

---

## PHP (cURL)
```php
        $ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:7896/api/collections/connect');
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $response = curl_exec($ch);
        curl_close($ch);
```

---

## Go (net/http)
```go
client := &http.Client{}
req, _ := http.NewRequest("POST", "http://localhost:7896/api/collections/connect", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
resp, _ := client.Do(req)
```

---

## Ruby (Net::HTTP)
```ruby
require 'net/http'
require 'json'
uri = URI('http://localhost:7896/api/collections/connect')
    http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
request.body = data.to_json
    response = http.request(request)
```

---

## 🔍 Query Execution Examples (All Languages)
- Data insertion, batch, find, update, delete, count, distinct, aggregation, advanced queries, error handling, performance tips, etc.
- See the full examples above for each language.

---

## 🔧 Service Management
- **Windows:** Service auto-installed. Use `sc query GitDB` to check status.
- **Linux:** `sudo systemctl status gitdb`
- **macOS:** `launchctl list | grep gitdb`

---

## 🔑 Configuration
- **GitHub Token:**
  - Create a Personal Access Token with `repo` scope.
  - `gitdb set token <YOUR_GITHUB_TOKEN>`
- **Repository:**
  - `gitdb set owner <YOUR_USERNAME>`
  - `gitdb set repo <YOUR_REPO_NAME>`

---

## 🚨 Troubleshooting
- **Service Not Starting:** Check service status (see above).
- **Permission Issues:** Use `sudo` (Linux/macOS) or run as Administrator (Windows).
- **Port in Use:** Change port with `gitdb server --port 7897`.
- **GitHub API Limits:** Free accounts: 5,000 requests/hour.

---

## 📚 API Reference

### Shell Commands

| Command                        | Description                        |
|--------------------------------|------------------------------------|
| `set token <token>`            | Set GitHub token                   |
| `set owner <owner>`            | Set repository owner               |
| `set repo <repo>`              | Set repository name                |
| `use <collection>`             | Switch to collection               |
| `create-collection <name>`     | Create new collection              |
| `show collections`             | List all collections               |
| `show docs`                    | Show documents in current collection|
| `insert <JSON>`                | Insert document                    |
| `find <id>`                    | Find document by ID                |
| `findone <query>`              | Find first matching document       |
| `count [query]`                | Count documents                    |
| `update <id> <JSON>`           | Update document                    |
| `updatemany <query> <JSON>`    | Update multiple documents          |
| `delete <id>`                  | Delete document                    |
| `deletemany <query>`           | Delete multiple documents          |
| `distinct <field> [query]`     | Get distinct values                |
| `help`                         | Show help                          |
| `exit`                         | Exit shell                         |

### Server options: `--port`, `--host`, `--config`

---

## 🤝 Contributing
- Fork, branch, PR welcome!

## 📄 License
MIT License

---

## 🎉 What's New
- Global npm package - Install with `npm install -g gitdb-database`
- Node.js 18+ compatibility
- Automatic service setup (Windows, Linux, macOS)
- Cross-platform commands: `gitdb`, `gitdb-shell`, `gitdb-server`
- Zero configuration
- Production ready
- REST API - Full HTTP API support
- Interactive shell
- GitHub integration
- Comprehensive query examples (multi-language)
- Advanced query operations (complex queries, aggregation, pagination)
- Performance optimization tips
- Batch insertion operations

---

**Made with ❤️ by the GitDB Team**