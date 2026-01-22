import { emailService } from "../index";

export const sendVerificationEmail = async (email: string, userId: string) => {
    try {
    const verificationUrl = `${process.env.BASE_URL}/api/user/verify-email/${userId}`;
    const subject = "Verify your email";
    const html = `<p>Click <a href="${verificationUrl}">here</a> to verify your email</p>`;
    const text = `Click ${verificationUrl} to verify your email`;
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