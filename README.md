# GitDB - GitHub-Backed NoSQL Database

A production-ready CLI tool and API server for managing a NoSQL database using GitHub repositories as storage. Features both command-line interface and REST API with interactive shell.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Set Up Your GitHub Credentials
You need a GitHub personal access token with repo permissions. You can set credentials via:
- Environment variables: `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`
- API calls to connect endpoint
- CLI commands

### 4. Start the API Server
```bash
npm start
# or for development
npm run dev
```

The server will start on port 7896 by default.

---

## 🐚 Interactive Shell

Start the interactive shell for database operations:

```bash
npm run shell
# or directly
node dist/shell.js
```

### Shell Commands
```
🔗 Connection:
  connect <token> <owner> <repo>  Connect to database
  disconnect                     Disconnect from database
  status                         Show connection status

📁 Collections:
  collections                    List all collections
  create-collection <name>       Create a new collection
  delete-collection <name>       Delete a collection
  use <collection>               Set current collection

📄 Documents:
  docs                           List documents in current collection
  insert <json>                  Insert a new document
  find <id>                      Find document by ID
  update <id> <json>             Update document by ID
  delete <id>                    Delete document by ID

🛠️  Utility:
  clear                          Clear screen
  help                           Show this help
  exit, quit                     Exit shell
```

### Example Shell Session
```
🚀 GitDB Shell - GitHub-backed NoSQL Database
gitdb> connect your_token your_username your_repo
✅ Connected to database: your_username/your_repo
gitdb> create-collection users
✅ Collection 'users' created successfully
gitdb> use users
📁 Using collection: users
gitdb> insert {"name":"Alice","email":"alice@example.com"}
✅ Document created with ID: abc123def456
gitdb> find abc123def456
{
  "_id": "abc123def456",
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
gitdb> update abc123def456 {"email":"alice@new.com"}
✅ Document updated successfully
gitdb> docs
📄 Documents in 'users':
  - abc123def456
gitdb> exit
👋 Goodbye!
```

---

## 🖥️ Command Line Interface

Use the CLI for scripting and automation:

```bash
npm run cli
# or directly
node dist/cli.js
```

### CLI Commands
```bash
# Connect to database
gitdb connect -t <token> -o <owner> -r <repo>

# List collections
gitdb collections

# Create collection
gitdb create-collection <name>

# Delete collection
gitdb delete-collection <name>

# List documents in collection
gitdb documents <collection>

# Create document
gitdb create-doc <collection> '{"name":"John","email":"john@example.com"}'

# Read document
gitdb read-doc <collection> <id>

# Update document
gitdb update-doc <collection> <id> '{"email":"john@new.com"}'

# Delete document
gitdb delete-doc <collection> <id>

# Find documents by query
gitdb find <collection> '{"name":"John"}'

# Show status
gitdb status
```

---

## 🌐 REST API

The API server provides RESTful endpoints for database operations.

### Base URL
```
http://localhost:7896/api/v1
```

### Authentication
First, connect to a database:
```bash
POST /api/v1/collections/connect
Content-Type: application/json

{
  "token": "your_github_token",
  "owner": "your_username",
  "repo": "your_repo"
}
```

---

## 🔌 Backend Integration Examples

### Node.js (JavaScript/TypeScript)

