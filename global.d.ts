

/**
 * Global type declarations
 */

// Define the type for the refreshResources function
type RefreshResourcesFunction = () => Promise<void>;

// Extend the global scope
declare global {
  // Add refreshResources to the global scope
  var refreshResources: RefreshResourcesFunction;
}

export {}; // This is needed to make the file a module