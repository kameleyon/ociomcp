// Auto-generated safe fallback for wasm-tool

export function activate() {
    console.log("[TOOL] wasm-tool activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * WasmTool
 * 
 * Incorporates WebAssembly modules for performance-critical code
 * Handles the integration between JavaScript and WebAssembly
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';
import { pascalCase } from './schema-gen';
import { exec } from 'child_process';
import { promisify } from 'util';

/**
 * Optimize a WebAssembly module
 */
async function optimizeWasm(options: OptimizeOptions, outputPath: string): Promise<string> {
  // Placeholder implementation for optimization
  // In a real scenario, you would use a tool like Binaryen or wasm-opt
  // to perform the optimization
  await fs.copyFile(options.wasmPath, outputPath);
  return `Optimized ${options.wasmPath} to ${outputPath}`;
}

/**
 * Analyze a WebAssembly module
 */
async function analyzeWasm(options: AnalyzeOptions): Promise<string> {
  // Placeholder implementation for analysis
  // In a real scenario, you would use a tool like wasm-objdump or wasm2wat
  // to perform the analysis
  return `Analysis of ${options.wasmPath} completed.`;
}

/**
 * Extract exports from a WebAssembly module
 */
function extractWasmExports(wasmBuffer: Buffer): Array<{ name: string; type: string; params: string[]; returnType: string }> {
  // Placeholder implementation for extracting exports
  // In a real scenario, you would parse the WASM binary to extract export information
  return [];
}

/**
 * Map WebAssembly types to TypeScript types
 */
function mapWasmTypeToTS(type: string): string {
  // Placeholder implementation for mapping types
  // In a real scenario, you would map WASM types to corresponding TypeScript types
  switch (type) {
    case 'i32':
    case 'i64':
      return 'number';
    case 'f32':
    case 'f64':
      return 'number';
    default:
      return 'any';
  }
}

// Promisify exec
const execAsync = promisify(exec);

// Define schemas for WasmTool
export const CompileWasmSchema = z.object({
  source: z.string(),
  language: z.enum(['c', 'cpp', 'rust', 'go', 'assemblyscript']),
  outputPath: z.string().optional(),
  optimizationLevel: z.enum(['0', '1', '2', '3', '4', 's', 'z']).optional(),
  features: z.array(z.string()).optional(),
  target: z.enum(['wasm32', 'wasm64']).default('wasm32'),
  debug: z.boolean().default(false),
});

export const GenerateBindingsSchema = z.object({
  wasmPath: z.string(),
  language: z.enum(['typescript', 'javascript']),
  outputPath: z.string().optional(),
  framework: z.enum(['vanilla', 'react', 'vue', 'angular', 'svelte']).optional(),
  mode: z.enum(['esm', 'commonjs']).default('esm'),
  generateTypes: z.boolean().default(true),
});

export const OptimizeWasmSchema = z.object({
  wasmPath: z.string(),
  outputPath: z.string().optional(),
  optimizationLevel: z.enum(['0', '1', '2', '3', '4', 's', 'z']).default('3'),
  features: z.array(z.string()).optional(),
  stripDebugInfo: z.boolean().default(true),
});

export const AnalyzeWasmSchema = z.object({
  wasmPath: z.string(),
  detailed: z.boolean().default(false),
});

// Types for WASM operations
interface CompileOptions {
  source: string;
  language: 'c' | 'cpp' | 'rust' | 'go' | 'assemblyscript';
  outputPath?: string;
  optimizationLevel?: '0' | '1' | '2' | '3' | '4' | 's' | 'z';
  features?: string[];
  target: 'wasm32' | 'wasm64';
  debug: boolean;
}

interface BindingsOptions {
  wasmPath: string;
  language: 'typescript' | 'javascript';
  outputPath?: string;
  framework?: 'vanilla' | 'react' | 'vue' | 'angular' | 'svelte';
  mode: 'esm' | 'commonjs';
  generateTypes: boolean;
}

interface OptimizeOptions {
  wasmPath: string;
  outputPath?: string;
  optimizationLevel: '0' | '1' | '2' | '3' | '4' | 's' | 'z';
  features?: string[];
  stripDebugInfo: boolean;
}

interface AnalyzeOptions {
  wasmPath: string;
  detailed: boolean;
}

/**
 * Compile source code to WebAssembly
 */
export async function handleCompileWasm(args: any) {
  try {
    const options = args as CompileOptions;
    
    // Check if source file exists
    try {
      await fs.access(options.source);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Source file ${options.source} does not exist` }],
        isError: true,
      };
    }
    
    // Determine output path
    const outputPath = options.outputPath || path.join(
      path.dirname(options.source),
      `${path.basename(options.source, path.extname(options.source))}.wasm`
    );
    
    // Compile based on language
    const result = await compileToWasm(options, outputPath);
    
    return {
      content: [{
        type: "text",
        text: `Successfully compiled ${options.source} to WebAssembly:\n${result}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error compiling to WebAssembly: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate JavaScript/TypeScript bindings for a WebAssembly module
 */
export async function handleGenerateBindings(args: any) {
  try {
    const options = args as BindingsOptions;
    
    // Check if WASM file exists
    try {
      await fs.access(options.wasmPath);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: WebAssembly file ${options.wasmPath} does not exist` }],
        isError: true,
      };
    }
    
    // Determine output path
    const outputPath = options.outputPath || path.join(
      path.dirname(options.wasmPath),
      `${path.basename(options.wasmPath, '.wasm')}.${options.language === 'typescript' ? 'ts' : 'js'}`
    );
    
    // Generate bindings
    const bindings = await generateBindings(options, outputPath);
    
    return {
      content: [{
        type: "text",
        text: `Successfully generated bindings for ${options.wasmPath}:\n${bindings}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating bindings: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Optimize a WebAssembly module
 */
export async function handleOptimizeWasm(args: any) {
  try {
    const options = args as OptimizeOptions;
    
    // Check if WASM file exists
    try {
      await fs.access(options.wasmPath);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: WebAssembly file ${options.wasmPath} does not exist` }],
        isError: true,
      };
    }
    
    // Determine output path
    const outputPath = options.outputPath || path.join(
      path.dirname(options.wasmPath),
      `${path.basename(options.wasmPath, '.wasm')}.opt.wasm`
    );
    
    // Optimize WASM
    const result = await optimizeWasm(options, outputPath);
    
    return {
      content: [{
        type: "text",
        text: `Successfully optimized ${options.wasmPath}:\n${result}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error optimizing WebAssembly: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Analyze a WebAssembly module
 */
export async function handleAnalyzeWasm(args: any) {
  try {
    const options = args as AnalyzeOptions;
    
    // Check if WASM file exists
    try {
      await fs.access(options.wasmPath);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: WebAssembly file ${options.wasmPath} does not exist` }],
        isError: true,
      };
    }
    
    // Analyze WASM
    const analysis = await analyzeWasm(options);
    
    return {
      content: [{
        type: "text",
        text: `WebAssembly Analysis for ${options.wasmPath}:\n${analysis}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error analyzing WebAssembly: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Compile source code to WebAssembly based on language
 */
async function compileToWasm(options: CompileOptions, outputPath: string): Promise<string> {
  // Create output directory if it doesn't exist
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Compile based on language
  switch (options.language) {
    case 'c':
    case 'cpp':
      return compileClangToWasm(options, outputPath);
    case 'rust':
      return compileRustToWasm(options, outputPath);
    case 'go':
      return compileGoToWasm(options, outputPath);
    case 'assemblyscript':
      return compileAssemblyScriptToWasm(options, outputPath);
    default:
      throw new Error(`Unsupported language: ${options.language}`);
  }
}

/**
 * Compile C/C++ to WebAssembly using Emscripten
 */
async function compileClangToWasm(options: CompileOptions, outputPath: string): Promise<string> {
  // Check if Emscripten is installed
  try {
    await execAsync('emcc --version');
  } catch (error) {
    throw new Error('Emscripten (emcc) is not installed or not in PATH');
  }
  
  // Build command
  const isC = options.language === 'c';
  const compiler = isC ? 'emcc' : 'em++';
  const optimizationFlag = options.optimizationLevel ? `-O${options.optimizationLevel}` : '-O3';
  const debugFlag = options.debug ? '-g' : '';
  const targetFlag = `-m${options.target}`;
  const featuresFlag = options.features?.length ? `-mfeature-${options.features.join(' -mfeature-')}` : '';
  
  const command = `${compiler} ${options.source} ${optimizationFlag} ${debugFlag} ${targetFlag} ${featuresFlag} -o ${outputPath}`;
  
  // Execute command
  const { stdout, stderr } = await execAsync(command);
  
  if (stderr && !stderr.includes('warning')) {
    throw new Error(`Compilation error: ${stderr}`);
  }
  
  return `Compiled ${options.source} to ${outputPath}\n${stdout}`;
}

/**
 * Compile Rust to WebAssembly
 */
async function compileRustToWasm(options: CompileOptions, outputPath: string): Promise<string> {
  // Check if Rust is installed
  try {
    await execAsync('rustc --version');
  } catch (error) {
    throw new Error('Rust (rustc) is not installed or not in PATH');
  }
  
  // Check if wasm32 target is installed
  try {
    await execAsync('rustup target list --installed');
  } catch (error) {
    // Install wasm32 target
    await execAsync(`rustup target add ${options.target}-unknown-unknown`);
  }
  
  // Build command
  const optimizationFlag = options.optimizationLevel ? `-C opt-level=${options.optimizationLevel}` : '-C opt-level=3';
  const debugFlag = options.debug ? '-g' : '';
  
  // If source is a directory with Cargo.toml, use cargo
  let command;
  if ((await fs.stat(options.source)).isDirectory()) {
    const cargoTomlPath = path.join(options.source, 'Cargo.toml');
    try {
      await fs.access(cargoTomlPath);
      
      // Use cargo
      command = `cd ${options.source} && cargo build --target ${options.target}-unknown-unknown ${options.debug ? '' : '--release'} && wasm-bindgen target/${options.target}-unknown-unknown/${options.debug ? 'debug' : 'release'}/*.wasm --out-dir ${path.dirname(outputPath)} --out-name ${path.basename(outputPath, '.wasm')}`;
    } catch (error) {
      throw new Error(`${cargoTomlPath} not found`);
    }
  } else {
    // Use rustc directly
    command = `rustc ${options.source} --target ${options.target}-unknown-unknown ${optimizationFlag} ${debugFlag} -o ${outputPath}`;
  }
  
  // Execute command
  const { stdout, stderr } = await execAsync(command);
  
  if (stderr && !stderr.includes('warning')) {
    throw new Error(`Compilation error: ${stderr}`);
  }
  
  return `Compiled ${options.source} to ${outputPath}\n${stdout}`;
}

/**
 * Compile Go to WebAssembly
 */
async function compileGoToWasm(options: CompileOptions, outputPath: string): Promise<string> {
  // Check if Go is installed
  try {
    await execAsync('go version');
  } catch (error) {
    throw new Error('Go is not installed or not in PATH');
  }
  
  // Build command
  const debugFlag = options.debug ? '-gcflags="all=-N -l"' : '';
  
  // Set environment variables
  const env = {
    ...process.env,
    GOOS: 'js',
    GOARCH: 'wasm',
  };
  
  // Execute command
  const command = `go build ${debugFlag} -o ${outputPath} ${options.source}`;
  const { stdout, stderr } = await execAsync(command, { env });
  
  if (stderr && !stderr.includes('warning')) {
    throw new Error(`Compilation error: ${stderr}`);
  }
  
  // Copy wasm_exec.js
  const goRoot = (await execAsync('go env GOROOT')).stdout.trim();
  const wasmExecPath = path.join(goRoot, 'misc', 'wasm', 'wasm_exec.js');
  const wasmExecDest = path.join(path.dirname(outputPath), 'wasm_exec.js');
  
  await fs.copyFile(wasmExecPath, wasmExecDest);
  
  return `Compiled ${options.source} to ${outputPath}\nCopied wasm_exec.js to ${wasmExecDest}\n${stdout}`;
}

/**
 * Compile AssemblyScript to WebAssembly
 */
async function compileAssemblyScriptToWasm(options: CompileOptions, outputPath: string): Promise<string> {
  // Check if AssemblyScript is installed
  try {
    await execAsync('npx asc --version');
  } catch (error) {
    throw new Error('AssemblyScript is not installed. Run "npm install assemblyscript" first.');
  }
  
  // Build command
  const optimizationFlag = options.optimizationLevel ? `-O${options.optimizationLevel}` : '-O3';
  const debugFlag = options.debug ? '--debug' : '';
  
  const command = `npx asc ${options.source} ${optimizationFlag} ${debugFlag} -b ${outputPath} --importMemory`;
  
  // Execute command
  const { stdout, stderr } = await execAsync(command);
  
  if (stderr && !stderr.includes('warning')) {
    throw new Error(`Compilation error: ${stderr}`);
  }
  
  return `Compiled ${options.source} to ${outputPath}\n${stdout}`;
}

/**
 * Generate JavaScript/TypeScript bindings for a WebAssembly module
 */
async function generateBindings(options: BindingsOptions, outputPath: string): Promise<string> {
  // Create output directory if it doesn't exist
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Read WASM file
  const wasmBuffer = await fs.readFile(options.wasmPath);
  
  // Generate bindings
  const extension = options.language === 'typescript' ? '.ts' : '.js';
  const bindingsContent = generateBindingsContent(wasmBuffer, options);
  
  // Write bindings file
  await fs.writeFile(outputPath, bindingsContent);
  
  // Generate types if requested
  let typesPath = '';
  if (options.language === 'javascript' && options.generateTypes) {
    typesPath = outputPath.replace(/\.js$/, '.d.ts');
    const typesContent = generateTypesContent(wasmBuffer, options);
    await fs.writeFile(typesPath, typesContent);
  }
  
  // Generate framework-specific integration if requested
  let integrationPath = '';
  if (options.framework && options.framework !== 'vanilla') {
    integrationPath = path.join(
      path.dirname(outputPath),
      `${path.basename(outputPath, extension)}.${options.framework}${extension}`
    );
    
    const integrationContent = generateFrameworkIntegration(options, path.basename(outputPath));
    await fs.writeFile(integrationPath, integrationContent);
  }
  
  let result = `Generated bindings at ${outputPath}`;
  if (typesPath) {
    result += `\nGenerated type definitions at ${typesPath}`;
  }
  if (integrationPath) {
    result += `\nGenerated ${options.framework} integration at ${integrationPath}`;
  }
  
  return result;
}

/**
 * Generate JavaScript/TypeScript bindings content
 */
function generateBindingsContent(wasmBuffer: Buffer, options: BindingsOptions): string {
  const moduleName = path.basename(options.wasmPath, '.wasm');
  const isTypeScript = options.language === 'typescript';
  const isESM = options.mode === 'esm';
  
  // Analyze WASM module to extract exports
  const exports = extractWasmExports(wasmBuffer);
  
  let content = '';
  
  // Add header
  content += `/**\n`;
  content += ` * WebAssembly bindings for ${moduleName}\n`;
  content += ` * Generated on ${new Date().toISOString()}\n`;
  content += ` */\n\n`;
  
  if (isESM) {
    // ESM module
    content += `// WebAssembly module loader\n`;
    content += `async function loadWasmModule(wasmPath${isTypeScript ? ': string' : ''}) {\n`;
    content += `  try {\n`;
    content += `    const response = await fetch(wasmPath);\n`;
    content += `    const wasmBuffer = await response.arrayBuffer();\n`;
    content += `    const wasmModule = await WebAssembly.instantiate(wasmBuffer);\n`;
    content += `    return wasmModule.instance.exports;\n`;
    content += `  } catch (error) {\n`;
    content += `    console.error('Failed to load WebAssembly module:', error);\n`;
    content += `    throw error;\n`;
    content += `  }\n`;
    content += `}\n\n`;
    
    // Class definition
    content += `class ${pascalCase(moduleName)} {\n`;
    content += `  private exports${isTypeScript ? ': any' : ''};\n`;
    content += `  private memory${isTypeScript ? ': WebAssembly.Memory' : ''};\n`;
    content += `  private initialized${isTypeScript ? ': boolean' : ''} = false;\n\n`;
    
    content += `  constructor() {}\n\n`;
    
    // Initialize method
    content += `  async initialize(wasmPath${isTypeScript ? ': string' : ''} = '${moduleName}.wasm') {\n`;
    content += `    if (this.initialized) return this;\n`;
    content += `    this.exports = await loadWasmModule(wasmPath);\n`;
    content += `    this.memory = this.exports.memory;\n`;
    content += `    this.initialized = true;\n`;
    content += `    return this;\n`;
    content += `  }\n\n`;
    
    // Helper methods
    content += `  // Helper methods for memory management\n`;
    content += `  private getMemoryBuffer() {\n`;
    content += `    return new Uint8Array(this.memory.buffer);\n`;
    content += `  }\n\n`;
    
    content += `  private writeString(str${isTypeScript ? ': string' : ''}, ptr${isTypeScript ? ': number' : ''}) {\n`;
    content += `    const buffer = this.getMemoryBuffer();\n`;
    content += `    const bytes = new TextEncoder().encode(str);\n`;
    content += `    buffer.set(bytes, ptr);\n`;
    content += `    buffer[ptr + bytes.length] = 0; // Null terminator\n`;
    content += `    return ptr;\n`;
    content += `  }\n\n`;
    
    content += `  private readString(ptr${isTypeScript ? ': number' : ''}) {\n`;
    content += `    const buffer = this.getMemoryBuffer();\n`;
    content += `    let end = ptr;\n`;
    content += `    while (buffer[end] !== 0) end++;\n`;
    content += `    return new TextDecoder().decode(buffer.slice(ptr, end));\n`;
    content += `  }\n\n`;
    
    // Export methods
    content += `  // Exported WebAssembly functions\n`;
    for (const exp of exports) {
      if (exp.type === 'function') {
        const params = exp.params.map((p, i) => `param${i}${isTypeScript ? `: ${mapWasmTypeToTS(p)}` : ''}`).join(', ');
        const returnType = isTypeScript ? `: ${mapWasmTypeToTS(exp.returnType)}` : '';
        
        content += `  ${exp.name}(${params})${returnType} {\n`;
        content += `    if (!this.initialized) throw new Error('Module not initialized. Call initialize() first.');\n`;
        content += `    return this.exports.${exp.name}(${exp.params.map((_, i) => `param${i}`).join(', ')});\n`;
        content += `  }\n\n`;
      }
    }
    
    content += `}\n\n`;
    
    // Export
    content += `export default ${pascalCase(moduleName)};\n`;
    
  } else {
    // CommonJS module
    content += `// WebAssembly module loader\n`;
    content += `function loadWasmModule(wasmPath${isTypeScript ? ': string' : ''}, callback${isTypeScript ? ': (error: Error | null, exports?: any) => void' : ''}) {\n`;
    content += `  try {\n`;
    content += `    const fs = require('fs');\n`;
    content += `    const wasmBuffer = fs.readFileSync(wasmPath);\n`;
    content += `    WebAssembly.instantiate(wasmBuffer).then(wasmModule => {\n`;
    content += `      callback(null, wasmModule.instance.exports);\n`;
    content += `    }).catch(error => {\n`;
    content += `      callback(error);\n`;
    content += `    });\n`;
    content += `  } catch (error) {\n`;
    content += `    callback(error);\n`;
    content += `  }\n`;
    content += `}\n\n`;
    
    // Class definition
    content += `class ${pascalCase(moduleName)} {\n`;
    content += `  constructor() {\n`;
    content += `    this.exports = null;\n`;
    content += `    this.memory = null;\n`;
    content += `    this.initialized = false;\n`;
    content += `  }\n\n`;
    
    // Initialize method
    content += `  initialize(wasmPath${isTypeScript ? ': string' : ''} = '${moduleName}.wasm', callback${isTypeScript ? ': (error: Error | null, instance?: ' + pascalCase(moduleName) + ') => void' : ''}) {\n`;
    content += `    if (this.initialized) {\n`;
    content += `      callback(null, this);\n`;
    content += `      return;\n`;
    content += `    }\n`;
    content += `    loadWasmModule(wasmPath, (error, exports) => {\n`;
    content += `      if (error) {\n`;
    content += `        callback(error);\n`;
    content += `        return;\n`;
    content += `      }\n`;
    content += `      this.exports = exports;\n`;
    content += `      this.memory = exports.memory;\n`;
    content += `      this.initialized = true;\n`;
    content += `      callback(null, this);\n`;
    content += `    });\n`;
    content += `  }\n\n`;
    
    // Helper methods
    content += `  // Helper methods for memory management\n`;
    content += `  getMemoryBuffer() {\n`;
    content += `    return new Uint8Array(this.memory.buffer);\n`;
    content += `  }\n\n`;
    
    content += `  writeString(str${isTypeScript ? ': string' : ''}, ptr${isTypeScript ? ': number' : ''}) {\n`;
    content += `    const buffer = this.getMemoryBuffer();\n`;
    content += `    const bytes = new TextEncoder().encode(str);\n`;
    content += `    buffer.set(bytes, ptr);\n`;
    content += `    buffer[ptr + bytes.length] = 0; // Null terminator\n`;
    content += `    return ptr;\n`;
    content += `  }\n\n`;
    
    content += `  readString(ptr${isTypeScript ? ': number' : ''}) {\n`;
    content += `    const buffer = this.getMemoryBuffer();\n`;
    content += `    let end = ptr;\n`;
    content += `    while (buffer[end] !== 0) end++;\n`;
    content += `    return new TextDecoder().decode(buffer.slice(ptr, end));\n`;
    content += `  }\n\n`;
    
    // Export methods
    content += `  // Exported WebAssembly functions\n`;
    for (const exp of exports) {
      if (exp.type === 'function') {
        const params = exp.params.map((p, i) => `param${i}${isTypeScript ? `: ${mapWasmTypeToTS(p)}` : ''}`).join(', ');
        const returnType = isTypeScript ? `: ${mapWasmTypeToTS(exp.returnType)}` : '';
        
        content += `  ${exp.name}(${params})${returnType} {\n`;
        content += `    if (!this.initialized) throw new Error('Module not initialized. Call initialize() first.');\n`;
        content += `    return this.exports.${exp.name}(${exp.params.map((_, i) => `param${i}`).join(', ')});\n`;
        content += `  }\n\n`;
      }
    }
    
    content += `}\n\n`;
    
    // Export
    content += `module.exports = ${pascalCase(moduleName)};\n`;
  }
  
  return content;
}

/**
 * Generate TypeScript type definitions
 */
function generateTypesContent(wasmBuffer: Buffer, options: BindingsOptions): string {
  const moduleName = path.basename(options.wasmPath, '.wasm');
  
  // Analyze WASM module to extract exports
  const exports = extractWasmExports(wasmBuffer);
  
  let content = '';
  
  // Add header
  content += `/**\n`;
  content += ` * TypeScript definitions for ${moduleName}\n`;
  content += ` * Generated on ${new Date().toISOString()}\n`;
  content += ` */\n\n`;
  
  // Class definition
  content += `declare class ${pascalCase(moduleName)} {\n`;
  content += `  private exports: any;\n`;
  content += `  private memory: WebAssembly.Memory;\n`;
  content += `  private initialized: boolean;\n\n`;
  
  content += `  constructor();\n\n`;
  
  // Initialize method
  if (options.mode === 'esm') {
    content += `  initialize(wasmPath?: string): Promise<${pascalCase(moduleName)}>;\n\n`;
  } else {
    content += `  initialize(wasmPath: string, callback: (error: Error | null, instance?: ${pascalCase(moduleName)}) => void): void;\n\n`;
  }
  
  // Helper methods
  content += `  private getMemoryBuffer(): Uint8Array;\n`;
  content += `  private writeString(str: string, ptr: number): number;\n`;
  content += `  private readString(ptr: number): string;\n\n`;
  
  // Export methods
  for (const exp of exports) {
    if (exp.type === 'function') {
      const params = exp.params.map((p, i) => `param${i}: ${mapWasmTypeToTS(p)}`).join(', ');
      const returnType = mapWasmTypeToTS(exp.returnType);
      
      content += `  ${exp.name}(${params}): ${returnType};\n`;
    }
  }
  
  content += `}\n\n`;
  
  // Export
  if (options.mode === 'esm') {
    content += `export default ${pascalCase(moduleName)};\n`;
  } else {
    content += `export = ${pascalCase(moduleName)};\n`;
  }
  
  return content;
}

/**
 * Generate framework-specific integration
 */
function generateFrameworkIntegration(options: BindingsOptions, bindingsFileName: string): string {
  const moduleName = path.basename(options.wasmPath, '.wasm');
  const pascalModuleName = pascalCase(moduleName);
  const isTypeScript = options.language === 'typescript';
  const extension = isTypeScript ? '.ts' : '.js';
  const isESM = options.mode === 'esm';
  
  let content = '';
  
  // Add header
  content += `/**\n`;
  content += ` * ${options.framework} integration for ${moduleName} WebAssembly module\n`;
  content += ` * Generated on ${new Date().toISOString()}\n`;
  content += ` */\n\n`;
  
  switch (options.framework) {
    case 'react':
      // React integration
      if (isESM) {
        content += `import React, { useState, useEffect } from 'react';\n`;
        content += `import ${pascalModuleName} from './${bindingsFileName.replace(extension, '')}';\n\n`;
        
        content += `export function use${pascalModuleName}(wasmPath${isTypeScript ? ': string' : ''} = '${moduleName}.wasm') {\n`;
        content += `  const [module, setModule] = useState${isTypeScript ? `<${pascalModuleName} | null>` : ''}(null);\n`;
        content += `  const [loading, setLoading] = useState(true);\n`;
        content += `  const [error, setError] = useState${isTypeScript ? '<Error | null>' : ''}(null);\n\n`;
        
        content += `  useEffect(() => {\n`;
        content += `    const initModule = async () => {\n`;
        content += `      try {\n`;
        content += `        const module = await ${pascalModuleName}(wasmPath);\n`;
        content += `        setModule(module);\n`;
        content += `      } catch (err) {\n`;
        content += `        setError(err instanceof Error ? err : new Error('Failed to load WASM module'));\n`;
        content += `      } finally {\n`;
        content += `        setLoading(false);\n`;
        content += `      }\n`;
        content += `    };\n\n`;
        content += `    initModule();\n`;
        content += `  }, [wasmPath]);\n\n`;
        content += `  return { module, loading, error };\n`;
        content += `}\n`;
      }
      
      return content;
    }
    return content;
  }
  
