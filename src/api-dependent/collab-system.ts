import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

// Define schemas for CollabSystem tool
export const CreateSessionSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  sessionName: z.string().optional(),
  initialFiles: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })).optional(),
  apiKey: z.string().optional(),
});

export const JoinSessionSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  apiKey: z.string().optional(),
});

export const UpdateFileSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  filePath: z.string(),
  changes: z.array(z.object({
    range: z.object({
      start: z.object({
        line: z.number(),
        character: z.number(),
      }),
      end: z.object({
        line: z.number(),
        character: z.number(),
      }),
    }),
    text: z.string(),
  })),
  apiKey: z.string().optional(),
});

export const GetSessionStatusSchema = z.object({
  sessionId: z.string(),
  apiKey: z.string().optional(),
});

// Configuration for collaboration system
const defaultConfig = {
  apiKeyPath: path.join(process.cwd(), '.env.local'),
  sessionsPath: path.join(process.cwd(), '.sessions'),
};

// In-memory cache for active sessions
const activeSessions = new Map<string, any>();

/**
 * Safely loads API key from environment or configuration file
 */
async function loadApiKey(providedKey?: string): Promise<string> {
  // If API key is provided directly, use it
  if (providedKey) {
    return providedKey;
  }
  
  // Try to load from environment variable
  if (process.env.COLLAB_API_KEY) {
    return process.env.COLLAB_API_KEY;
  }
  
  // Try to load from configuration file
  try {
    const envContent = await fs.readFile(defaultConfig.apiKeyPath, 'utf8');
    const match = envContent.match(/COLLAB_API_KEY=["']?([^"'\r\n]+)["']?/);
    
    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {
    // File doesn't exist or can't be read
  }
  
  // Return a placeholder API key for development
  // In production, this should be replaced with a proper API key
  return 'collab-api-key-placeholder';
}

/**
 * Encrypts sensitive data
 */
function encryptData(data: string, secret: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts sensitive data
 */
function decryptData(encryptedData: string, secret: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const key = crypto.scryptSync(secret, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Ensures the sessions directory exists
 */
async function ensureSessionsDirectory(): Promise<void> {
  try {
    await fs.mkdir(defaultConfig.sessionsPath, { recursive: true });
  } catch (error) {
    // Directory already exists or can't be created
  }
}

/**
 * Creates a new collaboration session
 */
export async function handleCreateSession(args: any) {
  if (args && typeof args === 'object' && 'projectId' in args && 'userId' in args) {
    try {
      const { projectId, userId, sessionName, initialFiles = [] } = args;
      
      // Load API key
      const apiKey = await loadApiKey(args.apiKey);
      
      // Generate a unique session ID
      const sessionId = `session-${projectId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      
      // Create session data
      const session = {
        id: sessionId,
        projectId,
        name: sessionName || `Session for ${projectId}`,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        participants: [userId],
        files: initialFiles.map((file: { path: string; content: string }) => ({
          path: file.path,
          lastModified: new Date().toISOString(),
          lastModifiedBy: userId,
        })),
      };
      
      // Store session in memory
      activeSessions.set(sessionId, session);
      
      // Store session on disk
      await ensureSessionsDirectory();
      const sessionFilePath = path.join(defaultConfig.sessionsPath, `${sessionId}.json`);
      await fs.writeFile(sessionFilePath, JSON.stringify(session, null, 2));
      
      // Store initial files on disk
      for (const file of initialFiles) {
        const filePath = path.join(defaultConfig.sessionsPath, sessionId, file.path);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, file.content);
      }
      
      // In a real implementation, we would make an API call to create a session on the collaboration server
      // For now, we'll just return the session ID
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            sessionId,
            message: `Collaboration session created: ${sessionId}`,
            joinUrl: `https://collab.example.com/join/${sessionId}`,
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to create collaboration session.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for create_session" }],
    isError: true,
  };
}

/**
 * Joins an existing collaboration session
 */
export async function handleJoinSession(args: any) {
  if (args && typeof args === 'object' && 'sessionId' in args && 'userId' in args) {
    try {
      const { sessionId, userId } = args;
      
      // Load API key
      const apiKey = await loadApiKey(args.apiKey);
      
      // Check if session exists in memory
      let session = activeSessions.get(sessionId);
      
      // If not in memory, try to load from disk
      if (!session) {
        try {
          const sessionFilePath = path.join(defaultConfig.sessionsPath, `${sessionId}.json`);
          const sessionData = await fs.readFile(sessionFilePath, 'utf8');
          session = JSON.parse(sessionData);
          activeSessions.set(sessionId, session);
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `Session not found: ${sessionId}`,
                message: `Failed to join collaboration session.`
              }, null, 2)
            }],
            isError: true,
          };
        }
      }
      
      // Add user to participants if not already present
      if (!session.participants.includes(userId)) {
        session.participants.push(userId);
        
        // Update session on disk
        const sessionFilePath = path.join(defaultConfig.sessionsPath, `${sessionId}.json`);
        await fs.writeFile(sessionFilePath, JSON.stringify(session, null, 2));
      }
      
      // In a real implementation, we would make an API call to join a session on the collaboration server
      // For now, we'll just return the session details
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            sessionId,
            projectId: session.projectId,
            name: session.name,
            participants: session.participants,
            files: session.files,
            message: `Joined collaboration session: ${sessionId}`,
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to join collaboration session.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for join_session" }],
    isError: true,
  };
}

/**
 * Updates a file in a collaboration session
 */
export async function handleUpdateFile(args: any) {
  if (args && typeof args === 'object' && 'sessionId' in args && 'userId' in args && 'filePath' in args && 'changes' in args) {
    try {
      const { sessionId, userId, filePath, changes } = args;
      
      // Load API key
      const apiKey = await loadApiKey(args.apiKey);
      
      // Check if session exists in memory
      let session = activeSessions.get(sessionId);
      
      // If not in memory, try to load from disk
      if (!session) {
        try {
          const sessionFilePath = path.join(defaultConfig.sessionsPath, `${sessionId}.json`);
          const sessionData = await fs.readFile(sessionFilePath, 'utf8');
          session = JSON.parse(sessionData);
          activeSessions.set(sessionId, session);
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `Session not found: ${sessionId}`,
                message: `Failed to update file.`
              }, null, 2)
            }],
            isError: true,
          };
        }
      }
      
      // Check if user is a participant
      if (!session.participants.includes(userId)) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: `User ${userId} is not a participant in session ${sessionId}`,
              message: `Failed to update file.`
            }, null, 2)
          }],
          isError: true,
        };
      }
      
      // In a real implementation, we would make an API call to update the file on the collaboration server
      // For now, we'll just update the file metadata in the session
      
      // Find the file in the session
      const fileIndex = session.files.findIndex((file: any) => file.path === filePath);
      
      if (fileIndex === -1) {
        // Add the file to the session
        session.files.push({
          path: filePath,
          lastModified: new Date().toISOString(),
          lastModifiedBy: userId,
        });
      } else {
        // Update the file metadata
        session.files[fileIndex].lastModified = new Date().toISOString();
        session.files[fileIndex].lastModifiedBy = userId;
      }
      
      // Update session on disk
      const sessionFilePath = path.join(defaultConfig.sessionsPath, `${sessionId}.json`);
      await fs.writeFile(sessionFilePath, JSON.stringify(session, null, 2));
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            sessionId,
            filePath,
            changesApplied: changes.length,
            message: `File updated in collaboration session: ${filePath}`,
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to update file.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for update_file" }],
    isError: true,
  };
}

