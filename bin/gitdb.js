#!/usr/bin/env node

/**
 * GitDB Global CLI Executable
 * This file is the main entry point when users run 'gitdb' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the path to the main GitDB application
const gitdbPath = path.join(__dirname, '..', 'dist', 'main.js');

// Forward all arguments to the main application
const args = process.argv.slice(2);

// Spawn the main GitDB process
const child = spawn('node', [gitdbPath, ...args], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
});

// Handle process exit
child.on('close', (code) => {
    process.exit(code);
});

// Handle process errors
child.on('error', (err) => {
    console.error('Error running GitDB:', err.message);
    process.exit(1);
}); 