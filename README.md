# GitDB 🚀

**GitHub-Backed NoSQL Database with CLI, GraphQL, AI, and SuperMode**

[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](https://github.com/karthikeyanV2K/GitDB)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

> **Production-ready NoSQL database that stores data in Git repositories with advanced features like GraphQL, AI-powered queries, version control, and performance optimizations.**

## ✨ Features

### 🗄️ **Core Database**
- **GitHub Integration** - Store data directly in Git repositories
- **NoSQL Document Storage** - Flexible JSON document structure
- **Collections & Documents** - Organize data with collections
- **CRUD Operations** - Full Create, Read, Update, Delete support
- **Query Language** - MongoDB-style query syntax

### 🔧 **CLI Interface**
- **Interactive Shell** - Command-line database operations
- **Server Management** - Start, stop, monitor server
- **Batch Operations** - Bulk data processing
- **Schema Validation** - Data integrity enforcement
- **Session Management** - Persistent configurations

### 🌐 **API & Integration**
- **REST API** - HTTP endpoints for programmatic access
- **GraphQL API** - Dynamic schema with hot reload
- **Real-time Updates** - Live data synchronization
- **WebSocket Support** - Real-time communication

### 🤖 **AI & Advanced Features**
- **AI-Powered Queries** - Natural language database queries
- **SuperMode** - Performance optimizations
- **Auto-completion** - Intelligent command suggestions
- **Query Optimization** - Automatic query improvement
- **Schema Inference** - Automatic field type detection

### 📊 **Version Control & History**
- **Full Git History** - Every change tracked
- **Rollback Capability** - Revert to any previous version
- **Branch Support** - Experimental data branches
- **Merge Resolution** - Conflict handling
- **Audit Trail** - Complete operation history

### ⚡ **Performance & Scalability**
- **Caching Strategies** - Multi-level caching
- **Connection Pooling** - Efficient resource management
- **Batch Processing** - Bulk operation optimization
- **Compression** - Data size reduction
- **Delta Encoding** - Efficient updates

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g gitdb-database

# Or install locally
npm install gitdb
```

### Setup

1. **Create a GitHub repository** for your data
2. **Generate a Personal Access Token** with `repo` permissions
3. **Set environment variables**:

```bash
export GITHUB_TOKEN=your_personal_access_token
export GITHUB_OWNER=your_github_username
export GITHUB_REPO=your_data_repository
```

### Basic Usage

```bash
# Connect to your database
gitdb connect -t your_token -o your_owner -r your_repo

# Create a collection
gitdb create-collection users

# Add a document
gitdb create-doc users '{"name":"John","age":30,"email":"john@example.com"}'

# Query documents
gitdb find users '{"age":{"$gt":25}}'

# Start the server
gitdb server
```

## 📖 Documentation

### CLI Commands

#### Basic Operations
```bash
# Database connection
gitdb connect -t <token> -o <owner> -r <repo>

# Collections
gitdb collections
gitdb create-collection <name>
gitdb delete-collection <name>

# Documents
gitdb documents <collection>
gitdb create-doc <collection> <json-data>
gitdb read-doc <collection> <id>
gitdb update-doc <collection> <id> <json-data>
gitdb delete-doc <collection> <id>

# Queries
gitdb find <collection> <query>
```

#### Server Management
```bash
# Server control
gitdb server                    # Start server (foreground)
gitdb server-start             # Start server (background)
gitdb server-stop              # Stop server
gitdb server-status            # Check server status
gitdb server-restart           # Restart server
gitdb server-log               # View server logs
```

#### Advanced Features
```bash
# Version control
gitdb version history <collection>
gitdb version rollback <collection> --commit <hash>

# SuperMode optimizations
gitdb supermode enable --cache-size 1000
gitdb supermode disable
gitdb supermode stats

# GraphQL management
gitdb graphql schema
gitdb graphql regen-schema

# Reference resolution
gitdb resolve <collection> <id>

# Interactive shell
gitdb shell
```

### API Endpoints

#### REST API (Port 7896)
```bash
# Health check
GET /health

# Collections
GET    /api/v1/collections
POST   /api/v1/collections
DELETE /api/v1/collections/:name

# Documents
GET    /api/v1/collections/:name/documents
POST   /api/v1/collections/:name/documents
GET    /api/v1/collections/:name/documents/:id
PUT    /api/v1/collections/:name/documents/:id
DELETE /api/v1/collections/:name/documents/:id
```

#### GraphQL API
```graphql
# Get collections
query {
  collections
}

# Get documents
query {
  documents(collection: "users") {
    _id
    name
    age
  }
}

# Get specific document
query {
  document(collection: "users", id: "abc123") {
    _id
    name
    age
  }
}
```

### Query Examples

```bash
# Find users older than 25
gitdb find users '{"age":{"$gt":25}}'

# Find active users with specific roles
gitdb find users '{"$and":[{"active":true},{"role":{"$in":["admin","moderator"]}}]}'

# Find documents with non-null email
gitdb find users '{"email":{"$ne":null}}'

# Complex queries
gitdb find products '{"$or":[{"category":"electronics"},{"price":{"$lt":100}}]}'
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CLI Interface │    │   REST API      │    │   GraphQL API   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   GitDB Core    │
                    │   Database      │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   GitHub API    │
                    │   (Git Storage) │
                    └─────────────────┘
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- GitHub account with Personal Access Token

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/karthikeyanV2K/GitDB.git
cd GitDB

# Install dependencies
npm install

# Build project
npm run build

# Run in development
npm run dev

# Run tests
npm test
```

### Project Structure
```
gitdb/
├── src/
│   ├── api/           # REST API endpoints
│   ├── core/          # Core database logic
│   ├── ai/            # AI-powered features
│   ├── cli.ts         # CLI entry point
│   ├── server.ts      # Server entry point
│   ├── shell.ts       # Interactive shell
│   └── graphql.ts     # GraphQL schema and resolvers
├── bin/               # Compiled binaries
├── dist/              # TypeScript output
├── assets/            # Icons and images
└── package.json       # Dependencies and scripts
```

## 🚀 Deployment

### Production Setup

```bash
# Set production environment
export NODE_ENV=production
export PORT=7896
export GITHUB_TOKEN=your_token

# Start server
gitdb server
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 7896
CMD ["node", "dist/server.js"]
```

### Cloud Deployment

- **AWS**: EC2, ECS, or Lambda
- **Google Cloud**: Cloud Run or App Engine
- **Azure**: App Service or Container Instances
- **Heroku**: Direct deployment

## 🔒 Security

### Authentication
- GitHub Personal Access Token required
- Repository-level access control
- Environment variable configuration

### Authorization
- Local-only admin operations
- Repository permission validation
- Input sanitization and validation

### Network Security
- CORS configuration
- Request logging and monitoring
- Rate limiting support
- HTTPS/TLS ready

## 📊 Performance

### Optimizations
- **SuperMode**: Advanced caching and compression
- **Batch Operations**: Bulk data processing
- **Connection Pooling**: Efficient resource management
- **Query Optimization**: Automatic query improvement
- **Delta Encoding**: Efficient update strategies

### Monitoring
- Health check endpoints
- Performance metrics
- Resource usage tracking
- Error monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Maintain backward compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub API** for repository storage
- **Apollo GraphQL** for GraphQL implementation
- **Express.js** for REST API framework
- **TypeScript** for type safety
- **Node.js** for runtime environment

## 📞 Support

- **Documentation**: [Complete Documentation](GITDB-COMPLETE-DOCUMENTATION.txt)
- **Issues**: [GitHub Issues](https://github.com/karthikeyanV2K/GitDB/issues)
- **Discussions**: [GitHub Discussions](https://github.com/karthikeyanV2K/GitDB/discussions)
- **Wiki**: [Project Wiki](https://github.com/karthikeyanV2K/GitDB/wiki)

## 🎯 Roadmap

### Upcoming Features
- [ ] Real-time subscriptions
- [ ] Advanced analytics
- [ ] Machine learning integration
- [ ] Multi-region support
- [ ] Enhanced security features
- [ ] Mobile SDK
- [ ] Desktop application
- [ ] Cloud hosting service

### Version History
- **v2.2.0** - Production ready with GraphQL, SuperMode, and AI
- **v2.1.0** - Major rewrite with TypeScript and advanced features
- **v1.0.0** - Initial release with basic functionality

---

**Made with ❤️ by the AFOT Team**

[![GitHub stars](https://img.shields.io/github/stars/karthikeyanV2K/GitDB?style=social)](https://github.com/karthikeyanV2K/GitDB)
[![GitHub forks](https://img.shields.io/github/forks/karthikeyanV2K/GitDB?style=social)](https://github.com/karthikeyanV2K/GitDB)
[![GitHub issues](https://img.shields.io/github/issues/karthikeyanV2K/GitDB)](https://github.com/karthikeyanV2K/GitDB/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/karthikeyanV2K/GitDB)](https://github.com/karthikeyanV2K/GitDB/pulls)

## 📁 Files Created

1. **`setup-sdk-environment.bat`** - Batch script for Windows
2. **`setup-sdk-environment.ps1`** - PowerShell script (recommended)
3. **`SETUP-README.md`** - Detailed documentation

## 🚀 Key Features

### **Comprehensive Language Support**
- **Node.js 18+** (JavaScript/TypeScript)
- **Python 3.11** (Python SDK)
- **Go 1.19+** (Go SDK)
- **Java 11** (Java SDK with Maven)
- **Rust** (Rust SDK with Cargo)
- **PHP 8.1** (PHP SDK with Composer)
- **Ruby** (Ruby SDK with Bundler)
- **.NET 6 SDK** (C# SDK)

### **Development Tools**
- **Git** for version control
- **Visual Studio Code** for editing
- **Postman** for API testing
- **cURL** for HTTP requests

### **Smart Installation**
- ✅ Checks if tools are already installed
- ✅ Uses Chocolatey package manager
- ✅ Installs all SDK dependencies
- ✅ Configures environment variables
- ✅ Verifies all installations

### **Generated Scripts**
After installation, you'll get:
- **`build-all.ps1`** - Build all SDKs
- **`test-all.ps1`** - Test all SDKs  
- **`start-server.ps1`** - Start GitDB server

## 🎯 Usage

### Quick Start (PowerShell - Recommended)
```powershell
<code_block_to_apply_from>
```

### Alternative (Batch)
```cmd
# Run as Administrator
setup-sdk-environment.bat
```

## 🔧 What Happens

1. **Installs Chocolatey** (if not present)
2. **Installs all languages** and their package managers
3. **Installs development tools** (VS Code, Postman, etc.)
4. **Configures environment variables** (PATH, GOPATH)
5. **Installs SDK dependencies** for each language
6. **Creates development scripts** for easy building/testing
7. **Verifies all installations**

## 🌟 Benefits

- **One-click setup** for all GitDB SDKs
- **Cross-language development** environment
- **Production-ready** toolchain
- **Automated dependency management**
- **Comprehensive verification**
- **Easy maintenance** with generated scripts

The scripts are designed to be safe, informative, and handle errors gracefully. They'll skip already installed tools and provide clear feedback throughout the process.

You can now run either script as Administrator to set up your complete GitDB SDK development environment! 🚀
