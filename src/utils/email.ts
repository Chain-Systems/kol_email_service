import { emailService } from "../index";

export const sendVerificationEmail = async (email: string, userId: string) => {
    try {
    const verificationUrl = `${process.env.BASE_URL}/api/user/verify-email/${userId}`;
    const subject = "Verify your email";
    const html = `
  <p>Hello,</p>
  <p>
    Thank you for signing up for <strong>7kols</strong>.
    Please confirm your email address by clicking the button below:
  </p>
  <p>
    <a 
      href="${verificationUrl}" 
      style="
        display: inline-block;
        padding: 10px 16px;
        background-color: #000;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
      "
    >
      Verify Email Address
    </a>
  </p>
  <p>
    If you did not create an account with 7kols, you can safely ignore this email.
  </p>
  <p>
    Best regards,<br/>
    The 7kols Team
  </p>
`;

const text = `
Hello,

Thank you for signing up for 7kols.

Please verify your email address by visiting the link below:
${verificationUrl}

If you did not create an account with 7kols, you can safely ignore this email.

Best regards,
The 7kols Team
`;

    await emailService.sendEmail({
        to: email,
        subject,
        html,
        text
    });
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
    }
}