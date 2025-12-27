import{ useRef } from "react";

export default function VippsButton() {
  const btnRef = useRef<HTMLElement>(null);

  // useEffect(() => {
  //   const btn = btnRef.current;
  //   if (!btn) return;

  //   const handleClick = () => {
  //     fetch("/api/create-vipps-session", { method: "POST" })
  //       .then((r) => r.json())
  //       .then((data: { checkoutFrontendUrl: string; token: string }) => {
  //         if (!window.VippsCheckoutDirect) return;
  //         window.VippsCheckoutDirect({
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
    <vipps-mobilepay-button
      ref={btnRef}
      brand="vipps"
      language="no"
      variant="primary"
      rounded="false"
      verb="pay"
      stretched="true"
      branded="true"
    />
  );
}
