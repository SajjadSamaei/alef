import nodemailer from "nodemailer";

// Transporter 1: Default SMTP (using your main config)
// This is the one Payload uses by default, but we can recreate it here for clarity or use it elsewhere.
export const cobaltTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Transporter 2: SendGrid for marketing/transactional emails
export const infoChegallTransporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // This is always 'apikey' for SendGrid
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Transporter 3: Resend for welcome emails
export const novaChegallTransporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend", // This is always 'resend' for Resend
    pass: process.env.RESEND_API_KEY,
  },
});
