# Test Fixtures

This directory contains test data that will be sent through the API during testing.

## Structure

```
fixtures/
├── worlds/           # Test .mcworld files
│   └── test-world.mcworld
├── addons/           # Test addon files
│   ├── behavior-packs/
│   └── resource-packs/
└── README.md         # This file
```

## Purpose

- **Test .mcworld files**: Sample worlds to test import functionality
- **Test addons**: Sample behavior and resource packs to test addon management
- **API testing**: These files are sent through the API endpoints during tests
- **Clean separation**: Keeps test data separate from the landing pad directory

## Usage

Tests should:
1. Use these fixtures to test API endpoints
2. Send files through the import/export APIs
3. Verify the results in the clean landing pad directory
4. Clean up after tests complete

