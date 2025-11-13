import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Todo App" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};
