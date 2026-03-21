import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to,
      subject,
      html,
    });
  }

  async sendPasswordReset(to: string, resetToken: string) {
    const resetUrl = `${this.configService.get('WEB_APP_URL')}/reset-password?token=${resetToken}`;
    return this.sendEmail(
      to,
      'Password Reset Request',
      `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    );
  }

  async sendWelcome(to: string, name: string) {
    return this.sendEmail(
      to,
      'Welcome to TAC Calabash',
      `<p>Hello ${name},</p><p>Welcome to our church family!</p>`,
    );
  }
}
