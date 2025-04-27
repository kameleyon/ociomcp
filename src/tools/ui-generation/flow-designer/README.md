# Flow Designer System

A modular TypeScript system for generating multi-step flow interfaces for different frameworks.

## Architecture

The Flow Designer system is built with a modular architecture to maintain clean separation of concerns and keep file sizes under 500 lines:

- **flow-designer.ts**: Main coordinator that validates inputs and orchestrates the generation process
- **schema.ts**: Defines the Zod schema and TypeScript interfaces for flow configuration
- **utils.ts**: Common utility functions used across the system
- **react-generator-core.ts**: Core logic for generating React flows
- **step-component-generator.ts**: Generates individual step components
- **navigation-component-generator.ts**: Generates breadcrumbs, progress indicators, and navigation controls
- **context-generator.ts**: Generates state management code (Context API, Redux, etc.)
- **style-generator.ts**: Generates CSS/SCSS/styled-components styles
- **validation-generator.ts**: Generates form validation logic

## Usage

```typescript
import { createFlowDesigner } from './flow-designer';

// Define your flow
const flowOptions = {
  name: 'Checkout',
  framework: 'react',
  flowType: 'wizard',
  steps: [
    {
      id: 'customer-info',
      title: 'Customer Information',
      isInitial: true,
      validationRules: [
        {
          field: 'email',
          rule: 'email',
          message: 'Please enter a valid email address'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping Details'
    },
    {
      id: 'payment',
      title: 'Payment',
      isFinal: true
    }
  ],
  styling: 'styled-components',
  typescript: true,
  responsive: true,
  stateManagement: 'context',
  features: ['breadcrumbs', 'progress-indicator', 'validation', 'back-button']
};

// Generate the flow
const result = await createFlowDesigner(flowOptions, './src/components');
```

## Supported Frameworks

- React (fully supported)
- Vue (planned)
- Angular (planned)
- Svelte (planned)
- Solid (planned)

## Features

- Multi-step forms and wizards
- Conditional step navigation
- Form validation
- Progress indicators
- Breadcrumb navigation
- Summary view
- State persistence
- Animations
- Responsive design
- TypeScript support
- Multiple styling options (CSS, SCSS, styled-components, etc.)

## Extending

To add support for a new framework, create a new generator module similar to react-generator-core.ts and update the flow-designer.ts file to use it based on the framework option.