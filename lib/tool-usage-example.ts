import { isToolEnabled, getToolSettings, applyToolConfig } from './tools-config';

/**
 * Example of using the tools configuration system
 */

// Basic example of checking if a tool is enabled
function exampleUsingToneAdjuster() {
  // Check if the ToneAdjuster tool is enabled
  if (isToolEnabled('ToneAdjuster')) {
    // Get the tool's settings
    const toneSettings = getToolSettings('ToneAdjuster');
    
    console.log('ToneAdjuster is enabled with settings:', toneSettings);
    
    // Example of using the settings with a hypothetical ToneAdjuster implementation
    const adjuster = {
      tone: 'default',
      strength: 0.3,
      apply: (content: string) => {
        console.log(`Adjusting tone of content with tone=${adjuster.tone} and strength=${adjuster.strength}`);
        return content; // In real implementation, this would transform the content
      }
    };
    
    // Apply the configuration to the adjuster
    const configuredAdjuster = applyToolConfig('ToneAdjuster', adjuster);
    
    // Use the configured adjuster
    const result = configuredAdjuster.apply('Some example content to adjust');
    return result;
  } else {
    console.log('ToneAdjuster is disabled');
    return null;
  }
}

// Example for multiple tools
function initializeConfiguredTools() {
  const tools = {
    formatter: isToolEnabled('CodeFormatter') ? 
      applyToolConfig('CodeFormatter', { format: (code: string) => code }) : null,
    
    responsiveUI: isToolEnabled('ResponsiveUI') ? 
      applyToolConfig('ResponsiveUI', { createComponent: (name: string) => `<div>${name}</div>` }) : null,
    
    iconManager: isToolEnabled('IconManager') ? 
      applyToolConfig('IconManager', { getIcon: (name: string) => `<Icon name="${name}" />` }) : null
  };
  
  console.log('Initialized tools with configuration:', tools);
  return tools;
}

// Export examples
export const examples = {
  toneAdjuster: exampleUsingToneAdjuster,
  initializeTools: initializeConfiguredTools
};