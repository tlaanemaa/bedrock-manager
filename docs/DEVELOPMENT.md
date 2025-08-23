# 🚀 Development Workflow

**Complete guide to developing and testing Bedrock Manager**

This document explains how to set up, develop, and test the Bedrock Manager application using our containerized development environment.

## 🎯 **What You'll Learn**

- How to start the development environment
- How to test your changes quickly
- How to debug issues
- How to add new features
- Best practices for development

## 🚀 **Quick Start (5 minutes)**

### **Step 1: Start Everything**
```bash
npm run dev:start
```

**What happens:**
- 🐳 Builds and starts Bedrock Manager container
- 🎮 Starts test Minecraft server
- 🔗 Mounts your source code for hot reload
- 📁 Sets up test data automatically

### **Step 2: Test Everything Works**
```bash
npm run test
```

**Expected output:**
```
🧪 Integration Testing
=====================================

🔍 Checking environment...
✅ Dev containers are running
✅ Test data exists

🚀 Starting tests...

✅ Health API
✅ Server Management
✅ World Management
✅ Addon Management

🎉 All tests completed successfully!
```

### **Step 3: Open the UI**
Open [http://localhost:3000](http://localhost:3000) in your browser

### **Step 4: Stop When Done**
```bash
npm run dev:stop
```

## 🛠️ **Development Commands Reference**

| Command | What It Does | When to Use |
|---------|-------------|-------------|
| `npm run dev:start` | 🚀 Start dev environment | Beginning of development session |
| `npm run test` | 🧪 Run integration tests | After making changes, verify API behavior |
| `npm run dev:logs` | 📋 View real-time logs | Debugging issues, monitoring |
| `npm run dev:restart` | 🔄 Restart containers | After config changes, if things break |
| `npm run dev:stop` | 🛑 Stop everything | End of development session |

## 🔄 **Daily Development Workflow**

### **Morning Setup**
```bash
# Start fresh
npm run dev:start

# Verify everything works
npm run test

# Open browser
# http://localhost:3000
```

### **During Development**
1. **Edit code** → See changes instantly (hot reload)
2. **Test changes** → `npm run test` (verify API behavior)
3. **Debug issues** → `npm run dev:logs` (real-time logs)
4. **Repeat** → Fast iteration cycle

### **Evening Cleanup**
```bash
npm run dev:stop
```

## 📁 **Project Structure**

```
bedrock-manager/
├── app/                    # Next.js application
│   ├── page.tsx           # Main dashboard
│   ├── globals.css        # Global styles
│   └── api/               # API routes
├── lib/                    # Core libraries
│   ├── docker.ts          # Docker operations
│   ├── filesystem.ts      # File operations
│   ├── constants.ts       # Configuration
│   └── stores/            # Zustand state management
├── test/                   # 🆕 All testing
│   ├── test-dev.mjs       # Quick test script
│   └── test-data/         # Test worlds and servers
├── docs/                   # Documentation
├── docker-compose.dev.yml  # Development environment
└── package.json            # Dependencies and scripts
```

## 🧪 **Testing Strategy**

### **Integration Tests (Recommended)**
```bash
npm run test
```
- ✅ **Fast**: Runs in seconds
- ✅ **Comprehensive**: Tests all core endpoints
- ✅ **Real Data**: Tests against actual containers
- ✅ **Frequent**: Run after every change

### **Manual Testing**
- **UI Testing**: Open http://localhost:3000
- **Server Management**: Start/stop test server
- **World Operations**: Import/export test worlds
- **Addon Management**: Upload test addons

### **Code Quality Checks**
```bash
npm run all-checks
```
- **Linting**: ESLint checks
- **Type Checking**: TypeScript validation
- **Build Check**: Next.js build verification

## 🐛 **Debugging Guide**

### **Service Not Responding**
```bash
# Check container status
docker ps

# View logs
npm run dev:logs

# Restart if needed
npm run dev:restart
```

### **Test Failures**
```bash
# Check specific container logs
docker logs bedrock-manager-bedrock-manager-dev-1

# Check test data
docker exec bedrock-manager-bedrock-manager-dev-1 ls -la /app/test/
```

### **Port Conflicts**
```bash
# Check what's using ports
netstat -an | findstr :3000
netstat -an | findstr :19132

# Stop conflicting services
npm run dev:stop
```

### **Permission Issues**
```bash
# Check Docker socket access
docker ps

# Restart Docker Desktop if needed
# Then restart dev environment
npm run dev:restart
```

## 🔧 **Configuration**

### **Environment Variables**
- `NODE_ENV=development` - Enables dev mode
- `TEST_MODE=true` - Uses test data paths

### **Ports**
- **Bedrock Manager**: http://localhost:3000
- **Minecraft Server**: localhost:19132 (UDP)

### **Volumes**
- **Source Code**: Live mounted for hot reload
- **Test Data**: Persistent test worlds and servers
- **Docker Socket**: For container management

## 🚀 **Adding New Features**

### **1. Plan the Feature**
- What does it do?
- Which API endpoints?
- What UI components?
- How to test it?

### **2. Implement**
- Add API routes in `app/api/`
- Add UI components in `app/`
- Add business logic in `lib/`
- Update types and constants

### **3. Test**
```bash
# Run integration tests
npm run test

# Manual testing
# Open http://localhost:3000
```

### **4. Quality Check**
```bash
npm run all-checks
```

## 💡 **Pro Tips**

### **Fast Iteration**
- Keep containers running between changes
- Use `npm run test` frequently
- Hot reload shows changes instantly

### **Efficient Testing**
- Test one feature at a time
- Use the UI for complex workflows
- Check logs for detailed error info

### **Data Management**
- Test data persists between restarts
- Modify test data in `test/test-data/`
- Changes are immediately available

### **Container Management**
- Use `npm run dev:restart` for config changes
- Use `npm run dev:stop` only when done
- Containers auto-recover from most issues

## 🚨 **Common Issues & Solutions**

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Port 3000 in use** | "Address already in use" | Stop other services, restart dev environment |
| **Docker permission** | "Permission denied" | Restart Docker Desktop, check socket access |
| **Test data missing** | "0 worlds found" | Check `test/test-data/` exists, restart containers |
| **Hot reload not working** | Changes don't appear | Check container logs, restart if needed |
| **Minecraft server down** | "Server not responding" | Check container status, restart if needed |

## 🔄 **Troubleshooting Checklist**

When something goes wrong:

1. **Check containers**: `docker ps`
2. **Check logs**: `npm run dev:logs`
3. **Check test data**: `docker exec bedrock-manager-bedrock-manager-dev-1 ls -la /app/test/`
4. **Restart**: `npm run dev:restart`
5. **Full reset**: `npm run dev:stop` then `npm run dev:start`

## 📚 **Next Steps**

- **API Development**: See [API Reference](API.md)
- **Architecture**: See [Architecture Guide](ARCHITECTURE.md)
- **UI Components**: Explore `app/` directory
- **Business Logic**: Explore `lib/` directory

---

**Ready to build amazing Minecraft server management tools?** 🚀

Start with `npm run dev:start` and let's create something awesome!
