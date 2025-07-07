#!/usr/bin/env node

/**
 * GitDB Server Global Executable
 * This file is the entry point when users run 'gitdb-server' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the path to the main GitDB application
const gitdbPath = path.join(__dirname, '..', 'dist', 'main.js');

// Forward server arguments
const args = process.argv.slice(2);
const serverArgs = ['server', ...args];

// Spawn the GitDB server process
const child = spawn('node', [gitdbPath, ...serverArgs], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
});

// Handle process exit
child.on('close', (code) => {
    process.exit(code);
});

// Handle process errors
child.on('error', (err) => {
    console.error('Error running GitDB Server:', err.message);
    process.exit(1);
}); 