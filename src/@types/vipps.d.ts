// src/@types/vipps.d.ts
import * as React from "react";

// Props for your custom element
export interface VippsMobilePayButtonProps extends React.HTMLAttributes<HTMLElement> {
  brand?: string;
  language?: string;
  variant?: string;
  rounded?: string;
  verb?: string;
  stretched?: string;
  branded?: string;
  "data-checkout-url"?: string;
}

// Module augmentation for React
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "vipps-mobilepay-button": React.DetailedHTMLProps<VippsMobilePayButtonProps, HTMLElement>;
    }
  }
}
