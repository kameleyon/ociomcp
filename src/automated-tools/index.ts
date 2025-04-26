// Export all automated tools from a single entry point

// AutoContinue tool
export { 
  handleTrackContextSize,
  handleTriggerContinuation,
  TrackContextSizeSchema,
  TriggerContinuationSchema
} from './auto-continue.js';

// ChatInitiator tool
export {
  handleInitiateChat,
  handleRestoreSession,
  handleListSessions,
  InitiateChatSchema,
  RestoreSessionSchema,
  ListSessionsSchema
} from './chat-initiator.js';

// ToneAdjuster tool
export {
  handleAdjustTone,
  handleGetTonePreferences,
  handleSetTonePreferences,
  AdjustToneSchema,
  GetTonePreferencesSchema,
  SetTonePreferencesSchema
} from './tone-adjuster.js';

// PathEnforcer tool
export {
  handleValidatePath,
  handleGetProjectDirectory,
  handleSetProjectDirectory,
  ensurePathWithinProject,
  ensureDirectoryExists,
  ValidatePathSchema,
  GetProjectDirectorySchema,
  SetProjectDirectorySchema
} from './path-enforcer.js';

// CodeSplitter tool
export {
  handleAnalyzeFile,
  handleSplitFile,
  handleAnalyzeProject,
  AnalyzeFileSchema,
  SplitFileSchema,
  AnalyzeProjectSchema
} from './code-splitter.js';

// CodeFixer tool
export {
  handleFixCode,
  handleAnalyzeCode,
  handleFixProject,
  FixCodeSchema,
  AnalyzeCodeSchema,
  FixProjectSchema
} from './code-fixer.js';

// PlanCreator tool
export {
  handleCreatePlan,
  handleVisualizePlan,
  handleUpdatePlan,
  CreatePlanSchema,
  VisualizePlanSchema,
  UpdatePlanSchema
} from './plan-creator.js';
