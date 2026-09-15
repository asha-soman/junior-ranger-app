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

  // EVENT REGISTRATION CONFIRMATION
  async sendEventRegistrationConfirmation(
    email: string,
    eventTitle: string,
  ): Promise<string | null> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject: `Registration confirmed: ${eventTitle}`,
      html: `
        <h2>Event Registration Confirmed</h2>

        <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>

        <p>You can view the event details in the Junior Ranger app.</p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send event registration confirmation:',
        error,
      );

      throw new Error(
        'Unable to send event registration confirmation',
      );
    }

    console.log(
      'Event registration confirmation sent:',
      data?.id,
    );

    return data?.id ?? null;
  }

  // EVENT REGISTRATION CANCELLATION
  async sendEventRegistrationCancellation(
    email: string,
    eventTitle: string,
  ): Promise<string | null> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject: `Registration cancelled: ${eventTitle}`,
      html: `
        <h2>Event Registration Cancelled</h2>

        <p>Your registration for <strong>${eventTitle}</strong> has been cancelled.</p>

        <p>You can view other available events in the Junior Ranger app.</p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send event registration cancellation:',
        error,
      );

      throw new Error(
        'Unable to send event registration cancellation',
      );
    }

    return data?.id ?? null;
  }

  // EVENT CANCELLATION
  async sendEventCancellation(
    email: string,
    eventTitle: string,
  ): Promise<string | null> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject: `Event cancelled: ${eventTitle}`,
      html: `
        <h2>Event Cancelled</h2>

        <p>
          The event <strong>${eventTitle}</strong> has been cancelled.
        </p>

        <p>
          Please check the Junior Ranger app for other available events.
        </p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send event cancellation email:',
        error,
      );

      throw new Error(
        'Unable to send event cancellation email',
      );
    }

    return data?.id ?? null;
  }

  // EVENT DETAILS UPDATED
  async sendEventUpdate(
    email: string,
    eventTitle: string,
  ): Promise<string | null> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject: `Event updated: ${eventTitle}`,
      html: `
        <h2>Event Details Updated</h2>

        <p>
          Some details for <strong>${eventTitle}</strong> have changed.
        </p>

        <p>
          Please check the Junior Ranger app for the latest event information.
        </p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send event update email:',
        error,
      );

      throw new Error(
        'Unable to send event update email',
      );
    }

    return data?.id ?? null;
  }

  // EVENT PUBLISHED AGAIN
  async sendEventRepublished(
    email: string,
    eventTitle: string,
  ): Promise<string | null> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject: `Event available again: ${eventTitle}`,
      html: `
        <h2>Event Available Again</h2>

        <p>
          <strong>${eventTitle}</strong> has been published again
          after previously being cancelled.
        </p>

        <p>
          Please check the Junior Ranger app for the latest event details.
        </p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send event republished email:',
        error,
      );

      throw new Error(
        'Unable to send event republished email',
      );
    }

    return data?.id ?? null;
  }

  // EVENT REMINDER
  async sendEventReminder(
    email: string,
    eventTitle: string,
  ): Promise<string | null> {
    const resend = this.getResendClient();

    const { data, error } = await resend.emails.send({
      from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
      to: email,
      subject: `Reminder: ${eventTitle} is coming up soon`,
      html: `
        <h2>Event Reminder</h2>

        <p>
          This is a reminder that <strong>${eventTitle}</strong>
          is coming up soon.
        </p>

        <p>
          Please check the Junior Ranger app for the latest event details.
        </p>
      `,
    });

    if (error) {
      console.error(
        'Failed to send event reminder:',
        error,
      );

      throw new Error(
        'Unable to send event reminder',
      );
    }

    return data?.id ?? null;
  }

}