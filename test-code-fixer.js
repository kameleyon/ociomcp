#!/usr/bin/env node

/**
 * Test script for the code-fixer tool
 * This script tests the code-fixer tool with various scenarios to ensure it doesn't disconnect
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the code-fixer module
let codeFixer;
try {
  codeFixer = await import('./dist/tools/automated-tools/code-fixer.js');
  console.log('Successfully imported code-fixer module');
} catch (error) {
  console.error('Failed to import code-fixer module:', error);
  process.exit(1);
}

// Create a test directory
const testDir = path.join(__dirname, 'test-code-fixer');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
  console.log(`Created test directory: ${testDir}`);
}

// Create test files with various sizes and issues
const createTestFile = (filename, size, language) => {
  const filePath = path.join(testDir, filename);
  let content = '';
  
  // Add language-specific content with common issues
  if (language === 'javascript') {
    content += `// Test JavaScript file with common issues\n\n`;
    content += `var test = function() {\n`;
    content += `  var x = 5;\n`;
    content += `  if (x == 10) {\n`; // Using == instead of ===
    content += `    console.log("x is 10");\n`; // Console.log statement
    content += `  }\n`;
    content += `  return x;\n`;
    content += `};\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `// TODO: Add more code here\n`;
      content += `function test${content.length}() { return new Array(); }\n`; // Using Array constructor
    }
  } else if (language === 'typescript') {
    content += `// Test TypeScript file with common issues\n\n`;
    content += `interface TestInterface {\n`;
    content += `  name: string;\n`;
    content += `  age: number;\n`;
    content += `}\n\n`;
    content += `var test = function(data: any) {\n`; // Using any type
    content += `  var x: number = 5;\n`; // Using var instead of const
    content += `  if (x != 10) {\n`; // Using != instead of !==
    content += `    console.log("x is not 10");\n`; // Console.log statement
    content += `  }\n`;
    content += `  return x;\n`;
    content += `};\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `// TODO: Add more code here\n`;
      content += `function test${content.length}(items: Array<string>) { return items.length; }\n`; // Using Array<T> instead of T[]
    }
  } else if (language === 'python') {
    content += `# Test Python file with common issues\n\n`;
    content += `class TestClass:\n`;
    content += `    def __init__(self, name):\n`;
    content += `        self.name = name\n\n`;
    content += `    def test_method(self):\n`;
    content += `        x = 5\n`;
    content += `        if x == 10:\n`;
    content += `            print "x is 10"\n`; // Python 2 print statement
    content += `        return x\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `# TODO Add more code here\n`;
      content += `def test_function${content.length}():\n    return [x for x in range(10)]\n`;
    }
  } else if (language === 'cpp') {
    content += `// Test C++ file with common issues\n\n`;
    content += `#include <iostream>\n\n`;
    content += `class TestClass {\n`;
    content += `public:\n`;
    content += `    TestClass(std::string name) : name(name) {}\n\n`;
    content += `    void test_method() {\n`;
    content += `        int x = 5;\n`;
    content += `        if (x = 10) {\n`; // Assignment in if condition
    content += `            std::cout << "x is 10";\n`; // Missing std::endl
    content += `        }\n`;
    content += `    }\n\n`;
    content += `private:\n`;
    content += `    std::string name;\n`;
    content += `};\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `// TODO: Add more code here\n`;
      content += `void test_function${content.length}() {\n    int* ptr = new int(10);\n    delete ptr;\n}\n`; // Missing ptr = nullptr
    }
  } else if (language === 'java') {
    content += `// Test Java file with common issues\n\n`;
    content += `public class TestClass {\n`;
    content += `    private String name;\n\n`;
    content += `    public TestClass(String name) {\n`;
    content += `        this.name = name;\n`;
    content += `    }\n\n`;
    content += `    public void testMethod() {\n`;
    content += `        int x = 5;\n`;
    content += `        if (x == 10) {\n`;
    content += `            System.out.print("x is 10");\n`; // Missing println
    content += `        }\n`;
    content += `    }\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `    // TODO: Add more code here\n`;
      content += `    public void testFunction${content.length}() {\n        java.util.ArrayList<String> list = new java.util.ArrayList<String>();\n    }\n`; // Missing diamond operator
    }
  } else if (language === 'go') {
    content += `// Test Go file with common issues\n\n`;
    content += `package main\n\n`;
    content += `import "fmt"\n\n`;
    content += `type TestStruct struct {\n`;
    content += `    Name string\n`;
    content += `}\n\n`;
    content += `func TestFunction(name string) TestStruct {\n`;
    content += `    return TestStruct{Name: name}\n`;
    content += `}\n\n`;
    content += `func main() {\n`;
    content += `    x := 5\n`;
    content += `    if x == 10 {\n`;
    content += `        fmt.Print("x is 10")\n`; // Missing Println
    content += `    }\n`;
    content += `}\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `// TODO: Add more code here\n`;
      content += `func testFunction${content.length}() {\n    for i := 0; i < 10; i++ {\n        fmt.Println(i)\n    }\n}\n`; // Could use range
    }
  } else if (language === 'ruby') {
    content += `# Test Ruby file with common issues\n\n`;
    content += `class TestClass\n`;
    content += `  def initialize(name)\n`;
    content += `    @name = name\n`;
    content += `  end\n\n`;
    content += `  def test_method\n`;
    content += `    x = 5\n`;
    content += `    if x == 10\n`;
    content += `      puts "x is 10"\n`; // Single quotes better for interpolation
    content += `    end\n`;
    content += `    return x\n`;
    content += `  end\n`;
    content += `end\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `# TODO Add more code here\n`;
      content += `for i in 0..10 do\n  puts i\nend\n`; // Could use each
    }
  } else if (language === 'php') {
    content += `<?php\n// Test PHP file with common issues\n\n`;
    content += `class TestClass {\n`;
    content += `    private $name;\n\n`;
    content += `    public function __construct($name) {\n`;
    content += `        $this->name = $name;\n`;
    content += `    }\n\n`;
    content += `    public function testMethod() {\n`;
    content += `        $x = 5;\n`;
    content += `        if ($x == 10) {\n`; // Using == instead of ===
    content += `            echo "x is 10";\n`; // Missing PHP_EOL
    content += `        }\n`;
    content += `        return $x;\n`;
    content += `    }\n`;
    content += `}\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `// TODO: Add more code here\n`;
      content += `function testFunction${content.length}() {\n    $result = mysql_query("SELECT * FROM users");\n    return $result;\n}\n`; // Using deprecated mysql_
    }
  } else if (language === 'swift') {
    content += `// Test Swift file with common issues\n\n`;
    content += `class TestClass {\n`;
    content += `    var name: String\n\n`;
    content += `    init(name: String) {\n`;
    content += `        self.name = name\n`;
    content += `    }\n\n`;
    content += `    func testMethod() -> Int {\n`;
    content += `        let x = 5\n`;
    content += `        if x == 10 {\n`;
    content += `            print (x)\n`; // Extra space in print
    content += `        }\n`;
    content += `        return x\n`;
    content += `    }\n`;
    content += `}\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `// TODO: Add more code here\n`;
      content += `func testFunction${content.length}() {\n    var x : Int = 10\n}\n`; // Extra space in type declaration
    }
  } else if (language === 'rust') {
    content += `// Test Rust file with common issues\n\n`;
    content += `struct TestStruct {\n`;
    content += `    name: String,\n`;
    content += `}\n\n`;
    content += `impl TestStruct {\n`;
    content += `    fn new(name: String) -> Self {\n`;
    content += `        TestStruct { name }\n`;
    content += `    }\n\n`;
    content += `    fn test_method(&self) -> i32 {\n`;
    content += `        let x = 5;\n`;
    content += `        if x == 10 {\n`;
    content += `            println! ("x is 10");\n`; // Extra space in macro
    content += `        }\n`;
    content += `        x\n`;
    content += `    }\n`;
    content += `}\n\n`;
    
    // Add more content to reach the desired size
    while (content.length < size) {
      content += `// TODO: Add more code here\n`;
      content += `fn test_function${content.length}() {\n    let mut x : i32 = 10;\n}\n`; // Extra space in type declaration
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Created test file: ${filePath} (${content.length} bytes)`);
  return filePath;
};

// Create test files of different sizes
const smallJsFile = createTestFile('small.js', 1000, 'javascript');
const mediumJsFile = createTestFile('medium.js', 50000, 'javascript');
const largeJsFile = createTestFile('large.js', 500000, 'javascript');
const smallTsFile = createTestFile('small.ts', 1000, 'typescript');
const mediumTsFile = createTestFile('medium.ts', 50000, 'typescript');
const largeTsFile = createTestFile('large.ts', 500000, 'typescript');

// Create test files for additional languages
const pythonFile = createTestFile('test.py', 5000, 'python');
const cppFile = createTestFile('test.cpp', 5000, 'cpp');
const javaFile = createTestFile('test.java', 5000, 'java');
const goFile = createTestFile('test.go', 5000, 'go');
const rubyFile = createTestFile('test.rb', 5000, 'ruby');
const phpFile = createTestFile('test.php', 5000, 'php');
const swiftFile = createTestFile('test.swift', 5000, 'swift');
const rustFile = createTestFile('test.rs', 5000, 'rust');

// Test functions
const testAnalyzeCode = async (filePath) => {
  console.log(`\nTesting analyzeCode on ${filePath}`);
  try {
    console.time('analyzeCode');
    const result = await codeFixer.handleAnalyzeCode({ path: filePath });
    console.timeEnd('analyzeCode');
    console.log(`Analysis result: ${result.content[0].text.substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.error(`Error analyzing code: ${error}`);
    return false;
  }
};

const testFixCode = async (filePath) => {
  console.log(`\nTesting fixCode on ${filePath}`);
  try {
    console.time('fixCode');
    const result = await codeFixer.handleFixCode({ path: filePath });
    console.timeEnd('fixCode');
    console.log(`Fix result: ${result.content[0].text.substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.error(`Error fixing code: ${error}`);
    return false;
  }
};

// Test all supported languages
const testAllLanguages = async () => {
  console.log('\nTesting all supported languages:');
  
  // Test Python
  await testAnalyzeCode(pythonFile);
  await testFixCode(pythonFile);
  
  // Test C++
  await testAnalyzeCode(cppFile);
  await testFixCode(cppFile);
  
  // Test Java
  await testAnalyzeCode(javaFile);
  await testFixCode(javaFile);
  
  // Test Go
  await testAnalyzeCode(goFile);
  await testFixCode(goFile);
  
  // Test Ruby
  await testAnalyzeCode(rubyFile);
  await testFixCode(rubyFile);
  
  // Test PHP
  await testAnalyzeCode(phpFile);
  await testFixCode(phpFile);
  
  // Test Swift
  await testAnalyzeCode(swiftFile);
  await testFixCode(swiftFile);
  
  // Test Rust
  await testAnalyzeCode(rustFile);
  await testFixCode(rustFile);
};

const testFixProject = async () => {
  console.log(`\nTesting fixProject on ${testDir}`);
  try {
    console.time('fixProject');
    const result = await codeFixer.handleFixProject({ 
      directory: testDir,
      recursive: true,
      extensions: ['.js', '.ts'],
      fixTypes: ['all']
    });
    console.timeEnd('fixProject');
    console.log(`Project fix result: ${result.content[0].text.substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.error(`Error fixing project: ${error}`);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log('Starting code-fixer tests...');
  
  // Test analyze code
  await testAnalyzeCode(smallJsFile);
  await testAnalyzeCode(mediumJsFile);
  await testAnalyzeCode(largeJsFile);
  await testAnalyzeCode(smallTsFile);
  await testAnalyzeCode(mediumTsFile);
  await testAnalyzeCode(largeTsFile);
  
  // Test fix code
  await testFixCode(smallJsFile);
  await testFixCode(mediumJsFile);
  await testFixCode(largeJsFile);
  await testFixCode(smallTsFile);
  await testFixCode(mediumTsFile);
  await testFixCode(largeTsFile);
  
  // Test all supported languages
  await testAllLanguages();
  
  // Test fix project
  await testFixProject();
  
  console.log('\nAll tests completed!');
};

// Run the tests
runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});