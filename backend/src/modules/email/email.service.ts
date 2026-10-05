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


  // PENDING RANGER ACCOUNT APPROVAL
  async sendPendingRangerApproval(
    email: string,
    rangerName: string,
  ): Promise<string | undefined> {
    const resend = this.getResendClient();

    const { data, error } =
      await resend.emails.send({
        from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
        to: email,
        subject: 'Pending Ranger Account Approval',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>
              ${rangerName} has requested a Ranger account
              and is awaiting approval.
            </p>

            <p>
              Please review the account request in the
              Junior Ranger app.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        'Failed to send pending Ranger approval email:',
        error,
      );

      throw new Error(
        'Unable to send pending Ranger approval email',
      );
    }

    console.log(
      'Pending Ranger approval email sent:',
      data?.id,
    );

    return data?.id;
  }

  // RANGER ACCOUNT APPROVED
  async sendRangerAccountApproved(
    email: string,
    rangerName: string,
  ): Promise<string | undefined> {
    const resend = this.getResendClient();

    const { data, error } =
      await resend.emails.send({
        from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
        to: email,
        subject: 'Your Ranger Account Has Been Approved',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Ranger Account Approved</h2>

            <p>Hello ${rangerName},</p>

            <p>
              Your Ranger account has been approved.
            </p>

            <p>
              You can now sign in to the Junior Ranger app.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        'Failed to send Ranger approval email:',
        error,
      );

      throw new Error(
        'Unable to send Ranger approval email',
      );
    }

    return data?.id;
  }

  // RANGER ACCOUNT REJECTED
  async sendRangerAccountRejected(
    email: string,
    rangerName: string,
  ): Promise<string | undefined> {
    const resend = this.getResendClient();

    const { data, error } =
      await resend.emails.send({
        from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
        to: email,
        subject: 'Ranger Account Request Update',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Ranger Account Status</h2>

            <p>Hello ${rangerName},</p>

            <p>
              Your Ranger account request has been rejected.
            </p>

            <p>
              Please contact the Junior Ranger administrative team if you
              require further information.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        'Failed to send Ranger rejection email:',
        error,
      );

      throw new Error(
        'Unable to send Ranger rejection email',
      );
    }

    return data?.id;
  }

  // MISSION SUBMISSION
  async sendMissionSubmitted(
    email: string,
    juniorRangerName: string,
    taskTitle: string,
  ): Promise<string | undefined> {
    const resend = this.getResendClient();

    const { data, error } =
      await resend.emails.send({
        from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
        to: email,
        subject: 'New Adventure Task Submission',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">

            <p>
              ${juniorRangerName} has submitted
              <strong>${taskTitle}</strong> for review.
            </p>

            <p>
              Please review the submission in the
              Junior Ranger app.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        'Failed to send mission submission email:',
        error,
      );

      throw new Error(
        'Unable to send mission submission email',
      );
    }

    return data?.id;
  }

  // ADVENTURE TASK APPROVED
  async sendTaskApproved(
    email: string,
    juniorRangerName: string,
    taskTitle: string,
  ): Promise<string | undefined> {
    const resend = this.getResendClient();

    const { data, error } =
      await resend.emails.send({
        from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
        to: email,
        subject: 'Adventure Task Approved',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">

            <p>Hello ${juniorRangerName},</p>

            <p>
              Your submission for the task
              <strong>${taskTitle}</strong>
              has been approved.
            </p>

            <p>
              Great work! Keep exploring and completing
              more adventure tasks.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        'Failed to send task approval email:',
        error,
      );

      throw new Error(
        'Unable to send task approval email',
      );
    }

    return data?.id;
  }

  // ADVENTURE TASK REJECTED
  async sendTaskRejected(
    email: string,
    juniorRangerName: string,
    taskTitle: string,
    feedback?: string | null,
  ): Promise<string | undefined> {
    const resend = this.getResendClient();

    const feedbackSection = feedback
      ? `
          <p>
            <strong>Ranger feedback:</strong><br />
            ${feedback}
          </p>
        `
      : '';

    const { data, error } =
      await resend.emails.send({
        from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
        to: email,
        subject: 'Adventure Task Needs Changes',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">

            <p>Hello ${juniorRangerName},</p>

            <p>
              Your submission for the task
              <strong>${taskTitle}</strong>
              was not approved.
            </p>

            ${feedbackSection}

            <p>
              Please review the feedback and update
              your task submission.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        'Failed to send task rejection email:',
        error,
      );

      throw new Error(
        'Unable to send task rejection email',
      );
    }
    return data?.id;
  }

  // JUNIOR RANGER JOINED COHORT
  async sendJuniorRangerJoinedCohort(
    email: string,
    juniorRangerName: string,
    cohortName: string,
  ): Promise<string | undefined> {
    const resend = this.getResendClient();

    const { data, error } =
      await resend.emails.send({
        from: 'Junior Ranger <noreply@juniorrangerapp.dev>',
        to: email,
        subject: 'New Junior Ranger Joined Your Cohort',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">

            <p>
              <strong>${juniorRangerName}</strong>
              has joined your cohort
              <strong>${cohortName}</strong>.
            </p>

            <p>
              You can view the cohort members in the
              Junior Ranger app.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        'Failed to send cohort join email:',
        error,
      );

      throw new Error(
        'Unable to send cohort join email',
      );
    }

    return data?.id;
  }

}