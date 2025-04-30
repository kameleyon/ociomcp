// Auto-generated safe fallback for tone-adjuster

export function activate() {
  console.log("[TOOL] tone-adjuster activated (active mode)");
  setDefaultTone();
}

export function onFileWrite() {
  console.log("[tone-adjuster] Adjusting tone on file write (default: casual + witty + technical)...");
  setDefaultTone();
}

export function onSessionStart() {
  console.log("[tone-adjuster] Session started — applying default tone settings...");
  setDefaultTone();
}

export function onCommand(command: { name: string; args: any[] }) {
  if (command.name === 'tone-adjuster:set-tone') {
      console.log("[tone-adjuster] Updating tone settings via command...");
      handleSetTonePreferences(command.args?.[0] || {});
  } else {
      console.log("[tone-adjuster] Command received, applying default tone...");
      setDefaultTone();
  }
}

function setDefaultTone() {
tonePreferences.defaultContext = 'technical';
tonePreferences.defaultFormality = 'informal';
tonePreferences.useSlang = true;
tonePreferences.useTechnicalTerms = true;
tonePreferences.useEmojis = false;
}


import { z } from 'zod';

// Define schemas for ToneAdjuster tool
export const AdjustToneSchema = z.object({
  message: z.string(),
  context: z.enum(['casual', 'witty', 'professional', 'technical', 'documentation', 'urban']).default('casual'),
  formality: z.enum(['very-formal', 'formal', 'neutral', 'informal', 'very-informal']).default('neutral'),
});

export const GetTonePreferencesSchema = z.object({});

export const SetTonePreferencesSchema = z.object({
  defaultContext: z.enum(['casual', 'witty', 'professional', 'technical', 'documentation', 'urban']).optional(),
  defaultFormality: z.enum(['very-formal', 'formal', 'neutral', 'informal', 'very-informal']).optional(),
  useEmojis: z.boolean().optional(),
  useSlang: z.boolean().optional(),
  useTechnicalTerms: z.boolean().optional(),
});

// Store for tone preferences
const tonePreferences = {
  defaultContext: 'casual',
  defaultFormality: 'neutral',
  useEmojis: false, // No emojis as per project requirements
  useSlang: true,
  useTechnicalTerms: true,
};

// Tone patterns for different contexts
const tonePatterns = {
  casual: {
    greetings: ['Hey there', 'Hi', 'Hello'],
    transitions: ['So', 'Now', 'Alright'],
    affirmations: ['Great', 'Awesome', 'Nice'],
    closings: ['Cheers', 'Talk soon', 'Until next time'],
  },
  professional: {
    greetings: ['Hello', 'Good day', 'Greetings'],
    transitions: ['Moving forward', 'Next', 'To proceed'],
    affirmations: ['Excellent', 'Well done', 'Commendable'],
    closings: ['Regards', 'Best regards', 'Sincerely'],
  },
  technical: {
    greetings: ['Hello', 'Greetings', 'Welcome'],
    transitions: ['Subsequently', 'Furthermore', 'Additionally'],
    affirmations: ['Confirmed', 'Verified', 'Validated'],
    closings: ['End of communication', 'Session terminated', 'Disconnecting'],
  },
  documentation: {
    greetings: ['Introduction', 'Overview', 'Preface'],
    transitions: ['Next section', 'Following', 'Subsequently'],
    affirmations: ['Correct', 'Accurate', 'Precise'],
    closings: ['Conclusion', 'Summary', 'Final notes'],
  },
  urban: {
    greetings: ['What\'s up', 'Hey', 'Yo'],
    transitions: ['Anyway', 'So check this out', 'Moving on'],
    affirmations: ['Dope', 'Solid', 'That\'s fire'],
    closings: ['Later', 'Peace out', 'Catch you later'],
  },
};

