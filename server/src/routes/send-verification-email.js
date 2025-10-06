import express from "express";
import admin from "firebase-admin";
import nodemailer from "nodemailer";

const router = express.Router();

// Example: Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // your Gmail
    pass: process.env.SMTP_PASS, // App password if 2FA is on
  },
});

router.post("/send-verification-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Generate verification link using Firebase Admin
    const link = await admin.auth().generateEmailVerificationLink(email, {
      url: "http://localhost:8080/profile", // redirect after verification
      handleCodeInApp: true,
    });

    // Send email via Nodemailer
    await transporter.sendMail({
      from: `"DermX AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email for DermX AI",
      html: `
        <div style="
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 40px 0;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            overflow: hidden;
          ">
            <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
              <h1 style="
                color: white;
                font-size: 28px;
                margin: 0;
              ">Welcome to DermX AI 🎉</h1>
            </div>
    
            <div style="padding: 30px; text-align: center;">
              <p style="font-size: 16px; color: #555;">Hi there,</p>
              <p style="font-size: 16px; color: #555; line-height: 1.5;">
                Thank you for signing up! Please verify your email address to start using your account.
              </p>
    
              <a href="${link}" style="
                display: inline-block;
                margin: 20px 0;
                padding: 15px 35px;
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
                background-color: #4CAF50;
                border-radius: 8px;
                text-decoration: none;
                transition: background-color 0.3s ease;
              " onmouseover="this.style.backgroundColor='#45a049'">
                Verify Email
              </a>
    
              <p style="font-size: 14px; color: #999; margin-top: 30px;">
                If you did not create an account, please ignore this email.
              </p>
            </div>
    
            <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              DermX AI, 2025<br>
              All rights reserved.
            </div>
          </div>
        </div>
      `,
    });
    

    res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error("Error sending verification email:", err);
    res.status(500).json({ error: "Failed to send verification email" });
  }
});

router.post("/send-reset-password-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Generate password reset link using Firebase Admin
    const link = await admin.auth().generatePasswordResetLink(email, {
      url: "http://localhost:8080/login", // redirect after password reset
      handleCodeInApp: true,
    });

    // Send email via Nodemailer
    await transporter.sendMail({
      from: `"DermX AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password for DermX AI",
      html: `
        <div style="
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 40px 0;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            overflow: hidden;
          ">
            <div style="background-color: #FF6B35; padding: 20px; text-align: center;">
              <h1 style="
                color: white;
                font-size: 28px;
                margin: 0;
              ">Password Reset Request 🔐</h1>
            </div>
    
            <div style="padding: 30px; text-align: center;">
              <p style="font-size: 16px; color: #555;">Hi there,</p>
              <p style="font-size: 16px; color: #555; line-height: 1.5;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
    
              <a href="${link}" style="
                display: inline-block;
                margin: 20px 0;
                padding: 15px 35px;
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
                background-color: #FF6B35;
                border-radius: 8px;
                text-decoration: none;
                transition: background-color 0.3s ease;
              " onmouseover="this.style.backgroundColor='#e55a2b'">
                Reset Password
              </a>
    
              <p style="font-size: 14px; color: #999; margin-top: 30px;">
                If you did not request a password reset, please ignore this email.
              </p>
            </div>
    
            <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              DermX AI, 2025<br>
              All rights reserved.
            </div>
          </div>
        </div>
      `,
    });
    
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error sending password reset email:", err);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
});

export default router;
