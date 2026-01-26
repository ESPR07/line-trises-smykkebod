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

interface OrderConfirmationEmailProps {
  order_id: string;
  customer_info: CustomerInfo;
  cart: OrderItem[];
  totals: { verifiedTotal: number };
}

export const OrderConfirmationEmail = ({
  order_id,
  customer_info,
  cart,
  totals,
}: OrderConfirmationEmailProps) => {
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

          {/* Success Message */}
          <Heading
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#1f2937",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            Takk for ditt kjøp!
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
            Hei {customer_info.customer_firstName || "Kunde"}, din bestilling er
            mottatt og bekreftet.
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                      paddingBottom: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              textAlign: "left",
                              verticalAlign: "top",
                              paddingBottom: "8px",
                            }}
                          >
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
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ textAlign: "left", verticalAlign: "top" }}
                          >
                            <Text
                              style={{
                                fontSize: "16px",
                                color: "#1f2937",
                                fontWeight: "600",
                                margin: 0,
                                wordBreak: "break-all",
                              }}
                            >
                              #{order_id}
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ padding: "8px 0", verticalAlign: "top" }}
                    colSpan={2}
                  >
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: "8px" }}>
                            <Text
                              style={{
                                fontSize: "16px",
                                color: "#6b7280",
                                fontWeight: "500",
                                margin: 0,
                              }}
                            >
                              Status:
                            </Text>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "6px 14px",
                                background:
                                  "linear-gradient(135deg, #10b981, #059669)",
                                color: "white",
                                borderRadius: "20px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              Bekreftet
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Info Box */}
          <Section
            style={{
              display: "flex",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "32px",
            }}
          >
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "30px", verticalAlign: "top" }}>
                    <Text style={{ fontSize: "24px", margin: 0 }}>📧</Text>
                  </td>
                  <td>
                    <Text
                      style={{
                        color: "#1e40af",
                        fontSize: "15px",
                        margin: 0,
                        lineHeight: "1.6",
                      }}
                    >
                      En ordrebekreftelse er sendt til din e-post. Du vil motta
                      en ny melding når bestillingen din er sendt.
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Order Items */}
          <Section style={{ marginBottom: "24px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "2px solid #e5e7eb",
                      padding: "12px 8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#6b7280",
                    }}
                  >
                    Produkt
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderBottom: "2px solid #e5e7eb",
                      padding: "12px 8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#6b7280",
                    }}
                  >
                    Antall
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      borderBottom: "2px solid #e5e7eb",
                      padding: "12px 8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#6b7280",
                    }}
                  >
                    Pris
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f3f4f6",
                        color: "#1f2937",
                        fontSize: "15px",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "12px 8px",
                        borderBottom: "1px solid #f3f4f6",
                        color: "#1f2937",
                        fontSize: "15px",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        padding: "12px 8px",
                        borderBottom: "1px solid #f3f4f6",
                        color: "#1f2937",
                        fontSize: "15px",
                      }}
                    >
                      {item.lineTotal.toFixed(2)} kr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table style={{ width: "100%", marginTop: "16px" }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: "right" }}>
                    <Text
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#1f2937",
                        margin: 0,
                      }}
                    >
                      Total: {totals.verifiedTotal.toFixed(2)} kr
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Shipping Address */}
          <Section
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "32px",
            }}
          >
            <Heading
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                margin: "0 0 12px 0",
              }}
            >
              Leveringsadresse
            </Heading>
            <Text
              style={{
                fontSize: "15px",
                color: "#4b5563",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              {customer_info.customer_adress}
              <br />
              {customer_info.customer_postNr} {customer_info.customer_place}
            </Text>
          </Section>

          {/* Next Steps */}
          <Section style={{ marginBottom: "32px" }}>
            <Heading
              style={{
                fontSize: "24px",
                color: "#1f2937",
                margin: "0 0 20px 0",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Hva skjer nå?
            </Heading>

            {/* Step 1 */}
            <table style={{ width: "100%", marginBottom: "16px" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "50px",
                      verticalAlign: "top",
                      paddingRight: "16px",
                    }}
                  >
                    <table
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              color: "white",
                              fontWeight: "700",
                              fontSize: "18px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            1
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style={{ verticalAlign: "top", paddingTop: "2px" }}>
                    <Text
                      style={{
                        fontSize: "17px",
                        color: "#1f2937",
                        fontWeight: "600",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Pakking
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      Jeg pakker din bestilling med omhu
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Step 2 */}
            <table style={{ width: "100%", marginBottom: "16px" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "50px",
                      verticalAlign: "top",
                      paddingRight: "16px",
                    }}
                  >
                    <table
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              color: "white",
                              fontWeight: "700",
                              fontSize: "18px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            2
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style={{ verticalAlign: "top", paddingTop: "2px" }}>
                    <Text
                      style={{
                        fontSize: "17px",
                        color: "#1f2937",
                        fontWeight: "600",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Forsendelse
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      Du mottar pakkenummer på e-post
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Step 3 */}
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "50px",
                      verticalAlign: "top",
                      paddingRight: "16px",
                    }}
                  >
                    <table
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              color: "white",
                              fontWeight: "700",
                              fontSize: "18px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            3
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style={{ verticalAlign: "top", paddingTop: "2px" }}>
                    <Text
                      style={{
                        fontSize: "17px",
                        color: "#1f2937",
                        fontWeight: "600",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Levering
                    </Text>
                    <Text
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      Pakken leveres på din adresse
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Footer */}
          <Section
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
              marginTop: "20px",
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
              Spørsmål? Kontakt meg på{" "}
              <a
                href="mailto:support@ltkunstsmykker.no"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                }}
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
