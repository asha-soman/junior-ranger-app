import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Event Details (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let eventRangerToken: string;
  let otherRangerToken: string;
  let eventJuniorToken: string;
  let otherJuniorToken: string;

  const publishedEventId =
    process.env.TEST_PUBLISHED_EVENT_ID;

  const draftEventId =
    process.env.TEST_DRAFT_EVENT_ID;

  const ADMIN = {
    email: 'admin@test.com',
    password: 'Admin@123',
  };

  const EVENT_RANGER = {
    email: 'ranger@gmail.com',
    password: 'Ranger@123',
  };

  const OTHER_RANGER = {
    email: 'ranger7@gmail.com',
    password: 'Ranger@123',
  };

  const EVENT_JUNIOR = {
    email: 'jranger@gmail.com',
    password: 'Jranger@123',
  };

  const OTHER_JUNIOR = {
    email: 'jranger@test.com',
    password: 'Jranger@123',
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<string> => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email,
        password,
      });

    if (response.status >= 400) {
      throw new Error(
        `Login failed for ${email}: ` +
          `${response.status} ` +
          `${JSON.stringify(response.body)}`,
      );
    }

    if (!response.body.access_token) {
      throw new Error(
        `No access_token returned for ${email}`,
      );
    }

    return response.body.access_token;
  };

  beforeAll(async () => {

    if (!publishedEventId) {
      throw new Error(
        'TEST_PUBLISHED_EVENT_ID is missing from .env',
      );
    }

    if (!draftEventId) {
      throw new Error(
        'TEST_DRAFT_EVENT_ID is missing from .env',
      );
    }

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app =
      moduleFixture.createNestApplication();

    await app.init();

    adminToken = await login(
      ADMIN.email,
      ADMIN.password,
    );

    eventRangerToken = await login(
      EVENT_RANGER.email,
      EVENT_RANGER.password,
    );

    otherRangerToken = await login(
      OTHER_RANGER.email,
      OTHER_RANGER.password,
    );

    eventJuniorToken = await login(
      EVENT_JUNIOR.email,
      EVENT_JUNIOR.password,
    );

    otherJuniorToken = await login(
      OTHER_JUNIOR.email,
      OTHER_JUNIOR.password,
    );
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe(
    'GET /events/:id/details',
    () => {

      /*1. No authentication*/
      it(
        'should return 401 when no token is provided',
        async () => {
          await request(
            app.getHttpServer(),
          )
            .get(
              `/events/${publishedEventId}/details`,
            )
            .expect(401);
        },
      );

      /* 2. Admin access*/
      it(
        'should allow admin to retrieve event details',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${adminToken}`,
              )
              .expect(200);

          expect(
            response.body.id,
          ).toBe(
            publishedEventId,
          );

          expect(
            response.body,
          ).toHaveProperty(
            'title',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'description',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'location',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'start_time',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'end_time',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'registration_deadline',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'capacity',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'status',
          );
        },
      );

      /*3. Ranger from correct cohort*/
      it(
        'should allow a ranger to access an event from their cohort',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${eventRangerToken}`,
              )
              .expect(200);

          expect(
            response.body.id,
          ).toBe(
            publishedEventId,
          );
        },
      );

      /*4. Ranger from another cohort*/
      it(
        'should reject a ranger accessing an event from another cohort',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${otherRangerToken}`,
              )
              .expect(403);

          expect(
            response.body.message,
          ).toBe(
            'You do not have access to this event',
          );
        },
      );

      /*5. Junior Ranger from correct cohort and published event*/
      it(
        'should allow a junior ranger to access a published event from their cohort',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${eventJuniorToken}`,
              )
              .expect(200);

          expect(
            response.body.id,
          ).toBe(
            publishedEventId,
          );

          expect(
            response.body.status,
          ).toBe(
            'published',
          );
        },
      );

      /*6. Junior Ranger from different cohort*/
      it(
        'should reject a junior ranger accessing another cohort event',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${otherJuniorToken}`,
              )
              .expect(403);

          expect(
            response.body.message,
          ).toBe(
            'You do not have access to this event',
          );
        },
      );

      /*7. Junior Ranger accessing a draft*/
      it(
        'should reject a junior ranger accessing a draft event',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${draftEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${eventJuniorToken}`,
              )
              .expect(403);

          expect(
            response.body.message,
          ).toBe(
            'This event is not available',
          );
        },
      );

      /*8. Event does not exist*/
      it(
        'should return 404 when the event does not exist',
        async () => {
          const missingEventId =
            '11111111-1111-1111-1111-111111111111';

          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${missingEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${adminToken}`,
              )
              .expect(404);

          expect(
            response.body.message,
          ).toBe(
            'Event not found',
          );
        },
      );

      /*9. Cohort information*/
      it(
        'should include cohort information',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${adminToken}`,
              )
              .expect(200);

          expect(
            response.body,
          ).toHaveProperty(
            'cohort',
          );

          expect(
            response.body.cohort,
          ).toHaveProperty(
            'id',
          );

          expect(
            response.body.cohort,
          ).toHaveProperty(
            'name',
          );
        },
      );

      /*10. Organiser information*/
      it(
        'should include organiser information',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${adminToken}`,
              )
              .expect(200);

          expect(
            response.body,
          ).toHaveProperty(
            'organiser',
          );

          expect(
            response.body.organiser,
          ).toHaveProperty(
            'id',
          );

          expect(
            response.body.organiser,
          ).toHaveProperty(
            'name',
          );

          expect(
            response.body.organiser,
          ).toHaveProperty(
            'email',
          );

          expect(
            response.body.organiser,
          ).toHaveProperty(
            'role',
          );
        },
      );

      /*11. Registration information*/
      it(
        'should include registration and capacity information',
        async () => {
          const response =
            await request(
              app.getHttpServer(),
            )
              .get(
                `/events/${publishedEventId}/details`,
              )
              .set(
                'Authorization',
                `Bearer ${adminToken}`,
              )
              .expect(200);

          expect(
            response.body,
          ).toHaveProperty(
            'capacity',
          );

          expect(
            response.body,
          ).toHaveProperty(
            'registration',
          );

          expect(
            response.body.registration,
          ).toHaveProperty(
            'registered_count',
          );

          expect(
            response.body.registration,
          ).toHaveProperty(
            'spots_available',
          );

          expect(
            response.body.registration,
          ).toHaveProperty(
            'registration_open',
          );

          expect(
            response.body.registration,
          ).toHaveProperty(
            'user_status',
          );
        },
      );
    },
  );
});