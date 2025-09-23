#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');
const sourceDir = path.join(rootDir, 'data', 'rag');
const targetDir = path.join(rootDir, 'apps', 'web', 'public', 'rag');

async function syncRag() {
  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    // Remove existing target directory (if any) so we always get a fresh copy.
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(targetDir, { recursive: true });

    let copied = 0;
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const from = path.join(sourceDir, entry.name);
      const to = path.join(targetDir, entry.name);
      await fs.copyFile(from, to);
      copied += 1;
    }

    console.log(
      `Synced ${copied} RAG files to ${path.relative(rootDir, targetDir)}`
    );
  } catch (error) {
    console.error('Failed to sync RAG assets:', error.message);
    process.exitCode = 1;
  }
}

syncRag();
