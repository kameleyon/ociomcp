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
  console.log(`[Browser Launcher] File written: ${event.path}`);
  
  // Check if the file is an HTML file that should be automatically opened
  if (event.path.endsWith('.html') || event.path.endsWith('.htm')) {
    console.log(`[Browser Launcher] Detected HTML file change: ${event.path}`);
    
    // Check if the file is a complete HTML document
    const isCompleteHtml = event.content.includes('<!DOCTYPE html>') ||
                          event.content.includes('<html>') ||
                          event.content.includes('<HTML>');
    
    if (isCompleteHtml) {
      console.log(`[Browser Launcher] Detected complete HTML document: ${event.path}`);
      
      // We don't automatically open the file, but return information about it
      return {
        detected: true,
        filePath: event.path,
        type: 'html',
        isComplete: true,
        canOpen: true
      };
    } else {
      return {
        detected: true,
        filePath: event.path,
        type: 'html',
        isComplete: false,
        canOpen: true
      };
    }
  }
  
  // Check for CSS files
  if (event.path.endsWith('.css')) {
    console.log(`[Browser Launcher] Detected CSS file change: ${event.path}`);
    return {
      detected: true,
      filePath: event.path,
      type: 'css',
      canOpen: false
    };
  }
  
  // Check for JavaScript files
  if (event.path.endsWith('.js')) {
    console.log(`[Browser Launcher] Detected JavaScript file change: ${event.path}`);
    return {
      detected: true,
      filePath: event.path,
      type: 'javascript',
      canOpen: false
    };
  }
  
  return { detected: false };
}

/**
 * Called when a new session starts
 * - Can initialize browser settings
 * - Can check for running local servers
 * - Can prepare browser environment
 */
export function onSessionStart(session: { id: string; startTime: number }) {
  console.log(`[Browser Launcher] New session started: ${session.id}`);
  
  try {
    // Check for running local servers by checking common ports
    const commonPorts = [3000, 8000, 8080, 4200, 5000, 5173, 5174, 3001];
    
    // Log the platform information
    const platform = process.platform;
    console.log(`[Browser Launcher] Platform: ${platform}`);
    
    // Check each port asynchronously
    for (const port of commonPorts) {
      isPortInUse(port).then(inUse => {
        if (inUse) {
          console.log(`[Browser Launcher] Found server running on port ${port}`);
        }
      }).catch(error => {
        console.error(`[Browser Launcher] Error checking port ${port}: ${error}`);
      });
    }
    
    // Find an available port for potential use
    findAvailablePort().then(port => {
      if (port) {
        console.log(`[Browser Launcher] Found available port: ${port}`);
      }
    }).catch(error => {
      console.error(`[Browser Launcher] Error finding available port: ${error}`);
    });
    
    return {
      initialized: true,
      sessionId: session.id,
      platform,
      startTime: session.startTime
    };
  } catch (error) {
    console.error(`[Browser Launcher] Error during initialization: ${error}`);
    return {
      initialized: false,
      error: String(error)
    };
  }
}

/**
 * Called when a command is executed
 * - Can handle browser-specific commands
 * - Can provide browser status information
 * - Can perform browser operations
 */
export function onCommand(command: { name: string; args: any[] }) {
  console.log(`[Browser Launcher] Command received: ${command.name}`);
  
  try {
    if (command.name === 'browser:open') {
      console.log('[Browser Launcher] Opening URL in browser...');
      // Open URL in browser
      if (command.args && command.args.length > 0) {
        const url = typeof command.args[0] === 'string' ? command.args[0] : command.args[0].url;
        const browser = command.args[0].browser || 'default';
        const incognito = command.args[0].incognito || false;
        const wait = command.args[0].wait || false;
        
        // Start the browser opening process but don't wait for it to complete
        openInBrowser(url, browser, incognito, wait).then(result => {
          console.log(`[Browser Launcher] URL opened: ${result}`);
        }).catch(error => {
          console.error(`[Browser Launcher] Error opening URL: ${error}`);
        });
        
        return {
          action: 'open',
          url,
          browser,
          incognito,
          started: true
        };
      }
    } else if (command.name === 'browser:open-file') {
      console.log('[Browser Launcher] Opening file in browser...');
      // Open file in browser
      if (command.args && command.args.length > 0) {
        const filePath = typeof command.args[0] === 'string' ? command.args[0] : command.args[0].filePath;
        const browser = command.args[0].browser || 'default';
        const incognito = command.args[0].incognito || false;
        const wait = command.args[0].wait || false;
        
        // Start the file opening process but don't wait for it to complete
        openFileInBrowser(filePath, browser, incognito, wait).then(result => {
          console.log(`[Browser Launcher] File opened: ${result}`);
        }).catch(error => {
          console.error(`[Browser Launcher] Error opening file: ${error}`);
        });
        
        return {
          action: 'openFile',
          filePath,
          browser,
          incognito,
          started: true
        };
      }
    } else if (command.name === 'browser:open-server') {
      console.log('[Browser Launcher] Opening local server in browser...');
      // Open local server in browser
      if (command.args && command.args.length > 0) {
        const port = typeof command.args[0] === 'number' ? command.args[0] : command.args[0].port;
        const path = command.args[0].path || '/';
        const hostname = command.args[0].hostname || 'localhost';
        const browser = command.args[0].browser || 'default';
        const incognito = command.args[0].incognito || false;
        const wait = command.args[0].wait || false;
        
        // Start the server opening process but don't wait for it to complete
        openLocalServer(port, path, hostname, browser, incognito, wait).then(result => {
          console.log(`[Browser Launcher] Server opened: ${result}`);
        }).catch(error => {
          console.error(`[Browser Launcher] Error opening server: ${error}`);
        });
        
        return {
          action: 'openServer',
          port,
          path,
          hostname,
          browser,
          incognito,
          started: true
        };
      }
    } else if (command.name === 'browser:check-port') {
      console.log('[Browser Launcher] Checking if port is in use...');
      // Check if port is in use
      if (command.args && command.args.length > 0) {
        const port = typeof command.args[0] === 'number' ? command.args[0] : command.args[0].port;
        
        // Start the port checking process but don't wait for it to complete
        isPortInUse(port).then(inUse => {
          console.log(`[Browser Launcher] Port ${port} in use: ${inUse}`);
        }).catch(error => {
          console.error(`[Browser Launcher] Error checking port: ${error}`);
        });
        
        return {
          action: 'checkPort',
          port,
          started: true
        };
      }
    } else if (command.name === 'browser:find-port') {
      console.log('[Browser Launcher] Finding available port...');
      // Find available port
      const startPort = command.args && command.args.length > 0 ? command.args[0].startPort : 3000;
      const endPort = command.args && command.args.length > 0 ? command.args[0].endPort : 9000;
      
      // Start the port finding process but don't wait for it to complete
      findAvailablePort(startPort, endPort).then(port => {
        console.log(`[Browser Launcher] Found available port: ${port}`);
      }).catch(error => {
        console.error(`[Browser Launcher] Error finding port: ${error}`);
      });
      
      return {
        action: 'findPort',
        startPort,
        endPort,
        started: true
      };
    }
  } catch (error) {
    console.error(`[Browser Launcher] Error processing command: ${error}`);
    return { action: 'error', error: String(error) };
  }
  
  return { action: 'unknown' };
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

