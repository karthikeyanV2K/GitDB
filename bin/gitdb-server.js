#!/usr/bin/env node

/**
 * GitDB Server Global Executable
 * This file is the entry point when users run 'gitdb-server' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the path to the server entry point
const serverPath = path.join(__dirname, '..', 'dist', 'server.js');

// Spawn the server process
const child = spawn('node', [serverPath], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
});

child.on('close', (code) => {
    process.exit(code);
});

child.on('error', (err) => {
    console.error('Error running GitDB Server:', err.message);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  child.kill('SIGTERM');
}); 