#### Using Axios
```javascript
const axios = require('axios');

class GitDBClient {
  constructor(baseURL = 'http://localhost:7896/api/v1') {
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
    const response = await axios.post(`${this.baseURL}/collections/${collection}/documents`, data);
    return response.data;
  }

  async getDocument(collection, id) {
    const response = await axios.get(`${this.baseURL}/collections/${collection}/documents/${id}`);
    return response.data;
  }

  async updateDocument(collection, id, data) {
    const response = await axios.put(`${this.baseURL}/collections/${collection}/documents/${id}`, data);
    return response.data;
  }

  async deleteDocument(collection, id) {
    const response = await axios.delete(`${this.baseURL}/collections/${collection}/documents/${id}`);
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
  constructor(baseURL = 'http://localhost:7896/api/v1') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
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
    return this.request(`/collections/${collection}/documents`, {
      method: 'POST',
      body: JSON.stringify(data)
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
    def __init__(self, base_url="http://localhost:7896/api/v1"):
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
        response = self.session.post(f"{self.base_url}/collections/{collection}/documents", 
                                   json=data)
        return response.json()

    def get_document(self, collection, doc_id):
        response = self.session.get(f"{self.base_url}/collections/{collection}/documents/{doc_id}")
        return response.json()

    def update_document(self, collection, doc_id, data):
        response = self.session.put(f"{self.base_url}/collections/{collection}/documents/{doc_id}", 
                                  json=data)
        return response.json()

    def delete_document(self, collection, doc_id):
        response = self.session.delete(f"{self.base_url}/collections/{collection}/documents/{doc_id}")
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
import asyncio

class AsyncGitDBClient:
    def __init__(self, base_url="http://localhost:7896/api/v1"):
        self.base_url = base_url

    async def connect(self, token, owner, repo):
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/collections/connect", 
                                  json={'token': token, 'owner': owner, 'repo': repo}) as response:
                return await response.json()

    async def insert_document(self, collection, data):
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/collections/{collection}/documents", 
                                  json=data) as response:
                return await response.json()

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
    private final String baseURL;
    private final OkHttpClient client;
    private final Gson gson;

    public GitDBClient(String baseURL) {
        this.baseURL = baseURL;
        this.client = new OkHttpClient();
        this.gson = new Gson();
    }

    public GitDBClient() {
        this("http://localhost:7896/api/v1");
    }

    public void connect(String token, String owner, String repo) throws IOException {
        String json = gson.toJson(new ConnectRequest(token, owner, repo));
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
        Request request = new Request.Builder()
                .url(baseURL + "/collections/connect")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected response " + response);
        }
    }

    public void createCollection(String name) throws IOException {
        String json = gson.toJson(new CollectionRequest(name));
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
        Request request = new Request.Builder()
                .url(baseURL + "/collections")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected response " + response);
        }
    }

    public void insertDocument(String collection, Object data) throws IOException {
        String json = gson.toJson(data);
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
        Request request = new Request.Builder()
                .url(baseURL + "/collections/" + collection + "/documents")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected response " + response);
        }
    }

    private static class ConnectRequest {
        String token, owner, repo;
        ConnectRequest(String token, String owner, String repo) {
            this.token = token; this.owner = owner; this.repo = repo;
        }
    }

    private static class CollectionRequest {
        String name;
        CollectionRequest(String name) { this.name = name; }
    }
}

// Usage
GitDBClient gitdb = new GitDBClient();
gitdb.connect("your_token", "your_username", "your_repo");
gitdb.createCollection("users");
gitdb.insertDocument("users", Map.of("name", "Alice", "email", "alice@example.com"));
```

#### Using Spring RestTemplate
```java
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.Map;

@Service
public class GitDBService {
    private final RestTemplate restTemplate;
    private final String baseURL;

    public GitDBService() {
        this.restTemplate = new RestTemplate();
        this.baseURL = "http://localhost:7896/api/v1";
    }

    public void connect(String token, String owner, String repo) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, String> request = Map.of(
            "token", token,
            "owner", owner,
            "repo", repo
        );
        
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
        restTemplate.postForObject(baseURL + "/collections/connect", entity, Object.class);
    }

    public void insertDocument(String collection, Object data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Object> entity = new HttpEntity<>(data, headers);
        restTemplate.postForObject(baseURL + "/collections/" + collection + "/documents", 
                                 entity, Object.class);
    }
}
```

### C#

