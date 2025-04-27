// Using ES module import instead of CommonJS require
import * as srcTools from "./src/tools/index.js";
import * as tools from "./dist/activatedTools/index.js";

console.log("=== Starting tool activation test ===");
console.log("Testing tools from ./tools/index.js:");

// Get the exported tools from tools/index.js (CodeFixer, ResponsiveUI, SnapshotCreator)
const toolNames = Object.keys(tools).filter(name =>
  name !== 'activateTools' &&
  name !== 'broadcastSessionStart' &&
  name !== 'broadcastFileWrite' &&
  name !== 'broadcastCommand'
);

for (const name of toolNames) {
  const tool = tools[name];
  if (typeof tool.activate === "function") {
    console.log(`✅ ${name}: activate() found. Trying to activate...`);
    try {
      await tool.activate();
      console.log(`   -> ${name} activated successfully.`);
    } catch (error) {
      console.error(`❌ ${name} failed to activate:`, error);
    }
  } else {
    console.warn(`⚠️ ${name}: No activate() method.`);
  }
}

console.log("\nTesting tools from ./src/tools/index.js:");

// Get the exported tools from src/tools/index.js
const srcToolNames = Object.keys(srcTools).filter(name =>
  name !== 'activateTools' &&
  name !== 'broadcastSessionStart' &&
  name !== 'broadcastFileWrite' &&
  name !== 'broadcastCommand'
);

for (const name of srcToolNames) {
  const toolModule = srcTools[name];
  
  console.log(`Module: ${name}`);
  
  if (typeof toolModule.activate === "function") {
    console.log(`✅ ${name}: activate() found. Trying to activate...`);
    try {
      await toolModule.activate();
      console.log(`   -> ${name} activated successfully.`);
    } catch (error) {
      console.error(`❌ ${name} failed to activate:`, error);
    }
  } else {
    console.warn(`⚠️ ${name}: No activate() method at module level.`);
    
    // Check if any submodules have activate methods
    const subModules = Object.keys(toolModule).filter(key =>
      typeof toolModule[key] === 'object' &&
      toolModule[key] !== null
    );
    
    for (const subModule of subModules) {
      if (typeof toolModule[subModule].activate === "function") {
        console.log(`  ✅ ${name}.${subModule}: activate() found. Trying to activate...`);
        try {
          await toolModule[subModule].activate();
          console.log(`     -> ${name}.${subModule} activated successfully.`);
        } catch (error) {
          console.error(`  ❌ ${name}.${subModule} failed to activate:`, error);
        }
      }
    }
  }
}

console.log("=== Tool activation test complete ===");
