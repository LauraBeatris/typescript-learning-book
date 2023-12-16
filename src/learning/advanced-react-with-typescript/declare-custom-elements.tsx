import React from 'react';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'custom-element': {
        children?: React.ReactNode;
        requiredProp: boolean;
      };
    }
  }
}

const element = (
  <custom-element requiredProp={false}>hello world</custom-element>
);
