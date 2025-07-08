#!/usr/bin/env node

/**
 * GitDB Shell Global Executable
 * This file is the entry point when users run 'gitdb-shell' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Check if we're running in development or production
const isDev = process.env.NODE_ENV !== 'production';
const shellPath = isDev ? 'src/shell.ts' : 'dist/shell.js';

// Determine the command to run
const command = isDev ? 'npx' : 'node';
const args = isDev ? ['ts-node', shellPath] : [shellPath];

console.log(`Starting GitDB Shell...`);
console.log(`Mode: ${isDev ? 'Development' : 'Production'}`);
console.log(`Command: ${command} ${args.join(' ')}`);

// Spawn the shell process
const shellProcess = spawn(command, args, {
  stdio: 'inherit',
  cwd: __dirname + '/..'
});

// Handle process events
shellProcess.on('error', (error) => {
  console.error('Failed to start shell:', error);
  process.exit(1);
});

shellProcess.on('exit', (code) => {
  console.log(`Shell process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down shell...');
  shellProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down shell...');
  shellProcess.kill('SIGTERM');
}); 