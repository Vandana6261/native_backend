// scan_files.js
// Recursively scans the project directory and prints a tree-like view of files and folders.
// Usage: node scan_files.js

import { promises as fs } from 'fs';
import path from 'path';

const baseDir = process.cwd();

async function walk(dir, prefix = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile());
  const dirs = entries.filter(e => e.isDirectory());

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const connector = i === files.length - 1 && dirs.length === 0 ? '└─' : '├─';
    console.log(`${prefix}${connector} ${file.name}`);
  }

  for (let i = 0; i < dirs.length; i++) {
    const sub = dirs[i];
    const connector = i === dirs.length - 1 ? '└─' : '├─';
    console.log(`${prefix}${connector} ${sub.name}`);
    const newPrefix = prefix + (i === dirs.length - 1 ? '   ' : '│  ');
    await walk(path.join(dir, sub.name), newPrefix);
  }
}

walk(baseDir).catch(err => {``
  console.error('Error scanning directory:', err);
});
