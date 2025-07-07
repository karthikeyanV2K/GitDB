# GitDB

📦 **GitDB** - GitHub-backed NoSQL Database available as a global npm package

## 🚀 Quick Start

### Install Globally
```bash
npm install -g gitdb-database
```

### Use Immediately
```bash
# Interactive shell
gitdb shell

# Start server
gitdb server

# Show help
gitdb --help
```

---

## 📋 Features

### ✅ **Automatic Service Setup**
- **Windows**: Creates Windows Service (auto-starts with system)
- **Linux**: Creates systemd service (auto-starts with system)
- **macOS**: Creates launchd service (auto-starts with system)

### ✅ **Cross-Platform Commands**
- `gitdb` - Main CLI with all commands
- `gitdb-shell` - Direct shell access
- `gitdb-server` - Direct server access

### ✅ **Zero Configuration**
- Works out of the box
- Automatic service management
- No manual setup required

---

## 🛠️ Installation

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher

### Global Installation
```bash
# Install globally (recommended)
npm install -g gitdb-database

# The service will be automatically set up
```

### Platform-Specific Installation

#### Windows
```bash
# Run as Administrator if needed
npm install -g gitdb-database
```

#### Linux/macOS
```bash
# Use sudo for global installation
sudo npm install -g gitdb-database
```

### Local Installation
```bash
# Install locally (for development)
npm install gitdb-database

# Run with npx
npx gitdb --help
```

---

## 🎯 Usage

### Interactive Shell
```bash
# Start interactive shell
gitdb shell

# Or use direct command
gitdb-shell
```

### Server Mode
```bash
# Start server
gitdb server

# Or use direct command
gitdb-server

# Server will be available at http://localhost:7896
```

### CLI Commands
```bash
# Show help
gitdb --help

# Set GitHub token
gitdb set token YOUR_GITHUB_TOKEN

# Set repository
gitdb set owner YOUR_USERNAME
gitdb set repo YOUR_REPO_NAME

# Use collection
gitdb use collection_name

# Insert document
gitdb insert '{"name": "test", "value": 123}'

# Find documents
gitdb findone '{"name": "test"}'
gitdb find document_id

# Update document
gitdb update document_id '{"name": "updated"}'

# Delete document
gitdb delete document_id
```

---

## 🔧 Service Management

### Windows
```bash
# Service is automatically installed and started
# Check service status
sc query GitDB

# Stop service
sc stop GitDB

# Start service
sc start GitDB

# Remove service (if needed)
sc delete GitDB
```

### Linux
```bash
# Service is automatically installed and started
# Check service status
sudo systemctl status gitdb

# Stop service
sudo systemctl stop gitdb

# Start service
sudo systemctl start gitdb

# Enable/disable auto-start
sudo systemctl enable gitdb
sudo systemctl disable gitdb
```

### macOS
```bash
# Service is automatically installed and started
# Check service status
launchctl list | grep gitdb

# Stop service
launchctl unload ~/Library/LaunchAgents/com.gitdb.server.plist

# Start service
launchctl load ~/Library/LaunchAgents/com.gitdb.server.plist
```

---

## 🗂️ Collections & Documents

### Create Collection
```bash
gitdb create-collection users
```

### Insert Document
```bash
gitdb insert '{"name": "John Doe", "email": "john@example.com", "age": 30}'
```

### Find Documents
```bash
# Find by ID
gitdb find abc123

# Find by query
gitdb findone '{"name": "John Doe"}'

# Count documents
gitdb count '{"age": {"$gte": 25}}'
```

### Update Documents
```bash
# Update single document
gitdb update abc123 '{"age": 31}'

# Update multiple documents
gitdb updatemany '{"age": {"$lt": 30}}' '{"status": "young"}'
```

### Delete Documents
```bash
# Delete single document
gitdb delete abc123

# Delete multiple documents
gitdb deletemany '{"status": "inactive"}'
```

---

## 🌐 REST API

When the server is running, you can use the REST API:

### Collections
```bash
# List collections
curl http://localhost:7896/api/collections

# Create collection
curl -X POST http://localhost:7896/api/collections \
  -H "Content-Type: application/json" \
  -d '{"name": "users"}'
```

### Documents
```bash
# Insert document
curl -X POST http://localhost:7896/api/documents \
  -H "Content-Type: application/json" \
  -d '{"collection": "users", "document": {"name": "John", "age": 30}}'

# Find documents
curl "http://localhost:7896/api/documents?collection=users&query={\"age\":{\"$gte\":25}}"

# Update document
curl -X PUT http://localhost:7896/api/documents/abc123 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "age": 31}'

# Delete document
curl -X DELETE http://localhost:7896/api/documents/abc123
```

