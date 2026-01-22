export const sendVerificationEmail = async (email: string, userId: string) => {
    const verificationUrl = `${process.env.BASE_URL}/api/user/verify-email/${userId}`;
    const emailContent = `Click <a href="${verificationUrl}">here</a> to verify your email`;
    const subject = "Verify your email";
    const html = `<p>Click <a href="${verificationUrl}">here</a> to verify your email</p>`;
    const text = `Click ${verificationUrl} to verify your email`;
    console.log(emailContent);
}