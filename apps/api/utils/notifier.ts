import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL || "",
      pass: process.env.SMTP_PASSWORD || "",
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL || "",
    to,
    subject,
    text,
    ...(html && { html }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email notification error:", error);
    return null;
  }
};