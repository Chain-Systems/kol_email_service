import cron from "node-cron";
import { fetchUserDetails } from "../utils/userDetails";
import { prismaClient } from "../database/client";
import { emailService } from "../index";

export const cronService = cron.schedule("0 9 * * *", async () => {
    console.log("CRON: Sending email to users");
    const users = await prismaClient.user.findMany();
    for (const user of users) {
        await sendDetailsToUser(user);
    }
});

const sendDetailsToUser = async (user: { email: string, walletAddress: string }) => {
    const userDetails = await fetchUserDetails(user.walletAddress);
    if(!userDetails.registered) {
        return;
    }
    const email = user.email;
    const subject = "Your 7Kol Details";
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>7Kols Daily Activity Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">7Kols</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Daily Activity Report</p>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.5;">
                                Hello,
                            </p>
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Here's your daily account summary for <strong>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>:
                            </p>
                            
                            <!-- Stats Container -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
                                        <span style="color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Total Deposited</span>
                                    </td>
                                    <td style="padding: 15px 20px; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #333333; font-size: 16px;">${userDetails.totalDeposited}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
                                        <span style="color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Total Earned</span>
                                    </td>
                                    <td style="padding: 15px 20px; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #10b981; font-size: 16px;">${userDetails.totalEarned}</strong>
                                    </td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
                                        <span style="color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Total Withdrawn</span>
                                    </td>
                                    <td style="padding: 15px 20px; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #333333; font-size: 16px;">${userDetails.totalWithdrawn}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
                                        <span style="color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Pending Reward</span>
                                    </td>
                                    <td style="padding: 15px 20px; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #f59e0b; font-size: 16px;">${userDetails.pendingReward}</strong>
                                    </td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 15px 20px;">
                                        <span style="color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Downline Count</span>
                                    </td>
                                    <td style="padding: 15px 20px; text-align: right;">
                                        <strong style="color: #667eea; font-size: 16px;">${userDetails.downlineCount}</strong>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://7app.kolstoken.com/" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">View Dashboard</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px; line-height: 1.5; text-align: center;">
                                You're receiving this email because you subscribed to daily updates from 7Kols.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                                <a href="https://7app.kolstoken.com/" target="_blank" style="color: #667eea; text-decoration: none;">Visit 7Kols</a>
                            </p>
                            <p style="margin: 15px 0 0 0; color: #cccccc; font-size: 11px; text-align: center;">
                                © ${new Date().getFullYear()} 7Kols. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
    await emailService.sendEmail({
        to: email,
        subject,
        html
    });
}