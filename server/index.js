import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
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

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Missing SMTP credentials");
      return res.status(500).json({
        success: false,
        message: "Email service is not configured.",
      });
    }

    const toEmail = process.env.CONTACT_TO || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #20B2A6; border-bottom: 2px solid #20B2A6; padding-bottom: 8px;">
            New Portfolio Contact
          </h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("Nodemailer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API running on http://localhost:${PORT}`);
});
