// Type declarations for function tools index
export * from './create_snapshot.js';
export * from './edit_block.js';

export function activate(): void;
export function onFileWrite(event: any): void;
export function onSessionStart(session: any): void;
export function onCommand(command: any): void;