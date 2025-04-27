// Simple prompts handler to prevent Claude from disconnecting
// This implements a basic prompts/list method that returns an empty array

import { z } from "zod";

// Define a simple schema for prompts
export const PromptSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  template: z.string(),
  parameters: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    required: z.boolean().default(false),
    type: z.enum(["string", "number", "boolean", "array", "object"]).default("string"),
  })).optional(),
});

export type Prompt = z.infer<typeof PromptSchema>;

// Function to handle prompts/list
export async function handleListPrompts() {
  // Return an empty array to satisfy Claude's request
  return {
    prompts: [],
  };
}

// For future expansion, we can add functions to create and manage prompts
export class PromptsManager {
  private prompts: Map<string, Prompt> = new Map();

  // Get all prompts
  public getPrompts(): Prompt[] {
    return Array.from(this.prompts.values());
  }

  // Add a prompt
  public addPrompt(prompt: Prompt): boolean {
    if (this.prompts.has(prompt.id)) {
      return false;
    }
    this.prompts.set(prompt.id, prompt);
    return true;
  }

  // Get a prompt by ID
  public getPrompt(id: string): Prompt | undefined {
    return this.prompts.get(id);
  }

  // Delete a prompt
  public deletePrompt(id: string): boolean {
    return this.prompts.delete(id);
  }

  // Update a prompt
  public updatePrompt(id: string, prompt: Partial<Prompt>): boolean {
    const existingPrompt = this.prompts.get(id);
    if (!existingPrompt) {
      return false;
    }

    this.prompts.set(id, {
      ...existingPrompt,
      ...prompt,
    });
    return true;
  }
}

// Create an instance of the PromptsManager
export const promptsManager = new PromptsManager();