#### Using HttpClient
```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class GitDBClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseURL;

    public GitDBClient(string baseURL = "http://localhost:7896/api/v1")
    {
        _baseURL = baseURL;
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");
    }

    public async Task ConnectAsync(string token, string owner, string repo)
    {
        var request = new
        {
            token = token,
            owner = owner,
            repo = repo
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync($"{_baseURL}/collections/connect", content);
        response.EnsureSuccessStatusCode();
    }

    public async Task CreateCollectionAsync(string name)
    {
        var request = new { name = name };
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync($"{_baseURL}/collections", content);
        response.EnsureSuccessStatusCode();
    }

    public async Task InsertDocumentAsync(string collection, object data)
    {
        var json = JsonSerializer.Serialize(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync($"{_baseURL}/collections/{collection}/documents", content);
        response.EnsureSuccessStatusCode();
    }

    public async Task<T> GetDocumentAsync<T>(string collection, string id)
    {
        var response = await _httpClient.GetAsync($"{_baseURL}/collections/{collection}/documents/{id}");
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(json);
    }
}

// Usage
var gitdb = new GitDBClient();
await gitdb.ConnectAsync("your_token", "your_username", "your_repo");
await gitdb.CreateCollectionAsync("users");
await gitdb.InsertDocumentAsync("users", new { name = "Alice", email = "alice@example.com" });
```

### PHP

#### Using cURL
```php
<?php

class GitDBClient {
    private $baseURL;
    
    public function __construct($baseURL = 'http://localhost:7896/api/v1') {
        $this->baseURL = $baseURL;
    }
    
    public function connect($token, $owner, $repo) {
        $data = [
            'token' => $token,
            'owner' => $owner,
            'repo' => $repo
        ];
        
        return $this->makeRequest('/collections/connect', 'POST', $data);
    }
    
    public function createCollection($name) {
        return $this->makeRequest('/collections', 'POST', ['name' => $name]);
    }
    
    public function insertDocument($collection, $data) {
        return $this->makeRequest("/collections/{$collection}/documents", 'POST', $data);
    }
    
    public function getDocument($collection, $id) {
        return $this->makeRequest("/collections/{$collection}/documents/{$id}", 'GET');
    }
    
    private function makeRequest($endpoint, $method, $data = null) {
        $url = $this->baseURL . $endpoint;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json'
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
$gitdb->createCollection('users');
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
    "net/http"
)

type GitDBClient struct {
    baseURL string
    client  *http.Client
}

func NewGitDBClient(baseURL string) *GitDBClient {
    if baseURL == "" {
        baseURL = "http://localhost:7896/api/v1"
    }
    return &GitDBClient{
        baseURL: baseURL,
        client:  &http.Client{},
    }
}

func (g *GitDBClient) Connect(token, owner, repo string) error {
    data := map[string]string{
        "token": token,
        "owner": owner,
        "repo":  repo,
    }
    
    jsonData, _ := json.Marshal(data)
    resp, err := g.client.Post(g.baseURL+"/collections/connect", "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    return nil
}

func (g *GitDBClient) CreateCollection(name string) error {
    data := map[string]string{"name": name}
    jsonData, _ := json.Marshal(data)
    
    resp, err := g.client.Post(g.baseURL+"/collections", "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    return nil
}

func (g *GitDBClient) InsertDocument(collection string, data interface{}) error {
    jsonData, _ := json.Marshal(data)
    
    resp, err := g.client.Post(g.baseURL+"/collections/"+collection+"/documents", "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    return nil
}

// Usage
func main() {
    gitdb := NewGitDBClient("")
    gitdb.Connect("your_token", "your_username", "your_repo")
    gitdb.CreateCollection("users")
    gitdb.InsertDocument("users", map[string]string{
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

class GitDBClient
  def initialize(base_url = 'http://localhost:7896/api/v1')
    @base_url = base_url
  end

  def connect(token, owner, repo)
    data = { token: token, owner: owner, repo: repo }
    make_request('/collections/connect', 'POST', data)
  end

  def create_collection(name)
    make_request('/collections', 'POST', { name: name })
  end

  def insert_document(collection, data)
    make_request("/collections/#{collection}/documents", 'POST', data)
  end

  def get_document(collection, id)
    make_request("/collections/#{collection}/documents/#{id}", 'GET')
  end

  private

  def make_request(endpoint, method, data = nil)
    uri = URI(@base_url + endpoint)
    
    http = Net::HTTP.new(uri.host, uri.port)
    request = case method
              when 'POST'
                Net::HTTP::Post.new(uri)
              when 'GET'
                Net::HTTP::Get.new(uri)
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
gitdb.create_collection('users')
gitdb.insert_document('users', { name: 'Alice', email: 'alice@example.com' })
```

