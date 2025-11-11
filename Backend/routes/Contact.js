import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aabithroshan05@gmail.com",
        pass: "kiki tcwb ltmz saxb".replace(/\s/g, ""),
      },
    });

    const mailOptions = {
    from: "aabithroshan05@gmail.com", 
    replyTo: email, 
    to: "aabithroshan05@gmail.com",
    subject: `📩 New Contact Form: ${subject}`,
    text: `
        You have a new message from StudyCourse Contact Form:

        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
    `,
    };


    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

export default router;
