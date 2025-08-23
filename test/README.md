# Test Environment Setup

This directory contains the test environment for the Bedrock Manager project.

## Directory Structure

```
test/
├── mount/                 # Docker volume mount landing pad
│   ├── servers/           # Server data directories (populated by API)
│   │   └── testserver/    # Test Minecraft server
│   └── temp/              # Temporary files for testing
├── fixtures/              # Test data to send through API
│   ├── worlds/            # Test .mcworld files
│   └── addons/            # Test addon files
├── tests/                 # Test files
└── README.md             # This file
```

## Getting Started

### 1. Development Environment

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Or use npm scripts
npm run dev:start
```

This will start:
- The Bedrock Manager in development mode
- A test Minecraft server
- Filesystem structure is initialized on container startup

### 2. Production Environment

```bash
# Build and run directly
docker build -t bedrock-manager .
docker run -p 3000:3000 -v /srv/minecraft/bedrock/servers:/srv/minecraft/bedrock/servers bedrock-manager
```

### 3. Adding New Test Servers

To add a new test server, simply create a new directory in `test/mount/servers/`:

```bash
mkdir -p test/mount/servers/newserver/worlds
mkdir -p test/mount/servers/newserver/behavior_packs
mkdir -p test/mount/servers/newserver/resource_packs
```

The manager will automatically discover new servers.

## Git Ignore

The `.gitignore` file in `test/mount/` prevents server-generated files from polluting git.

## File Management

- **Tracked files**: Essential test structure files (`.gitkeep`, sample world files)
- **Ignored files**: Server logs, temporary files, world databases, generated content
- **Server data**: Mounted from local directories for easy testing and observation

## Testing Workflow

### **Running Tests**
```bash
npm run test         # Run Jest tests
```

### **Test Cycle**
1. **Setup**: Start dev environment with `npm run dev:start`
2. **Test**: Run tests with `npm run test`
3. **Verify**: Check results in mount directory
4. **Repeat**: Tests clean up after themselves

## Benefits

1. **Clean landing pad**: Mount directory starts empty and gets populated by API calls
2. **Separate test fixtures**: Test data is kept separate from the mount directory
3. **API-driven testing**: Tests send data through the actual API endpoints
4. **Clean git**: Mount directory is ignored, fixtures are tracked
5. **Reproducible**: Docker ensures consistent setup across environments

