#!/usr/bin/env node

/**
 * GitDB Global CLI Executable
 * This file is the main entry point when users run 'gitdb' globally
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the path to the CLI entry point
const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');

// Forward all arguments to the CLI
const args = process.argv.slice(2);

// Spawn the CLI process
const child = spawn('node', [cliPath, ...args], {
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