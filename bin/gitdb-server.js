#!/usr/bin/env node

/**
 * GitDB Server Global Executable
 * This file is the entry point when users run 'gitdb-server' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Check if we're running in development or production
const isDev = process.env.NODE_ENV !== 'production';
const serverPath = isDev ? 'src/server.ts' : 'dist/server.js';

// Determine the command to run
const command = isDev ? 'npx' : 'node';
const args = isDev ? ['ts-node', serverPath] : [serverPath];

console.log(`Starting GitDB Server...`);
console.log(`Mode: ${isDev ? 'Development' : 'Production'}`);
console.log(`Command: ${command} ${args.join(' ')}`);

// Spawn the server process
const serverProcess = spawn(command, args, {
  stdio: 'inherit',
  cwd: __dirname + '/..'
});

// Handle process events
serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGTERM');
}); 