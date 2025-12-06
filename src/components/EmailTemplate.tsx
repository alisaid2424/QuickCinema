import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from "@react-email/components";

type EmailTemplateProps = {
  fullName: string;
  amount: number;
  sub: string;
  dateTime: Date;
};

export const EmailTemplate = ({ body }: { body: EmailTemplateProps }) => {
  const date = new Date(body.dateTime).toLocaleDateString("en-US", {
    timeZone: "Africa/Cairo",
  });

  const time = new Date(body.dateTime).toLocaleTimeString("en-US", {
    timeZone: "Africa/Cairo",
  });

  return (
    <Html>
      <Head />
      <Preview>Your QuickCinema booking is confirmed!</Preview>

      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fff",
          padding: "20px",
          lineHeight: 1.6,
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Greeting */}
          <Text style={{ fontSize: "22px", fontWeight: "bold" }}>
            Hi {body.fullName},
          </Text>

          {/* Main Message */}
          <Text>
            Your booking for
            <strong style={{ color: "#F84565" }}>{body.sub}</strong> is
            confirmed.
          </Text>

          <Text>
            <strong>Payment Amount:</strong> {body.amount} EGP
          </Text>

          {/* Date & Time (Same style as your screenshot) */}
          <Section style={{ marginTop: "12px" }}>
            <Text>
              <strong>Date:</strong> {date}
            </Text>
            <Text>
              <strong>Time:</strong> {time}
            </Text>
          </Section>

          {/* Ending Message */}
          <Text style={{ marginTop: "20px" }}>Enjoy the show! 🍿</Text>

          <Text>
            Thanks for booking with us!
            <br />— QuickCinema Team
          </Text>

          <Hr style={{ borderColor: "#eee", marginTop: "25px" }} />

          <Text
            style={{
              fontSize: "13px",
              color: "#888",
              textAlign: "center",
            }}
          >
            QuickCinema — Your ultimate movie experience.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