---

## 🔌 Database Connection Examples

### Node.js (JavaScript/TypeScript)

#### Using Axios
```javascript
const axios = require('axios');

class GitDBClient {
  constructor(baseURL = 'http://localhost:7896/api') {
    this.baseURL = baseURL;
  }

  async connect(token, owner, repo) {
    const response = await axios.post(`${this.baseURL}/collections/connect`, {
      token, owner, repo
    });
    return response.data;
  }

  async createCollection(name) {
    const response = await axios.post(`${this.baseURL}/collections`, { name });
    return response.data;
  }

  async insertDocument(collection, data) {
    const response = await axios.post(`${this.baseURL}/documents`, {
      collection, document: data
    });
    return response.data;
  }

  async getDocument(collection, id) {
    const response = await axios.get(`${this.baseURL}/documents/${id}?collection=${collection}`);
    return response.data;
  }

  async updateDocument(collection, id, data) {
    const response = await axios.put(`${this.baseURL}/documents/${id}`, data);
    return response.data;
  }

  async deleteDocument(collection, id) {
    const response = await axios.delete(`${this.baseURL}/documents/${id}?collection=${collection}`);
    return response.data;
  }

  async findDocuments(collection, query = {}) {
    const response = await axios.get(`${this.baseURL}/documents`, {
      params: { collection, query: JSON.stringify(query) }
    });
    return response.data;
  }
}

// Usage
const gitdb = new GitDBClient();
await gitdb.connect('your_token', 'your_username', 'your_repo');
await gitdb.createCollection('users');
await gitdb.insertDocument('users', { name: 'Alice', email: 'alice@example.com' });
```

#### Using Fetch (ES6+)
```javascript
class GitDBClient {
  constructor(baseURL = 'http://localhost:7896/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    return response.json();
  }

  async connect(token, owner, repo) {
    return this.request('/collections/connect', {
      method: 'POST',
      body: JSON.stringify({ token, owner, repo })
    });
  }

  async insertDocument(collection, data) {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify({ collection, document: data })
    });
  }

  async getDocument(collection, id) {
    return this.request(`/documents/${id}?collection=${collection}`);
  }

  async updateDocument(collection, id, data) {
    return this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteDocument(collection, id) {
    return this.request(`/documents/${id}?collection=${collection}`, {
      method: 'DELETE'
    });
  }
}
```

### Python

#### Using Requests
```python
import requests
import json

class GitDBClient:
    def __init__(self, base_url="http://localhost:7896/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def connect(self, token, owner, repo):
        response = self.session.post(f"{self.base_url}/collections/connect", 
                                   json={'token': token, 'owner': owner, 'repo': repo})
        return response.json()

    def create_collection(self, name):
        response = self.session.post(f"{self.base_url}/collections", json={'name': name})
        return response.json()

    def insert_document(self, collection, data):
        response = self.session.post(f"{self.base_url}/documents", 
                                   json={'collection': collection, 'document': data})
        return response.json()

    def get_document(self, collection, doc_id):
        response = self.session.get(f"{self.base_url}/documents/{doc_id}?collection={collection}")
        return response.json()

    def update_document(self, collection, doc_id, data):
        response = self.session.put(f"{self.base_url}/documents/{doc_id}", json=data)
        return response.json()

    def delete_document(self, collection, doc_id):
        response = self.session.delete(f"{self.base_url}/documents/{doc_id}?collection={collection}")
        return response.json()

    def find_documents(self, collection, query=None):
        params = {'collection': collection}
        if query:
            params['query'] = json.dumps(query)
        response = self.session.get(f"{self.base_url}/documents", params=params)
        return response.json()

# Usage
gitdb = GitDBClient()
gitdb.connect('your_token', 'your_username', 'your_repo')
gitdb.create_collection('users')
gitdb.insert_document('users', {'name': 'Alice', 'email': 'alice@example.com'})
```

