#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetPath = path.join(
  __dirname,
  '../dist/bahdashych-on-security-admin/browser'
);

function replaceEnvVarsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let replaced = false;

  // Replace environment variable placeholders
  content = content.replace(/\$\{BASIC_AUTH_USERNAME\}/g, () => {
    replaced = true;
    return process.env.BASIC_AUTH_USERNAME || '';
  });

  content = content.replace(/\$\{BASIC_AUTH_PASSWORD\}/g, () => {
    replaced = true;
    return process.env.BASIC_AUTH_PASSWORD || '';
  });

  if (replaced) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Environment variables replaced in: ${filePath}`);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      replaceEnvVarsInFile(filePath);
    }
  });
}

console.log('Replacing environment variables in production build...');
processDirectory(targetPath);
console.log('Done!');
