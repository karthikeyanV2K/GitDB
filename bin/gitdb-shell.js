#!/usr/bin/env node

/**
 * GitDB Shell Global Executable
 * This file is the entry point when users run 'gitdb-shell' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the path to the shell entry point
const shellPath = path.join(__dirname, '..', 'dist', 'shell.js');

// Spawn the shell process
const child = spawn('node', [shellPath], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
});

// Handle process exit
child.on('close', (code) => {
    process.exit(code);
});

// Handle process errors
child.on('error', (err) => {
    console.error('Error running GitDB Shell:', err.message);
    process.exit(1);
}); 