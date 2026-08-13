import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const contactTo = (
  process.env.CONTACT_TO ||
  process.env.SMTP_USER ||
  ""
).trim();
const fromEmail =
  process.env.RESEND_FROM?.trim() || "Portfolio <onboarding@resend.dev>";

app.get("/api/health", (_req, res) => {
  const maskedTo = contactTo
    ? contactTo.replace(/^(.{2}).*(@.*)$/, "$1***$2")
    : null;

  res.json({
    status: "ok",
    emailProvider: "resend",
    emailConfigured: Boolean(resendApiKey && contactTo),
    contactTo: maskedTo,
    from: fromEmail,
  });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (!resendApiKey || !contactTo) {
      return res.status(500).json({
        success: false,
        message:
          "Email service is not configured. Set RESEND_API_KEY and CONTACT_TO on the server.",
      });
    }

    const safeName = String(name).slice(0, 200);
    const safeEmail = String(email).slice(0, 200);
    const safeMessage = String(message).slice(0, 5000);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [contactTo],
        reply_to: safeEmail,
        subject: `Portfolio message from ${safeName}`,
        text: `Name: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #20B2A6; border-bottom: 2px solid #20B2A6; padding-bottom: 8px;">
              New Portfolio Contact
            </h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
              <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({
        success: false,
        message:
          data?.message || "Failed to send message. Please try again later.",
        errorCode: data?.name || response.status,
      });
    }

    console.log("Resend accepted email:", data?.id, "->", contactTo);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      id: data?.id || null,
    });
  } catch (error) {
    console.error("Contact API error:", error?.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      errorCode: error?.code || null,
      errorMessage: error?.message || null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API running on http://localhost:${PORT}`);
  console.log(`Resend configured: ${Boolean(resendApiKey && contactTo)}`);
});
