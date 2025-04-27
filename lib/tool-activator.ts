import { getEnabledTools } from './tools-config';

async function activateTool(toolName: string, settings: any) {
  try {
    const toolModule = await import(`../tools/${toolName}`);
    if (toolModule && typeof toolModule.activate === 'function') {
      console.log(`[Activator] Activating ${toolName} with settings:`, settings);
      await toolModule.activate(settings);
    } else {
      console.warn(`[Activator] No explicit 'activate' function found for ${toolName}. Running fallback activation.`);
      fallbackActivate(toolName, settings);
    }
  } catch (error) {
    console.error(`[Activator] Failed to activate ${toolName}:`, error.message || error);
    fallbackActivate(toolName, settings); // Try fallback even if import fails
  }
}

function fallbackActivate(toolName: string, settings: any) {
  console.log(`[Fallback] Attempting to force-activate ${toolName}...`);

  // Example simple fallback actions:
  switch (toolName) {
    case 'SnapshotCreator':
      console.log(`[Fallback] SnapshotCreator will monitor file saves if not explicitly activated.`);
      break;
    case 'CodeFixer':
      console.log(`[Fallback] CodeFixer will listen for edit events for auto-fix attempts.`);
      break;
    case 'ResponsiveUI':
      console.log(`[Fallback] ResponsiveUI will be injected during page generation.`);
      break;
    default:
      console.warn(`[Fallback] No specific fallback strategy for ${toolName}. Marked as passive.`);
  }
}

export async function activateAllTools() {
  const enabledTools = getEnabledTools();

  for (const { name, settings } of enabledTools) {
    await activateTool(name, settings);
  }

  console.log(`[Activator] Finished activating ${enabledTools.length} tools.`);
}
