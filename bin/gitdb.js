#!/usr/bin/env node

/**
 * GitDB Global CLI Executable
 * This file is the main entry point when users run 'gitdb' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('GitDB v1.0.0');
  console.log('');
  console.log('Usage:');
  console.log('  gitdb server    - Start the GitDB server');
  console.log('  gitdb shell     - Start the GitDB shell');
  console.log('  gitdb help      - Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  gitdb server    - Start server on http://localhost:3000');
  console.log('  gitdb shell     - Start interactive shell');
  console.log('');
  process.exit(0);
}

// Check if we're running in development or production
const isDev = process.env.NODE_ENV !== 'production';

let targetPath;
let targetArgs;

switch (command.toLowerCase()) {
  case 'server':
    targetPath = isDev ? 'src/server.ts' : 'dist/server.js';
    targetArgs = isDev ? ['ts-node', targetPath] : [targetPath];
    break;
  
  case 'shell':
    targetPath = isDev ? 'src/shell.ts' : 'dist/shell.js';
    targetArgs = isDev ? ['ts-node', targetPath] : [targetPath];
    break;
  
  case 'help':
    console.log('GitDB v1.0.0');
    console.log('');
    console.log('Commands:');
    console.log('  server    - Start the GitDB server');
    console.log('  shell     - Start the GitDB shell');
    console.log('  help      - Show this help');
    console.log('');
    console.log('Environment Variables:');
    console.log('  NODE_ENV  - Set to "production" for production mode');
    console.log('  PORT      - Server port (default: 3000)');
    console.log('  HOST      - Server host (default: localhost)');
    console.log('');
    process.exit(0);
  
  default:
    console.error(`Unknown command: ${command}`);
    console.log('Use "gitdb help" for available commands');
    process.exit(1);
}

// Determine the command to run
const execCommand = isDev ? 'npx' : 'node';

console.log(`Starting GitDB ${command}...`);
console.log(`Mode: ${isDev ? 'Development' : 'Production'}`);
console.log(`Command: ${execCommand} ${targetArgs.join(' ')}`);

// Spawn the process
const childProcess = spawn(execCommand, targetArgs, {
  stdio: 'inherit',
  cwd: __dirname + '/..'
});

// Handle process events
childProcess.on('error', (error) => {
  console.error(`Failed to start ${command}:`, error);
  process.exit(1);
});

childProcess.on('exit', (code) => {
  console.log(`${command} process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\nShutting down ${command}...`);
  childProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log(`\nShutting down ${command}...`);
  childProcess.kill('SIGTERM');
}); 