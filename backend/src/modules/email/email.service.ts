import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  // RESEND CLIENT
  private getResendClient() {
    const apiKey =
      this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    return new Resend(apiKey);
  }

  // EMAIL VERIFICATION
  async sendVerificationCode(
    email: string,
    code: string,
  ): Promise<void> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject: 'Verify your Junior Ranger account',
      html: `
        <h2>Verify your email</h2>
        <p>Thank you for signing up for Junior Ranger.</p>
        <p>Your verification code is:</p>
        <h1>${code}</h1>
        <p>Please enter this code in the app to verify your email address.</p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send verification email:',
        error,
      );

      throw new Error(
        'Unable to send verification email',
      );
    }

    console.log(
      'Verification email sent:',
      data?.id,
    );
  }

  // TWO-FACTOR AUTHENTICATION
  async sendTwoFactorCode(
    email: string,
    code: string,
  ): Promise<void> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject:
        'Junior Ranger login verification code',
      html: `
        <h2>Two-Factor Authentication</h2>
        <p>A login attempt was made for your Junior Ranger account.</p>
        <p>Your verification code is:</p>
        <h1>${code}</h1>
        <p>This code will expire in 5 minutes.</p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send 2FA email:',
        error,
      );

      throw new Error(
        'Unable to send two-factor authentication email',
      );
    }

    console.log(
      '2FA email sent:',
      data?.id,
    );
  }
}