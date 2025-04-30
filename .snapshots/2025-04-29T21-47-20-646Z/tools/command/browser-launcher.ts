// Auto-generated safe fallback for browser-launcher

export function activate() {
    console.log("[TOOL] browser-launcher activated (passive mode)");
}

/**
 * Called when a file is written
 * - Can automatically open HTML files in the browser
 * - Can detect changes to web applications and refresh the browser
 * - Can monitor for specific file types that should be previewed
 */
export function onFileWrite(event: { path: string; content: string }) {
  // Check if the file is an HTML file that should be automatically opened
  if (event.path.endsWith('.html') || event.path.endsWith('.htm')) {
    console.log(`[Browser Launcher] Detected HTML file change: ${event.path}`);
    
    // Could automatically open the file in the browser
    // openFileInBrowser(event.path).catch(err =>
    //   console.error(`[Browser Launcher] Failed to open file: ${err}`)
    // );
  }
}

/**
 * Called when a new session starts
 * - Can initialize browser settings
 * - Can check for running local servers
 * - Can prepare browser environment
 */
export function onSessionStart(session: { id: string; startTime: number }) {
  console.log(`[Browser Launcher] New session started: ${session.id}`);
  
  // Could check for running local servers
  // checkRunningServers().then(servers => {
  //   console.log(`[Browser Launcher] Found ${servers.length} running local servers`);
  // });
}

/**
 * Called when a command is executed
 * - Can handle browser-specific commands
 * - Can provide browser status information
 * - Can perform browser operations
 */
export function onCommand(command: { name: string; args: any[] }) {
  if (command.name === 'browser:open') {
    console.log('[Browser Launcher] Opening URL in browser...');
    // Open URL in browser
    if (command.args && command.args.length > 0) {
      return openInBrowser(command.args[0]);
    }
  }
  
  if (command.name === 'browser:open-file') {
    console.log('[Browser Launcher] Opening file in browser...');
    // Open file in browser
    if (command.args && command.args.length > 0) {
      return openFileInBrowser(command.args[0]);
    }
  }
  
  if (command.name === 'browser:open-server') {
    console.log('[Browser Launcher] Opening local server in browser...');
    // Open local server in browser
    if (command.args && command.args.length > 0) {
      return openLocalServer(command.args[0]);
    }
  }
}
/**
 * Browser Launcher
 * 
 * Opens completed applications in the default browser
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

/**
 * Schema for BrowserLauncher
 */
export const OpenInBrowserSchema = z.object({
  url: z.string(),
  browser: z.enum(['default', 'chrome', 'firefox', 'edge', 'safari']).optional().default('default'),
  incognito: z.boolean().optional().default(false),
  wait: z.boolean().optional().default(false),
});

export const OpenFileInBrowserSchema = z.object({
  filePath: z.string(),
  browser: z.enum(['default', 'chrome', 'firefox', 'edge', 'safari']).optional().default('default'),
  incognito: z.boolean().optional().default(false),
  wait: z.boolean().optional().default(false),
});

export const OpenLocalServerSchema = z.object({
  port: z.number(),
  path: z.string().optional().default('/'),
  hostname: z.string().optional().default('localhost'),
  browser: z.enum(['default', 'chrome', 'firefox', 'edge', 'safari']).optional().default('default'),
  incognito: z.boolean().optional().default(false),
  wait: z.boolean().optional().default(false),
});

/**
 * Open a URL in the browser
 * 
 * @param url URL to open
 * @param browser Browser to use
 * @param incognito Whether to open in incognito mode
 * @param wait Whether to wait for the browser to close
 * @returns Whether the browser was opened successfully
 */