/**
 * Gets the status of a collaboration session
 */
export async function handleGetSessionStatus(args: any) {
  if (args && typeof args === 'object' && 'sessionId' in args) {
    try {
      const { sessionId } = args;
      
      // Load API key
      const apiKey = await loadApiKey(args.apiKey);
      
      // Check if session exists in memory
      let session = activeSessions.get(sessionId);
      
      // If not in memory, try to load from disk
      if (!session) {
        try {
          const sessionFilePath = path.join(defaultConfig.sessionsPath, `${sessionId}.json`);
          const sessionData = await fs.readFile(sessionFilePath, 'utf8');
          session = JSON.parse(sessionData);
          activeSessions.set(sessionId, session);
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `Session not found: ${sessionId}`,
                message: `Failed to get session status.`
              }, null, 2)
            }],
            isError: true,
          };
        }
      }
      
      // In a real implementation, we would make an API call to get the session status from the collaboration server
      // For now, we'll just return the session details
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            sessionId,
            projectId: session.projectId,
            name: session.name,
            createdAt: session.createdAt,
            createdBy: session.createdBy,
            participants: session.participants,
            files: session.files,
            message: `Retrieved status for collaboration session: ${sessionId}`,
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to get session status.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for get_session_status" }],
    isError: true,
  };
}
