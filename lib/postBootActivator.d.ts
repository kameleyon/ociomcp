/**
 * Post-Boot Activation System for Tools
 *
 * Dynamically imports and activates tools after the server has fully started.
 * - Reads enabled tools from configuration files
 * - Attempts to activate each tool via its module's activate() function
 * - Falls back to passive mode if no activate() function exists
 * - Logs activation status for all tools
 */
interface ActivationResult {
    toolName: string;
    status: 'Activated' | 'Fallback' | 'Failed';
    message?: string;
}
export declare const activateTools: () => Promise<ActivationResult[]>;
export declare const setupPostBootActivation: () => void;
export declare const manuallyTriggerActivation: () => Promise<ActivationResult[]>;
export {};