// Formality modifiers
const formalityModifiers = {
  'very-formal': {
    wordChoice: (word: string) => {
      const replacements: Record<string, string> = {
        'get': 'obtain',
        'use': 'utilize',
        'make': 'construct',
        'think': 'consider',
        'fix': 'resolve',
        'start': 'initiate',
        'end': 'terminate',
        'help': 'assist',
        'show': 'demonstrate',
        'look': 'examine',
      };
      return replacements[word.toLowerCase()] || word;
    },
    sentenceStructure: (sentence: string) => {
      // Add more formal sentence structures
      return sentence
        .replace(/I will/g, 'I shall')
        .replace(/We will/g, 'We shall')
        .replace(/can't/g, 'cannot')
        .replace(/won't/g, 'will not')
        .replace(/don't/g, 'do not');
    },
  },
  'formal': {
    wordChoice: (word: string) => {
      const replacements: Record<string, string> = {
        'get': 'acquire',
        'use': 'employ',
        'make': 'create',
        'think': 'believe',
        'fix': 'correct',
        'start': 'begin',
        'end': 'conclude',
        'help': 'support',
        'show': 'present',
        'look': 'observe',
      };
      return replacements[word.toLowerCase()] || word;
    },
    sentenceStructure: (sentence: string) => {
      // Add more formal sentence structures
      return sentence
        .replace(/I'm/g, 'I am')
        .replace(/You're/g, 'You are')
        .replace(/We're/g, 'We are')
        .replace(/They're/g, 'They are');
    },
  },
  'neutral': {
    wordChoice: (word: string) => word,
    sentenceStructure: (sentence: string) => sentence,
  },
  'informal': {
    wordChoice: (word: string) => {
      const replacements: Record<string, string> = {
        'obtain': 'get',
        'utilize': 'use',
        'construct': 'make',
        'consider': 'think about',
        'resolve': 'fix',
        'initiate': 'start',
        'terminate': 'end',
        'assist': 'help',
        'demonstrate': 'show',
        'examine': 'look at',
      };
      return replacements[word.toLowerCase()] || word;
    },
    sentenceStructure: (sentence: string) => {
      // Add more informal sentence structures
      return sentence
        .replace(/I am/g, 'I\'m')
        .replace(/You are/g, 'You\'re')
        .replace(/We are/g, 'We\'re')
        .replace(/They are/g, 'They\'re');
    },
  },
  'very-informal': {
    wordChoice: (word: string) => {
      const replacements: Record<string, string> = {
        'obtain': 'grab',
        'utilize': 'use',
        'construct': 'put together',
        'consider': 'think about',
        'resolve': 'fix up',
        'initiate': 'kick off',
        'terminate': 'wrap up',
        'assist': 'give a hand',
        'demonstrate': 'show off',
        'examine': 'check out',
      };
      return replacements[word.toLowerCase()] || word;
    },
    sentenceStructure: (sentence: string) => {
      // Add more very informal sentence structures
      return sentence
        .replace(/I am/g, 'I\'m')
        .replace(/You are/g, 'You\'re')
        .replace(/We are/g, 'We\'re')
        .replace(/They are/g, 'They\'re')
        .replace(/going to/g, 'gonna')
        .replace(/want to/g, 'wanna')
        .replace(/got to/g, 'gotta');
    },
  },
};

/**
 * Adjusts the tone of a message based on the specified context and formality
 */
export async function handleAdjustTone(args: any) {
  if (args && typeof args === 'object' && 'message' in args && typeof args.message === 'string') {
    const { message, context = tonePreferences.defaultContext, formality = tonePreferences.defaultFormality } = args;
    
    // Adjust the tone of the message
    const adjustedMessage = adjustMessageTone(message, context, formality);
    
    return {
      content: [{
        type: "text",
        text: adjustedMessage
      }],
    };
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for adjust_tone" }],
    isError: true,
  };
}

/**
 * Gets the current tone preferences
 */
export async function handleGetTonePreferences() {
  return {
    content: [{
      type: "text",
      text: JSON.stringify(tonePreferences, null, 2)
    }],
  };
}

/**
 * Sets the tone preferences
 */
export async function handleSetTonePreferences(args: any) {
  if (args && typeof args === 'object') {
    // Update the tone preferences
    if ('defaultContext' in args && typeof args.defaultContext === 'string') {
      tonePreferences.defaultContext = args.defaultContext;
    }
    
    if ('defaultFormality' in args && typeof args.defaultFormality === 'string') {
      tonePreferences.defaultFormality = args.defaultFormality;
    }
    
    if ('useEmojis' in args && typeof args.useEmojis === 'boolean') {
      // Always set to false as per project requirements
      tonePreferences.useEmojis = false;
    }
    
    if ('useSlang' in args && typeof args.useSlang === 'boolean') {
      tonePreferences.useSlang = args.useSlang;
    }
    
    if ('useTechnicalTerms' in args && typeof args.useTechnicalTerms === 'boolean') {
      tonePreferences.useTechnicalTerms = args.useTechnicalTerms;
    }
    
    return {
      content: [{
        type: "text",
        text: `Tone preferences updated:\n${JSON.stringify(tonePreferences, null, 2)}`
      }],
    };
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for set_tone_preferences" }],
    isError: true,
  };
}

/**
 * Adjusts the tone of a message based on the specified context and formality
 */
function adjustMessageTone(message: string, context: string, formality: string): string {
  // Get the tone patterns for the specified context
  const patterns = tonePatterns[context as keyof typeof tonePatterns] || tonePatterns.casual;
  
  // Get the formality modifiers for the specified formality
  const modifiers = formalityModifiers[formality as keyof typeof formalityModifiers] || formalityModifiers.neutral;
  
  // Split the message into sentences
  const sentences = message.split(/(?<=[.!?])\s+/);
  
  // Adjust each sentence
  const adjustedSentences = sentences.map((sentence, index) => {
    // Apply formality modifiers to the sentence
    let adjustedSentence = modifiers.sentenceStructure(sentence);
    
    // Replace common words with their formality-adjusted equivalents
    const words = adjustedSentence.split(/\s+/);
    const adjustedWords = words.map(word => modifiers.wordChoice(word));
    adjustedSentence = adjustedWords.join(' ');
    
    // If this is the first sentence, consider replacing the greeting
    if (index === 0 && isGreeting(sentence)) {
      const randomGreeting = getRandomElement(patterns.greetings);
      adjustedSentence = adjustedSentence.replace(/^(Hi|Hello|Hey|Greetings)/, randomGreeting);
    }
    
    // If this is a transition sentence, consider replacing the transition word
    if (isTransition(sentence)) {
      const randomTransition = getRandomElement(patterns.transitions);
      adjustedSentence = adjustedSentence.replace(/^(So|Now|Next|Then|Therefore|Thus|Hence)/, randomTransition);
    }
    
    // If this is an affirmation sentence, consider replacing the affirmation
    if (isAffirmation(sentence)) {
      const randomAffirmation = getRandomElement(patterns.affirmations);
      adjustedSentence = adjustedSentence.replace(/^(Great|Good|Nice|Excellent|Perfect|Awesome)/, randomAffirmation);
    }
    
    // If this is the last sentence, consider replacing the closing
    if (index === sentences.length - 1 && isClosing(sentence)) {
      const randomClosing = getRandomElement(patterns.closings);
      adjustedSentence = adjustedSentence.replace(/(Regards|Sincerely|Thanks|Thank you|Cheers|Bye)$/, randomClosing);
    }
    
    return adjustedSentence;
  });
  
  // Join the adjusted sentences back together
  return adjustedSentences.join(' ');
}

/**
 * Checks if a sentence is a greeting
 */
function isGreeting(sentence: string): boolean {
  const greetingPatterns = [
    /^Hi\b/i,
    /^Hello\b/i,
    /^Hey\b/i,
    /^Greetings\b/i,
    /^Good (morning|afternoon|evening)\b/i,
    /^Welcome\b/i,
  ];
  
  return greetingPatterns.some(pattern => pattern.test(sentence));
}

/**
 * Checks if a sentence is a transition
 */
function isTransition(sentence: string): boolean {
  const transitionPatterns = [
    /^So\b/i,
    /^Now\b/i,
    /^Next\b/i,
    /^Then\b/i,
    /^Therefore\b/i,
    /^Thus\b/i,
    /^Hence\b/i,
    /^Moving (on|forward)\b/i,
    /^Furthermore\b/i,
    /^Additionally\b/i,
  ];
  
  return transitionPatterns.some(pattern => pattern.test(sentence));
}

/**
 * Checks if a sentence is an affirmation
 */
function isAffirmation(sentence: string): boolean {
  const affirmationPatterns = [
    /^Great\b/i,
    /^Good\b/i,
    /^Nice\b/i,
    /^Excellent\b/i,
    /^Perfect\b/i,
    /^Awesome\b/i,
    /^Well done\b/i,
    /^Congratulations\b/i,
  ];
  
  return affirmationPatterns.some(pattern => pattern.test(sentence));
}

/**
 * Checks if a sentence is a closing
 */
function isClosing(sentence: string): boolean {
  const closingPatterns = [
    /Regards$/i,
    /Sincerely$/i,
    /Thanks$/i,
    /Thank you$/i,
    /Cheers$/i,
    /Bye$/i,
    /Goodbye$/i,
    /See you$/i,
    /Talk (to you )?soon$/i,
  ];
  
  return closingPatterns.some(pattern => pattern.test(sentence));
}

/**
 * Gets a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

