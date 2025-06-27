// import { useEffect, useRef } from "react";
import React from 'react'

// declare global {
//   interface Window {
//     VippsCheckoutDirect?: (opts: {
//       checkoutFrontendUrl: string;
//       token: string;
//       language?: string;
//     }) => void;
//   }
// }

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'vipps-mobilepay-button': React.DetailedHTMLProps<VippsMobilePayButtonProps, HTMLElement>
    }
  }
}

interface VippsMobilePayButtonProps extends React.HTMLAttributes<HTMLElement> {
  brand?: string;
  language?: string;
  variant?: string;
  rounded?: string;
  verb?: string;
  stretched?: string;
  branded?: string;
  'data-checkout-url'?: string;
}

export default function VippsButton() {
  // const btnRef = useRef<HTMLElement>(null);

  // useEffect(() => {
  //   const btn = btnRef.current;
  //   if (!btn) return;

  //   const handleClick = () => {
  //     fetch("/api/create-vipps-session", { method: "POST" })
  //       .then((r) => r.json())
  //       .then((data) => {
  //         window.VippsCheckoutDirect!({
  //           checkoutFrontendUrl: data.checkoutFrontendUrl,
  //           token: data.token,
  //           language: "no",
  //         });
  //       })
  //       .catch(console.error);
  //   };

  //   btn.addEventListener("click", handleClick);
  //   return () => btn.removeEventListener("click", handleClick);
  // }, []);

  return (
    <vipps-mobilepay-button brand="vipps" language="no" variant="primary" rounded="false" verb="pay" stretched="true" branded="true"/>
  );
}
