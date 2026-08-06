import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

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

const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "");

// Prefer 587 STARTTLS — port 465 is often blocked on cloud hosts
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
  });
}

app.get("/api/health", async (_req, res) => {
  const info = {
    status: "ok",
    smtpConfigured: Boolean(smtpUser && smtpPass),
  };

  if (smtpUser && smtpPass) {
    try {
      await createTransporter().verify();
      info.smtpVerify = "ok";
    } catch (error) {
      info.smtpVerify = "fail";
      info.smtpErrorCode = error?.code || null;
      info.smtpErrorMessage = error?.message || String(error);
    }
  }

  res.json(info);
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

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        success: false,
        message: "Email service is not configured on the server.",
      });
    }

    const toEmail = (process.env.CONTACT_TO || smtpUser).trim();
    const safeName = String(name).slice(0, 200);
    const safeEmail = String(email).slice(0, 200);
    const safeMessage = String(message).slice(0, 5000);

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: toEmail,
      replyTo: safeEmail,
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
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("Nodemailer error:", error?.message || error);
    console.error("Nodemailer code:", error?.code);
    console.error("Nodemailer response:", error?.response);
    console.error("Nodemailer command:", error?.command);

    const isAuthError =
      error?.code === "EAUTH" ||
      /invalid login|username and password|credentials/i.test(
        String(error?.message || "")
      );

    return res.status(500).json({
      success: false,
      message: isAuthError
        ? "Email login failed. Check SMTP_USER and Gmail App Password on Render."
        : "Failed to send message. Please try again later.",
      // Safe diagnostics (no secrets) so we can see why Render fails
      errorCode: error?.code || null,
      errorMessage: error?.message || null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API running on http://localhost:${PORT}`);
  console.log(`SMTP configured: ${Boolean(smtpUser && smtpPass)}`);
});
