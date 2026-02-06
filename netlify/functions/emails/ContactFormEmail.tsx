import * as React from "react";
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

void React;

interface ContactMessageEmailProps {
  fromEmail: string;
  orderNumber?: string;
  message: string;
}

export const ContactMessageEmail = ({
  fromEmail,
  orderNumber,
  message,
}: ContactMessageEmailProps) => {
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
              fontSize: "30px",
              fontWeight: "600",
              color: "#1f2937",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            Ny melding fra kontaktskjema
          </Heading>

          <Text
            style={{
              fontSize: "17px",
              color: "#6b7280",
              margin: "0 0 36px 0",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            Du har mottatt en ny henvendelse via nettsiden.
          </Text>

          {/* Sender / Order info */}
          <Section
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.04) 100%)",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "28px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ paddingBottom: "16px", paddingLeft: "10px" }}>
                    <Text
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        fontWeight: "500",
                        margin: "0 0 6px 0",
                      }}
                    >
                      Avsender
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        color: "#1f2937",
                        fontWeight: "600",
                        margin: 0,
                        wordBreak: "break-all",
                      }}
                    >
                      {fromEmail}
                    </Text>
                  </td>
                </tr>

                {orderNumber && (
                  <tr>
                    <td style={{ paddingLeft: "10px" }}>
                      <Text
                        style={{
                          fontSize: "15px",
                          color: "#6b7280",
                          fontWeight: "500",
                          margin: "0 0 6px 0",
                        }}
                      >
                        Ordrenummer
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          color: "#1f2937",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        #{orderNumber}
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>

          {/* Message */}
          <Section
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "36px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Heading
              style={{
                fontSize: "18px",
                fontWeight: "600",
                paddingLeft: "10px",
                color: "#1f2937",
                margin: "0 0 14px 0",
              }}
            >
              Melding
            </Heading>

            <Text
              style={{
                fontSize: "15px",
                color: "#374151",
                margin: 0,
                paddingLeft: "10px",
                lineHeight: "1.8",
                whiteSpace: "pre-line",
              }}
            >
              {message}
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "24px",
              marginTop: "32px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                textAlign: "center",
                margin: 0,
              }}
            >
              Denne meldingen ble sendt via kontaktskjemaet på ltkunstsmykker.no
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