#### Using aiohttp (Async)
```python
import aiohttp
import json
import asyncio

class AsyncGitDBClient:
    def __init__(self, base_url="http://localhost:7896/api"):
        self.base_url = base_url

    async def request(self, method, endpoint, data=None, params=None):
        async with aiohttp.ClientSession() as session:
            async with session.request(
                method, 
                f"{self.base_url}{endpoint}",
                json=data,
                params=params,
                headers={'Content-Type': 'application/json'}
            ) as response:
                return await response.json()

    async def connect(self, token, owner, repo):
        return await self.request('POST', '/collections/connect', 
                                {'token': token, 'owner': owner, 'repo': repo})

    async def insert_document(self, collection, data):
        return await self.request('POST', '/documents', 
                                {'collection': collection, 'document': data})

    async def get_document(self, collection, doc_id):
        return await self.request('GET', f'/documents/{doc_id}', 
                                params={'collection': collection})

# Usage
async def main():
    gitdb = AsyncGitDBClient()
    await gitdb.connect('your_token', 'your_username', 'your_repo')
    await gitdb.insert_document('users', {'name': 'Alice', 'email': 'alice@example.com'})

asyncio.run(main())
```

### Java

#### Using OkHttp
```java
import okhttp3.*;
import com.google.gson.Gson;
import java.io.IOException;

public class GitDBClient {
    private final String baseUrl;
    private final OkHttpClient client;
    private final Gson gson;

    public GitDBClient(String baseUrl) {
        this.baseUrl = baseUrl;
        this.client = new OkHttpClient();
        this.gson = new Gson();
    }

    public GitDBClient() {
        this("http://localhost:7896/api");
    }

    public String connect(String token, String owner, String repo) throws IOException {
        String json = gson.toJson(new ConnectionRequest(token, owner, repo));
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
        
        Request request = new Request.Builder()
            .url(baseUrl + "/collections/connect")
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    public String insertDocument(String collection, Object data) throws IOException {
        DocumentRequest docRequest = new DocumentRequest(collection, data);
        String json = gson.toJson(docRequest);
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
        
        Request request = new Request.Builder()
            .url(baseUrl + "/documents")
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    public String getDocument(String collection, String id) throws IOException {
        Request request = new Request.Builder()
            .url(baseUrl + "/documents/" + id + "?collection=" + collection)
            .get()
            .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    public String updateDocument(String collection, String id, Object data) throws IOException {
        String json = gson.toJson(data);
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
        
        Request request = new Request.Builder()
            .url(baseUrl + "/documents/" + id)
            .put(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    public String deleteDocument(String collection, String id) throws IOException {
        Request request = new Request.Builder()
            .url(baseUrl + "/documents/" + id + "?collection=" + collection)
            .delete()
            .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    // Helper classes
    private static class ConnectionRequest {
        String token, owner, repo;
        ConnectionRequest(String token, String owner, String repo) {
            this.token = token; this.owner = owner; this.repo = repo;
        }
    }

    private static class DocumentRequest {
        String collection;
        Object document;
        DocumentRequest(String collection, Object document) {
            this.collection = collection; this.document = document;
        }
    }
}

// Usage
GitDBClient gitdb = new GitDBClient();
gitdb.connect("your_token", "your_username", "your_repo");
gitdb.insertDocument("users", Map.of("name", "Alice", "email", "alice@example.com"));
```

### C#

#### Using HttpClient
```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class GitDBClient
{
    private readonly HttpClient _client;
    private readonly string _baseUrl;

    public GitDBClient(string baseUrl = "http://localhost:7896/api")
    {
        _baseUrl = baseUrl;
        _client = new HttpClient();
        _client.DefaultRequestHeaders.Add("Content-Type", "application/json");
    }

    public async Task<string> ConnectAsync(string token, string owner, string repo)
    {
        var data = new { token, owner, repo };
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync($"{_baseUrl}/collections/connect", content);
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> InsertDocumentAsync(string collection, object data)
    {
        var request = new { collection, document = data };
        var json = JsonConvert.SerializeObject(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync($"{_baseUrl}/documents", content);
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetDocumentAsync(string collection, string id)
    {
        var response = await _client.GetAsync($"{_baseUrl}/documents/{id}?collection={collection}");
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> UpdateDocumentAsync(string collection, string id, object data)
    {
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.PutAsync($"{_baseUrl}/documents/{id}", content);
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> DeleteDocumentAsync(string collection, string id)
    {
        var response = await _client.DeleteAsync($"{_baseUrl}/documents/{id}?collection={collection}");
        return await response.Content.ReadAsStringAsync();
    }
}

// Usage
var gitdb = new GitDBClient();
await gitdb.ConnectAsync("your_token", "your_username", "your_repo");
await gitdb.InsertDocumentAsync("users", new { name = "Alice", email = "alice@example.com" });
```

### PHP

