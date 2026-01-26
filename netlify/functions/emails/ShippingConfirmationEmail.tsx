import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Img,
  Head,
} from "@react-email/components";

type OrderItem = {
  name: string;
  quantity: number;
  lineTotal: number;
};

type CustomerInfo = {
  customer_firstName: string;
  customer_lastName: string;
  customer_adress: string;
  customer_postNr: string;
  customer_place: string;
  customer_email: string;
};

interface ShippingConfirmationEmailProps {
  order_id: string;
  customer_info: CustomerInfo;
  cart: OrderItem[];
  totals: { verifiedTotal: number };
}

export const ShippingConfirmationEmail = ({
  order_id,
  customer_info,
  cart,
  totals,
}: ShippingConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
          backgroundColor: "#f0f9ff",
          margin: 0,
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "48px 40px",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Img
              src="https://eqmensiqlwtuetbdytgg.supabase.co/storage/v1/object/public/marketing_images/logo_green.png"
              alt="LT Kunstsmykker Logo"
              width="200"
              style={{
                margin: "0 auto",
                display: "block",
                maxWidth: "200px",
                height: "auto",
              }}
            />
          </Section>

          {/* Heading */}
          <Heading
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#1f2937",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            Bestillingen din er sendt ✨
          </Heading>

          <Text
            style={{
              fontSize: "18px",
              color: "#6b7280",
              margin: "0 0 32px 0",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            Hei {customer_info.customer_firstName || "Kunde"},  
            pakken din er nå sendt og på vei til deg 💌
          </Text>

          {/* Order Details */}
          <Section
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.04) 100%)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>
                    <Text
                      style={{
                        fontSize: "16px",
                        color: "#6b7280",
                        fontWeight: "500",
                        margin: 0,
                      }}
                    >
                      Ordrenummer:
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        color: "#1f2937",
                        fontWeight: "600",
                        margin: 0,
                      }}
                    >
                      #{order_id}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingTop: "12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        background:
                          "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Sendt
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Info Box */}
          <Section
            style={{
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "32px",
            }}
          >
            <Text
              style={{
                color: "#1e40af",
                fontSize: "15px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              📦 Bestillingen din er sendt fra mitt verkstedet.
            </Text>
          </Section>

          {/* Order Items */}
          <Section>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>
                    Produkt
                  </th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>
                    Antall
                  </th>
                  <th style={{ textAlign: "right", padding: "12px 8px" }}>
                    Pris
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "10px 8px" }}>{item.name}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>
                      {item.lineTotal.toFixed(2)} kr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Text
              style={{
                textAlign: "right",
                fontSize: "20px",
                fontWeight: "700",
                marginTop: "16px",
              }}
            >
              Total: {totals.verifiedTotal.toFixed(2)} kr
            </Text>
          </Section>

          {/* Address */}
          <Section
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              marginTop: "32px",
            }}
          >
            <Heading style={{ fontSize: "18px", marginBottom: "8px" }}>
              Leveringsadresse
            </Heading>
            <Text>
              {customer_info.customer_adress}
              <br />
              {customer_info.customer_postNr}{" "}
              {customer_info.customer_place}
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
              marginTop: "32px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                textAlign: "center",
              }}
            >
              Takk for at du handler hos Line Trise’s Kunstsmykker 💛  
              <br />
              Spørsmål?{" "}
              <a
                href="mailto:support@ltkunstsmykker.no"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                support@ltkunstsmykker.no
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
