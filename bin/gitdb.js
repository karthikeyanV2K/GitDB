#!/usr/bin/env node

/**
 * GitDB Global CLI Executable
 * This file is the main entry point when users run 'gitdb' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the path to the shell entry point
const shellPath = path.join(__dirname, '..', 'dist', 'shell.js');

// Forward all arguments to the shell
const args = process.argv.slice(2);

// Spawn the shell process
const child = spawn('node', [shellPath, ...args], {
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