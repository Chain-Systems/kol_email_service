import nodemailer, { type Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface EmailConfig {
  service: string;
  user: string;
  pass: string;
}

export interface EmailMessage {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string;
  }>;
}

const EMAIL=process.env.EMAIL;

export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `7Kol <${EMAIL}>`,
        ...message
      });
      console.log('Email sent successfully!');
      console.log('Message ID:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified');
    } catch (error) {
      console.error('SMTP connection failed:', error);
      process.exit(1);
    }
  }
}