#!/usr/bin/env node

if (+process.versions.node.split('.')[0] < 18) {
  console.error('HTTL CLI requires Node.js 18 or higher')
  process.exit(1)
}

try {
  require('../dist/index.js');
} catch (e) {
  console.error(e);
}