#### Using cURL
```php
<?php

class GitDBClient {
    private $baseUrl;
    
    public function __construct($baseUrl = 'http://localhost:7896/api') {
        $this->baseUrl = $baseUrl;
    }
    
    public function connect($token, $owner, $repo) {
        $data = json_encode(['token' => $token, 'owner' => $owner, 'repo' => $repo]);
        return $this->makeRequest('/collections/connect', 'POST', $data);
    }
    
    public function insertDocument($collection, $data) {
        $requestData = json_encode(['collection' => $collection, 'document' => $data]);
        return $this->makeRequest('/documents', 'POST', $requestData);
    }
    
    public function getDocument($collection, $id) {
        return $this->makeRequest("/documents/{$id}?collection={$collection}", 'GET');
    }
    
    public function updateDocument($collection, $id, $data) {
        $jsonData = json_encode($data);
        return $this->makeRequest("/documents/{$id}", 'PUT', $jsonData);
    }
    
    public function deleteDocument($collection, $id) {
        return $this->makeRequest("/documents/{$id}?collection={$collection}", 'DELETE');
    }
    
    private function makeRequest($endpoint, $method, $data = null) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            ]);
        }
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

// Usage
$gitdb = new GitDBClient();
$gitdb->connect('your_token', 'your_username', 'your_repo');
$gitdb->insertDocument('users', ['name' => 'Alice', 'email' => 'alice@example.com']);
?>
```

### Go

#### Using net/http
```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
)

type GitDBClient struct {
    baseURL string
    client  *http.Client
}

func NewGitDBClient(baseURL string) *GitDBClient {
    if baseURL == "" {
        baseURL = "http://localhost:7896/api"
    }
    return &GitDBClient{
        baseURL: baseURL,
        client:  &http.Client{},
    }
}

func (c *GitDBClient) Connect(token, owner, repo string) (map[string]interface{}, error) {
    data := map[string]string{
        "token": token,
        "owner": owner,
        "repo":  repo,
    }
    return c.makeRequest("POST", "/collections/connect", data, nil)
}

func (c *GitDBClient) InsertDocument(collection string, document interface{}) (map[string]interface{}, error) {
    data := map[string]interface{}{
        "collection": collection,
        "document":   document,
    }
    return c.makeRequest("POST", "/documents", data, nil)
}

func (c *GitDBClient) GetDocument(collection, id string) (map[string]interface{}, error) {
    params := url.Values{}
    params.Add("collection", collection)
    return c.makeRequest("GET", "/documents/"+id+"?"+params.Encode(), nil, nil)
}

func (c *GitDBClient) UpdateDocument(collection, id string, document interface{}) (map[string]interface{}, error) {
    return c.makeRequest("PUT", "/documents/"+id, document, nil)
}

func (c *GitDBClient) DeleteDocument(collection, id string) (map[string]interface{}, error) {
    params := url.Values{}
    params.Add("collection", collection)
    return c.makeRequest("DELETE", "/documents/"+id+"?"+params.Encode(), nil, nil)
}

func (c *GitDBClient) makeRequest(method, endpoint string, data interface{}, params url.Values) (map[string]interface{}, error) {
    var body io.Reader
    if data != nil {
        jsonData, err := json.Marshal(data)
        if err != nil {
            return nil, err
        }
        body = bytes.NewBuffer(jsonData)
    }

    req, err := http.NewRequest(method, c.baseURL+endpoint, body)
    if err != nil {
        return nil, err
    }

    req.Header.Set("Content-Type", "application/json")

    resp, err := c.client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    err = json.NewDecoder(resp.Body).Decode(&result)
    return result, err
}

// Usage
func main() {
    gitdb := NewGitDBClient("")
    gitdb.Connect("your_token", "your_username", "your_repo")
    gitdb.InsertDocument("users", map[string]interface{}{
        "name":  "Alice",
        "email": "alice@example.com",
    })
}
```

### Ruby