### Rust

#### Using reqwest
```rust
use serde_json::{json, Value};
use reqwest::Client;

struct GitDBClient {
    base_url: String,
    client: Client,
}

impl GitDBClient {
    fn new(base_url: Option<String>) -> Self {
        GitDBClient {
            base_url: base_url.unwrap_or_else(|| "http://localhost:7896/api/v1".to_string()),
            client: Client::new(),
        }
    }

    async fn connect(&self, token: &str, owner: &str, repo: &str) -> Result<Value, Box<dyn std::error::Error>> {
        let data = json!({
            "token": token,
            "owner": owner,
            "repo": repo
        });

        let response = self.client
            .post(&format!("{}/collections/connect", self.base_url))
            .json(&data)
            .send()
            .await?;

        Ok(response.json().await?)
    }

    async fn create_collection(&self, name: &str) -> Result<Value, Box<dyn std::error::Error>> {
        let data = json!({ "name": name });

        let response = self.client
            .post(&format!("{}/collections", self.base_url))
            .json(&data)
            .send()
            .await?;

        Ok(response.json().await?)
    }

    async fn insert_document(&self, collection: &str, data: Value) -> Result<Value, Box<dyn std::error::Error>> {
        let response = self.client
            .post(&format!("{}/collections/{}/documents", self.base_url, collection))
            .json(&data)
            .send()
            .await?;

        Ok(response.json().await?)
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let gitdb = GitDBClient::new(None);
    
    gitdb.connect("your_token", "your_username", "your_repo").await?;
    gitdb.create_collection("users").await?;
    
    let user_data = json!({
        "name": "Alice",
        "email": "alice@example.com"
    });
    gitdb.insert_document("users", user_data).await?;
    
    Ok(())
}
```

### Collection Endpoints

#### List Collections
```bash
GET /api/v1/collections
```

#### Create Collection
```bash
POST /api/v1/collections
Content-Type: application/json

{
  "name": "users"
}
```

#### Delete Collection
```bash
DELETE /api/v1/collections/users
```

#### Get Collection Info
```bash
GET /api/v1/collections/users
```

### Document Endpoints

#### List Documents
```bash
GET /api/v1/collections/users/documents
```

#### Create Document
```bash
POST /api/v1/collections/users/documents
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

#### Get Document
```bash
GET /api/v1/collections/users/documents/abc123def456
```

#### Update Document
```bash
PUT /api/v1/collections/users/documents/abc123def456
Content-Type: application/json

{
  "email": "alice@new.com"
}
```

#### Delete Document
```bash
DELETE /api/v1/collections/users/documents/abc123def456
```

#### Find Documents
```bash
POST /api/v1/collections/users/documents/find
Content-Type: application/json

{
  "name": "Alice"
}
  ```

---

## 🏗️ Building Executables

Build standalone executables for distribution:

```bash
# Build CLI executable
npm run build:cli

# Build shell executable
npm run build:shell

# Build server executable
npm run build:server

# Build for all platforms
npm run build:all
```

---

## 🔧 Development

### Project Structure
```
src/
├── api/           # REST API routes
├── core/          # Database manager and CRUD operations
├── github/        # GitHub API integration
├── models/        # Data models
├── utils/         # Utility functions
├── cli.ts         # Command-line interface
├── shell.ts       # Interactive shell
└── server.ts      # API server
```

### Available Scripts
- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run shell` - Start interactive shell
- `npm run cli` - Run CLI commands
- `npm test` - Run tests
- `npm run clean` - Clean build directory

---

## 🔒 Security

- GitHub tokens are only used for API calls and never stored permanently
- All operations are logged for audit purposes
- Connection state is maintained in memory only

---

## 📝 License

MIT
