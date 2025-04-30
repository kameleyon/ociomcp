// Type declarations for automated tools index
export * from './BaseAutomatedTool.js';
export * from './AutoContinue.js';
export * from './CodeFormatter.js';
export * from './ImportFixer.js';
export * from './TypeScriptErrorFixer.js';

export function activate(): void;
export function onFileWrite(event: any): void;
export function onSessionStart(session: any): void;
export function onCommand(command: any): void;