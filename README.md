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