#### Using Net::HTTP
```ruby
require 'net/http'
require 'json'
require 'uri'

class GitDBClient
  def initialize(base_url = 'http://localhost:7896/api')
    @base_url = base_url
  end

  def connect(token, owner, repo)
    data = { token: token, owner: owner, repo: repo }
    make_request('/collections/connect', 'POST', data)
  end

  def insert_document(collection, data)
    request_data = { collection: collection, document: data }
    make_request('/documents', 'POST', request_data)
  end

  def get_document(collection, id)
    make_request("/documents/#{id}?collection=#{collection}", 'GET')
  end

  def update_document(collection, id, data)
    make_request("/documents/#{id}", 'PUT', data)
  end

  def delete_document(collection, id)
    make_request("/documents/#{id}?collection=#{collection}", 'DELETE')
  end

  private

  def make_request(endpoint, method, data = nil)
    uri = URI("#{@base_url}#{endpoint}")
    
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')
    
    request = case method
              when 'GET'
                Net::HTTP::Get.new(uri)
              when 'POST'
                Net::HTTP::Post.new(uri)
              when 'PUT'
                Net::HTTP::Put.new(uri)
              when 'DELETE'
                Net::HTTP::Delete.new(uri)
              end

    request['Content-Type'] = 'application/json'
    request.body = data.to_json if data

    response = http.request(request)
    JSON.parse(response.body)
  end
end

# Usage
gitdb = GitDBClient.new
gitdb.connect('your_token', 'your_username', 'your_repo')
gitdb.insert_document('users', { name: 'Alice', email: 'alice@example.com' })
```

---

## 🔑 Configuration

### GitHub Token
You need a GitHub Personal Access Token with repo permissions:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Set the token:
```bash
gitdb set token YOUR_GITHUB_TOKEN
```

### Repository Setup
```bash
# Set owner and repository
gitdb set owner YOUR_USERNAME
gitdb set repo YOUR_REPO_NAME

# The repository will be created automatically if it doesn't exist
```

---

## 🚨 Troubleshooting

### Service Not Starting
```bash
# Check if service is installed
# Windows
sc query GitDB

# Linux
sudo systemctl status gitdb

# macOS
launchctl list | grep gitdb
```

### Permission Issues
```bash
# Linux/macOS: Run with sudo for service installation
sudo npm install -g gitdb-database

# Windows: Run as Administrator
```

### Port Already in Use
```bash
# Change port
gitdb server --port 7897

# Or kill existing process
# Windows
netstat -ano | findstr :7896
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:7896 | xargs kill -9
```

### GitHub API Limits
- Free accounts: 5,000 requests/hour
- Check limits: `gitdb count` (uses 1 request)
- Consider using GitHub Enterprise for higher limits

---

## 📚 API Reference

### Shell Commands
| Command | Description |
|---------|-------------|
| `set token <token>` | Set GitHub token |
| `set owner <owner>` | Set repository owner |
| `set repo <repo>` | Set repository name |
| `use <collection>` | Switch to collection |
| `create-collection <name>` | Create new collection |
| `show collections` | List all collections |
| `show docs` | Show documents in current collection |
| `insert <JSON>` | Insert document |
| `find <id>` | Find document by ID |
| `findone <query>` | Find first matching document |
| `count [query]` | Count documents |
| `update <id> <JSON>` | Update document |
| `updatemany <query> <JSON>` | Update multiple documents |
| `delete <id>` | Delete document |
| `deletemany <query>` | Delete multiple documents |
| `distinct <field> [query]` | Get distinct values |
| `help` | Show help |
| `exit` | Exit shell |

### Server Options
| Option | Description | Default |
|--------|-------------|---------|
| `--port` | Server port | 7896 |
| `--host` | Server host | 0.0.0.0 |
| `--config` | Config file path | config.json |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- 📖 **Documentation**: [GitHub Wiki](https://github.com/karthikeyanV2K/gitdb/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/karthikeyanV2K/gitdb/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/karthikeyanV2K/gitdb/discussions)

---

## 🎉 What's New in v2.0.3

- ✅ **Global npm package** - Install with `npm install -g gitdb-database`
- ✅ **Node.js 18+ compatibility** - Works with Node.js 18.0.0 and higher
- ✅ **Automatic service setup** - Works on Windows, Linux, macOS
- ✅ **Cross-platform commands** - `gitdb`, `gitdb-shell`, `gitdb-server`
- ✅ **Zero configuration** - Works out of the box
- ✅ **Production ready** - Stable and reliable
- ✅ **REST API** - Full HTTP API support
- ✅ **Interactive shell** - Easy database management
- ✅ **GitHub integration** - Store data in GitHub repositories

---

## 📦 Package Information

- **NPM Package**: [gitdb-database](https://www.npmjs.com/package/gitdb-database)
- **Version**: 2.0.3
- **Install**: `npm install -g gitdb-database`
- **Repository**: [karthikeyanV2K/gitdb](https://github.com/karthikeyanV2K/gitdb)
- **License**: MIT

---

**Made with ❤️ by the GitDB Team**
