// Auto-generated safe fallback for checkout-flow

export function activate() {
    console.log("[TOOL] checkout-flow activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Checkout Flow Example
 * 
 * Demonstrates how to use the Flow Designer system to create a checkout flow
 */

import { createFlowDesigner, FlowOptions } from '../index';

// Define checkout flow options
const checkoutFlow: FlowOptions = {
  name: 'Checkout',
  framework: 'react',
  flowType: 'checkout',
  steps: [
    {
      id: 'customer-info',
      title: 'Customer Information',
      description: 'Please provide your contact information',
      isInitial: true,
      validationRules: [
        {
          field: 'email',
          rule: 'email',
          message: 'Please enter a valid email address'
        },
        {
          field: 'name',
          rule: 'required',
          message: 'Name is required'
        },
        {
          field: 'phone',
          rule: 'phone',
          message: 'Please enter a valid phone number'
        }
      ],
      nextSteps: [
        {
          stepId: 'shipping'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping Information',
      description: 'Where should we ship your order?',
      validationRules: [
        {
          field: 'address',
          rule: 'required',
          message: 'Address is required'
        },
        {
          field: 'city',
          rule: 'required',
          message: 'City is required'
        },
        {
          field: 'zipCode',
          rule: 'required',
          message: 'ZIP code is required'
        }
      ],
      nextSteps: [
        {
          stepId: 'shipping-method'
        }
      ]
    },
    {
      id: 'shipping-method',
      title: 'Shipping Method',
      description: 'Choose your preferred shipping method',
      validationRules: [
        {
          field: 'shippingMethod',
          rule: 'required',
          message: 'Please select a shipping method'
        }
      ],
      nextSteps: [
        {
          stepId: 'payment'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Enter your payment details',
      validationRules: [
        {
          field: 'cardNumber',
          rule: 'required',
          message: 'Card number is required'
        },
        {
          field: 'cardExpiry',
          rule: 'required',
          message: 'Expiry date is required'
        },
        {
          field: 'cardCvc',
          rule: 'required',
          message: 'CVC is required'
        }
      ],
      nextSteps: [
        {
          stepId: 'review'
        }
      ]
    },
    {
      id: 'review',
      title: 'Review Order',
      description: 'Please review your order details before submitting',
      isFinal: true
    }
  ],
  styling: 'styled-components',
  typescript: true,
  responsive: true,
  stateManagement: 'context',
  features: [
    'breadcrumbs',
    'progress-indicator',
    'validation',
    'persistence',
    'back-button',
    'summary-view'
  ],
  theme: {
    primaryColor: '#4C9AFF',
    secondaryColor: '#0747A6',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    borderRadius: '4px',
    spacing: '1.5rem'
  },
  outputDir: './src/components/checkout'
};

/**
 * Generate checkout flow
 */
async function generateCheckoutFlow(): Promise<void> {
  try {
    const result = await createFlowDesigner(checkoutFlow);
    
    if (result.success) {
      console.log('Checkout flow generated successfully!');
      console.log('Generated files:');
      result.files?.forEach(file => console.log(`- ${file}`));
    } else {
      console.error('Failed to generate checkout flow:', result.message);
    }
  } catch (error) {
    console.error('Error generating checkout flow:', error);
  }
}

// Execute when called directly
if (require.main === module) {
  generateCheckoutFlow();
}

export default checkoutFlow;