export async function openInBrowser(
  url: string,
  browser: 'default' | 'chrome' | 'firefox' | 'edge' | 'safari' = 'default',
  incognito: boolean = false,
  wait: boolean = false,
): Promise<boolean> {
  try {
    let command: string;
    
    // Normalize the URL
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
      url = `http://${url}`;
    }
    
    // Build the command based on the platform and browser
    if (process.platform === 'win32') {
      // Windows
      switch (browser) {
        case 'chrome':
          command = `start chrome ${incognito ? '--incognito' : ''} "${url}"`;
          break;
        
        case 'firefox':
          command = `start firefox ${incognito ? '-private' : ''} "${url}"`;
          break;
        
        case 'edge':
          command = `start msedge ${incognito ? '--inprivate' : ''} "${url}"`;
          break;
        
        case 'safari':
          // Safari is not available on Windows
          command = `start "" "${url}"`;
          break;
        
        case 'default':
        default:
          command = `start "" "${url}"`;
          break;
      }
    } else if (process.platform === 'darwin') {
      // macOS
      switch (browser) {
        case 'chrome':
          command = `open -a "Google Chrome" ${incognito ? '--args --incognito' : ''} "${url}"`;
          break;
        
        case 'firefox':
          command = `open -a Firefox ${incognito ? '--args -private' : ''} "${url}"`;
          break;
        
        case 'edge':
          command = `open -a "Microsoft Edge" ${incognito ? '--args --inprivate' : ''} "${url}"`;
          break;
        
        case 'safari':
          // Safari on macOS doesn't support incognito mode from command line
          command = `open -a Safari "${url}"`;
          break;
        
        case 'default':
        default:
          command = `open "${url}"`;
          break;
      }
    } else {
      // Linux and other platforms
      switch (browser) {
        case 'chrome':
          command = `google-chrome ${incognito ? '--incognito' : ''} "${url}"`;
          break;
        
        case 'firefox':
          command = `firefox ${incognito ? '-private' : ''} "${url}"`;
          break;
        
        case 'edge':
          command = `microsoft-edge ${incognito ? '--inprivate' : ''} "${url}"`;
          break;
        
        case 'safari':
          // Safari is not available on Linux
          command = `xdg-open "${url}"`;
          break;
        
        case 'default':
        default:
          command = `xdg-open "${url}"`;
          break;
      }
    }
    
    // Execute the command
    if (wait) {
      await execAsync(command);
    } else {
      execAsync(command);
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Open a file in the browser
 * 
 * @param filePath Path to the file
 * @param browser Browser to use
 * @param incognito Whether to open in incognito mode
 * @param wait Whether to wait for the browser to close
 * @returns Whether the file was opened successfully
 */
export async function openFileInBrowser(
  filePath: string,
  browser: 'default' | 'chrome' | 'firefox' | 'edge' | 'safari' = 'default',
  incognito: boolean = false,
  wait: boolean = false,
): Promise<boolean> {
  try {
    // Check if the file exists
    await fs.access(filePath);
    
    // Convert the file path to a URL
    const fileUrl = `file://${path.resolve(filePath).replace(/\\/g, '/')}`;
    
    // Open the file URL in the browser
    return openInBrowser(fileUrl, browser, incognito, wait);
  } catch (error) {
    return false;
  }
}

/**
 * Open a local server in the browser
 * 
 * @param port Port number
 * @param path Path to open
 * @param hostname Hostname
 * @param browser Browser to use
 * @param incognito Whether to open in incognito mode
 * @param wait Whether to wait for the browser to close
 * @returns Whether the server was opened successfully
 */
export async function openLocalServer(
  port: number,
  path: string = '/',
  hostname: string = 'localhost',
  browser: 'default' | 'chrome' | 'firefox' | 'edge' | 'safari' = 'default',
  incognito: boolean = false,
  wait: boolean = false,
): Promise<boolean> {
  try {
    // Normalize the path
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    
    // Build the URL
    const url = `http://${hostname}:${port}${path}`;
    
    // Open the URL in the browser
    return openInBrowser(url, browser, incognito, wait);
  } catch (error) {
    return false;
  }
}

/**
 * Check if a port is in use
 * 
 * @param port Port number
 * @returns Whether the port is in use
 */
export async function isPortInUse(port: number): Promise<boolean> {
  try {
    let command: string;
    
    if (process.platform === 'win32') {
      // Windows
      command = `netstat -ano | findstr :${port}`;
    } else {
      // Unix-like systems
      command = `lsof -i:${port}`;
    }
    
    const { stdout } = await execAsync(command);
    
    return stdout.trim().length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Find an available port
 * 
 * @param startPort Port to start checking from
 * @param endPort Port to end checking at
 * @returns Available port or null if none found
 */
export async function findAvailablePort(startPort: number = 3000, endPort: number = 9000): Promise<number | null> {
  for (let port = startPort; port <= endPort; port++) {
    const inUse = await isPortInUse(port);
    
    if (!inUse) {
      return port;
    }
  }
  
  return null;
}

/**
 * Handle open_in_browser command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleOpenInBrowser(args: any) {
  try {
    const { url, browser, incognito, wait } = args;
    const result = await openInBrowser(url, browser, incognito, wait);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Opened URL in browser: ${url}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to open URL in browser: ${url}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error opening URL in browser: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle open_file_in_browser command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleOpenFileInBrowser(args: any) {
  try {
    const { filePath, browser, incognito, wait } = args;
    const result = await openFileInBrowser(filePath, browser, incognito, wait);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Opened file in browser: ${filePath}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to open file in browser: ${filePath}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error opening file in browser: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle open_local_server command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleOpenLocalServer(args: any) {
  try {
    const { port, path, hostname, browser, incognito, wait } = args;
    const result = await openLocalServer(port, path, hostname, browser, incognito, wait);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Opened local server in browser: http://${hostname}:${port}${path}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to open local server in browser: http://${hostname}:${port}${path}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error opening local server in browser: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle find_available_port command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleFindAvailablePort(args: any) {
  try {
    const { startPort, endPort } = args;
    const port = await findAvailablePort(startPort, endPort);
    
    if (port) {
      return {
        content: [{ type: "text", text: `Found available port: ${port}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `No available ports found between ${startPort} and ${endPort}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error finding available port: ${error}` }],
      isError: true,
    };
  }
}

