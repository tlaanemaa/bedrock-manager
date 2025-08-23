# 🎮 Bedrock Manager

**A modern, containerized management UI for Minecraft Bedrock servers**

Build, deploy, and manage your Minecraft Bedrock servers with a beautiful web interface. Perfect for server administrators who want a professional tool to manage multiple worlds and servers.

## 🚀 **What This Is**

Bedrock Manager is a **web-based dashboard** that lets you:
- 🖥️ **Manage Servers**: Start, stop, and monitor Minecraft Bedrock servers
- 🌍 **Handle Worlds**: Import/export .mcworld files, manage world data
- 📦 **Manage Addons**: Upload .mcaddon files, attach to worlds
- 📊 **Monitor Status**: Real-time server health and performance
- 🎨 **Beautiful UI**: Modern dark theme with Minecraft-inspired design

## 🏗️ **What We're Building**

This is a **full-stack web application** built with:
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Backend**: Node.js API routes with Docker integration
- **Container Management**: dockerode for server lifecycle
- **File Operations**: Native Node.js for world/addon management
- **State Management**: Zustand for reactive UI state

## 🚀 **Quick Start (Recommended)**

### 1. **Start Development Environment**
```bash
# This starts everything: Bedrock Manager + test Minecraft server
npm run dev:start
```

### 2. **Test Everything Works**
```bash
# Run integration tests against running containers
npm run test
```

### 3. **Open the UI**
Open [http://localhost:3000](http://localhost:3000) in your browser

### 4. **Stop When Done**
```bash
npm run dev:stop
```

## 🛠️ **Development Commands**

| Command | What It Does |
|---------|-------------|
| `npm run dev:start` | 🚀 Start dev environment (containers + hot reload) |
| `npm run test` | 🧪 Run integration tests against running containers |
| `npm run dev:logs` | 📋 View container logs |
| `npm run dev:restart` | 🔄 Restart dev environment |
| `npm run dev:stop` | 🛑 Stop and clean up |

## 🧪 **Testing**

**Minimal tests for maximum confidence as you code**

Run container stack. Hit it with requests. Observe results. That's it.

### **Quick Test Workflow**
```bash
# 1. Start containers
npm run dev:start

# 2. Run tests
npm run test

# 3. Stop containers when done
npm run dev:stop
```

### **What Tests Do**
- **Hit the API** - Make requests to your running containers
- **Check responses** - Verify API behavior is correct  
- **Observe side effects** - Look into containers to see what changed
- **Give confidence** - Know your code works as expected

### **Test Files**
- `health.test.mjs` - API health checks
- `servers.test.mjs` - Server management
- `worlds.test.mjs` - World operations
- `addons.test.mjs` - Addon handling

### **Debugging Tests**
```bash
# Check container logs
npm run dev:logs

# Restart containers
npm run dev:restart

# Run specific test
npm run test -- tests/health.test.mjs
```

## 🌟 **Key Features**

### **Server Management**
- ✅ Start/stop Minecraft Bedrock servers
- ✅ Real-time status monitoring
- ✅ Port management and conflict detection
- ✅ Server configuration editing

### **World Management**
- ✅ Import .mcworld files
- ✅ Export worlds as .mcworld files
- ✅ World validation and error handling
- ✅ Automatic file restructuring

### **Addon Support**
- ✅ Upload .mcaddon files
- ✅ Attach addons to worlds
- ✅ Remove addons from worlds
- ✅ Addon validation

### **Modern UI**
- ✅ Dark theme with Minecraft colors
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Intuitive server/world management

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web UI        │    │   API Routes     │    │   Docker        │
│   (Next.js)     │◄──►│   (Node.js)      │◄──►│   Integration   │
│                 │    │                  │    │   (dockerode)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   File System    │
                       │   Operations     │
                       │   (Worlds/Data)  │
                       └──────────────────┘
```

## 📚 **Documentation**

- **[Development Workflow](docs/DEVELOPMENT.md)** - Complete development guide
- **[API Reference](docs/API.md)** - All API endpoints and usage
- **[Architecture](docs/ARCHITECTURE.md)** - System design and components

## 🎯 **Use Cases**

- **Server Administrators**: Manage multiple Minecraft servers
- **World Creators**: Import/export and manage world files
- **Development Teams**: Test and iterate on server configurations
- **Home Users**: Simple server management without command line

## 🚀 **Getting Started for Developers**

```bash
# Clone and setup
git clone <your-repo>
cd bedrock-manager
npm install

# Start development environment
npm run dev:start

# Test everything works
npm run test

# Open in browser
# http://localhost:3000
```

## 🤝 **Contributing**

1. **Start dev environment**: `npm run dev:start`
2. **Make changes**: Edit files, see changes instantly
3. **Test changes**: `npm run test`
4. **Run checks**: `npm run all-checks`
5. **Submit PR**: With clear description of changes

## 📋 **Requirements**

- **Docker Desktop** (for containerized development)
- **Node.js 22+** (for local development)
- **Git** (for version control)

---

**Ready to manage your Minecraft servers like a pro?** 🚀

Start with `npm run dev:start` and open [http://localhost:3000](http://localhost:3000)!


