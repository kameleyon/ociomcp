// Export all API-dependent tools from a single entry point

// ModelSwitcher tool
export {
  handleSwitchModel,
  handleGetAvailableModels,
  handleConfigureModelSwitching,
  SwitchModelSchema,
  GetAvailableModelsSchema,
  ConfigureModelSwitchingSchema
} from './model-switcher.js';

// CollabSystem tool
export {
  handleCreateSession,
  handleJoinSession,
  handleUpdateFile,
  handleGetSessionStatus,
  CreateSessionSchema,
  JoinSessionSchema,
  UpdateFileSchema,
  GetSessionStatusSchema
} from './collab-system.js';

// CodeAnalyzer tool
export {
  handleAnalyzeCode,
  handleAnalyzeProject,
  handleGetRefactoring,
  AnalyzeCodeSchema,
  AnalyzeProjectSchema,
  GetRefactoringSchema
} from './code-analyzer.js';

// DeployTool tool
export {
  handleDeployProject,
  handleGetDeploymentStatus,
  handleConfigureDeployment,
  DeployProjectSchema,
  GetDeploymentStatusSchema,
  ConfigureDeploymentSchema
} from './deploy-tool.js';

// AIConnector tool
export {
  handleGenerateText,
  handleListModels,
  handleConfigureAIConnector,
  GenerateTextSchema,
  ListModelsSchema,
  ConfigureAIConnectorSchema
} from './ai-connector.js';
