const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Merchant = require("../models/Merchant");

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resetTokens = new Map();

const hashToken = (value) => crypto.createHash("sha256").update(value).digest("hex");

const buildResetLink = (email) => {
  const token = crypto.randomBytes(32).toString("hex");
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:5173";
  return {
    token,
    link: `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`,
  };
};

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const reset = buildResetLink(email);
    const resetExpiryMs = 1000 * 60 * 15;
    resetTokens.set(email, {
      tokenHash: hashToken(reset.token),
      expiresAt: Date.now() + resetExpiryMs,
    });

    const transporter = createTransporter();

    if (!transporter) {
      return res.status(202).json({
        success: true,
        message: `Password reset requested for ${email}. Configure SMTP to send the email. Demo reset link: ${reset.link}`,
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Reset your Reviva password",
      text: `Use this link to reset your Reviva password: ${reset.link}\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f8fafc;">
          <h2 style="margin-bottom: 12px; color: #0f172a;">Reset your Reviva password</h2>
          <p style="margin: 0 0 18px; color: #475569; line-height: 1.6;">
            We received a request to reset the password for your Reviva merchant account.
          </p>
          <p style="margin: 0 0 18px;">
            <a href="${reset.link}" style="display: inline-block; padding: 12px 20px; background: #2563eb; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
          </p>
          <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
            If you did not request this change, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: `A password reset link has been sent to ${email}.`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Unable to send reset email right now. Please try again later.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const token = String(req.body?.token || "").trim();
    const password = String(req.body?.password || "").trim();

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "A valid email is required." });
    }

    if (!token) {
      return res.status(400).json({ message: "Reset token is missing or invalid." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const tokenEntry = resetTokens.get(email);

    if (!tokenEntry) {
      return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }

    if (Date.now() > tokenEntry.expiresAt) {
      resetTokens.delete(email);
      return res.status(400).json({ message: "This reset link has expired. Please request another one." });
    }

    if (tokenEntry.tokenHash !== hashToken(token)) {
      return res.status(400).json({ message: "This reset link is invalid." });
    }

    const merchant = await Merchant.findOne({ email });
    if (merchant) {
      merchant.password = password;
      await merchant.save();
    }

    resetTokens.delete(email);

    return res.status(200).json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Unable to reset the password right now. Please try again later.",
    });
  }
});

module.exports = router;
