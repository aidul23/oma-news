import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractTests(content) {
  const tests = [];
  const lines = content.split('\n');
  
  let currentDescribe = '';
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Get describe block
    const describeMatch = trimmedLine.match(/describe\(['"]([^'"]+)['"]/);
    if (describeMatch) {
      currentDescribe = describeMatch[1];
    }
    
    // Get test cases
    const testMatch = trimmedLine.match(/it\(['"]([^'"]+)['"]/);
    if (testMatch && currentDescribe) {
      tests.push({
        describe: currentDescribe,
        test: testMatch[1]
      });
    }
  });
  
  return tests;
}

function getTestFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getTestFiles(fullPath));
    } else if (item.endsWith('.test.jsx')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

// Get all test files from pages directory
const pagesDir = path.join(__dirname, 'pages');
const testFiles = getTestFiles(pagesDir);

// Process test files
const components = {};

testFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const componentName = path.basename(file, '.test.jsx');
  const tests = extractTests(content);
  
  if (!components[componentName]) {
    components[componentName] = [];
  }
  
  tests.forEach(({ describe, test }) => {
    components[componentName].push({ describe, test });
  });
});

// Print summary
console.log('\n=== Test Summary ===\n');

Object.entries(components)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([component, tests]) => {
    console.log(`📋 ${component} Component`);
    let currentDescribe = '';
    
    tests.forEach(({ describe, test }) => {
      if (describe !== currentDescribe) {
        console.log(`  📝 ${describe}`);
        currentDescribe = describe;
      }
      console.log(`    ✓ ${test}`);
    });
    console.log(''); // Add spacing
  });

console.log('=== End of Test Summary ===\n');

// Print statistics
const totalComponents = Object.keys(components).length;
const totalTests = Object.values(components)
  .reduce((sum, tests) => sum + tests.length, 0);

console.log(`📊 Statistics:`);
console.log(`  • Total Components: ${totalComponents}`);
console.log(`  • Total Test Cases: ${totalTests}\n`);
