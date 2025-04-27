// Using ES module import instead of CommonJS require
import * as tools from "./dist/activatedTools/index.js";

console.log("=== Starting tool activation test ===");
console.log("Testing tools from ./dist/activatedTools/index.js:");

// Get the exported tools from dist/activatedTools/index.js
const toolNames = Object.keys(tools).filter(name =>
  name !== 'activateTools' &&
  name !== 'broadcastSessionStart' &&
  name !== 'broadcastFileWrite' &&
  name !== 'broadcastCommand'
);

console.log(`Found ${toolNames.length} tools to test.`);

// Test each tool
for (const name of toolNames) {
  const tool = tools[name];
  console.log(`\nTesting tool: ${name}`);
  
  if (typeof tool.activate === "function") {
    console.log(`✅ ${name}: activate() found. Trying to activate...`);
    try {
      await tool.activate();
      console.log(`   -> ${name} activated successfully.`);
    } catch (error) {
      console.error(`❌ ${name} failed to activate:`, error);
    }
  } else {
    console.warn(`⚠️ ${name}: No activate() method at module level.`);
    
    // Check if any submodules have activate methods
    const subModules = Object.keys(tool).filter(key =>
      typeof tool[key] === 'object' &&
      tool[key] !== null
    );
    
    if (subModules.length > 0) {
      console.log(`   Found ${subModules.length} submodules to test.`);
      
      for (const subModule of subModules) {
        if (typeof tool[subModule].activate === "function") {
          console.log(`  ✅ ${name}.${subModule}: activate() found. Trying to activate...`);
          try {
            await tool[subModule].activate();
            console.log(`     -> ${name}.${subModule} activated successfully.`);
          } catch (error) {
            console.error(`  ❌ ${name}.${subModule} failed to activate:`, error);
          }
        }
      }
    }
  }
}

console.log("\n=== Tool activation test complete ===");
