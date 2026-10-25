import { Kysely } from 'kysely';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export async function seedDatabase(
  db: Kysely<any>,
  options: { truncate?: boolean } = {},
) {
  console.log('Beginning database seeding...');

  // Use a transaction so seeding is atomic
  await db.transaction().execute(async (trx) => {
    if (options.truncate) {
      console.log('Truncating existing tables before seed...');
      const tables = [
        'notification_delivery_logs',
        'notification_preferences',
        'notifications',
        'reactions',
        'club_activities',
        'activity_posts',
        'announcements',
        'event_attendance',
        'event_registrations',
        'events',
        'user_badges',
        'badges',
        'cohort_adventures',
        'task_completions',
        'adventure_submissions',
        'adventure_tasks',
        'adventures',
        'observations',
        'images',
        'sessions',
        'auth_challenges',
        'invite_codes',
        'cohort_members',
        'cohorts',
        'users',
      ];

      for (const table of tables) {
        await trx.deleteFrom(table).execute();
      }
      console.log('All tables cleared.');
    }

    const defaultPassword = 'Password123!';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const now = new Date();

    // =========================================================================
    // 1. USERS
    // =========================================================================
    console.log('Seeding users...');
    const users = [
      // Admin
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'admin@juniorranger.org.au',
        name: 'Admin Officer',
        role: 'admin',
        password_hash: passwordHash,
        avatar_url:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        is_active: true,
        approval_status: 'approved',
        email_verified: true,
        two_factor_enabled: false,
        total_xp: 0,
        current_level: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      // Rangers
      {
        id: '22222222-2222-2222-2222-222222222221',
        email: 'ranger.sarah@juniorranger.org.au',
        name: 'Ranger Sarah Walker',
        role: 'ranger',
        password_hash: passwordHash,
        avatar_url:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
        is_active: true,
        approval_status: 'approved',
        email_verified: true,
        two_factor_enabled: false,
        total_xp: 0,
        current_level: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'ranger.david@juniorranger.org.au',
        name: 'Ranger David Miller',
        role: 'ranger',
        password_hash: passwordHash,
        avatar_url:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        is_active: true,
        approval_status: 'approved',
        email_verified: true,
        two_factor_enabled: false,
        total_xp: 0,
        current_level: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '22222222-2222-2222-2222-222222222223',
        email: 'ranger.pending@juniorranger.org.au',
        name: 'Applicant Mark Taylor',
        role: 'ranger',
        password_hash: passwordHash,
        avatar_url:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        is_active: false,
        approval_status: 'pending',
        email_verified: true,
        two_factor_enabled: false,
        total_xp: 0,
        current_level: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      // Junior Rangers
      {
        id: '33333333-3333-3333-3333-333333333331',
        email: 'jr.jarrah@juniorranger.org.au',
        name: 'Jarrah Connelly',
        role: 'junior_ranger',
        password_hash: passwordHash,
        avatar_url:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
        is_active: true,
        approval_status: 'approved',
        email_verified: true,
        two_factor_enabled: false,
        total_xp: 320,
        current_level: 3,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '33333333-3333-3333-3333-333333333332',
        email: 'jr.maya@juniorranger.org.au',
        name: 'Maya Robinson',
        role: 'junior_ranger',
        password_hash: passwordHash,
        avatar_url:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
        is_active: true,
        approval_status: 'approved',
        email_verified: true,
        two_factor_enabled: false,
        total_xp: 140,
        current_level: 2,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'jr.kai@juniorranger.org.au',
        name: 'Kai Thorne',
        role: 'junior_ranger',
        password_hash: passwordHash,
        avatar_url:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80',
        is_active: true,
        approval_status: 'approved',
        email_verified: true,
        two_factor_enabled: false,
        total_xp: 40,
        current_level: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const u of users) {
      await trx
        .insertInto('users')
        .values(u)
        .onConflict((oc) =>
          oc.column('email').doUpdateSet({
            name: u.name,
            role: u.role,
            password_hash: u.password_hash,
            is_active: u.is_active,
            approval_status: u.approval_status,
            total_xp: u.total_xp,
            current_level: u.current_level,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 2. COHORTS
    // =========================================================================
    console.log('Seeding cohorts...');
    const cohorts = [
      {
        id: '44444444-4444-4444-4444-444444444441',
        name: 'Yirrganydji Land and Sea Rangers',
        description:
          'Cairns and Northern Beaches coastal management and youth ranger unit.',
        location: 'Cairns, Queensland',
        image_url:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        assigned_ranger_id: '22222222-2222-2222-2222-222222222221',
        created_by_ranger_id: '22222222-2222-2222-2222-222222222221',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '44444444-4444-4444-4444-444444444442',
        name: 'Bunya Mountains Junior Rangers',
        description:
          'Highland bunya pine forest ecosystem stewardship and cultural protection.',
        location: 'Bunya Mountains, Queensland',
        image_url:
          'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        assigned_ranger_id: '22222222-2222-2222-2222-222222222222',
        created_by_ranger_id: '22222222-2222-2222-2222-222222222222',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '44444444-4444-4444-4444-444444444443',
        name: 'Quandamooka Sea Rangers',
        description:
          'Minjerribah marine turtle and coastal biodiversity conservation cohort.',
        location: 'Minjerribah (North Stradbroke Island), Queensland',
        image_url:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        assigned_ranger_id: '22222222-2222-2222-2222-222222222221',
        created_by_ranger_id: '22222222-2222-2222-2222-222222222221',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const c of cohorts) {
      await trx
        .insertInto('cohorts')
        .values(c)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            name: c.name,
            description: c.description,
            location: c.location,
            image_url: c.image_url,
            assigned_ranger_id: c.assigned_ranger_id,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 3. COHORT MEMBERS
    // =========================================================================
    console.log('Seeding cohort memberships...');
    const cohortMembers = [
      // Rangers
      {
        id: '44444444-1111-0000-0000-000000000001',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        user_id: '22222222-2222-2222-2222-222222222221',
        role: 'ranger',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '44444444-1111-0000-0000-000000000002',
        cohort_id: '44444444-4444-4444-4444-444444444442',
        user_id: '22222222-2222-2222-2222-222222222222',
        role: 'ranger',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      // Junior Rangers
      {
        id: '44444444-1111-0000-0000-000000000003',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        user_id: '33333333-3333-3333-3333-333333333331',
        role: 'junior_ranger',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '44444444-1111-0000-0000-000000000004',
        cohort_id: '44444444-4444-4444-4444-444444444442',
        user_id: '33333333-3333-3333-3333-333333333332',
        role: 'junior_ranger',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '44444444-1111-0000-0000-000000000005',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        user_id: '33333333-3333-3333-3333-333333333333',
        role: 'junior_ranger',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const cm of cohortMembers) {
      await trx
        .insertInto('cohort_members')
        .values(cm)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            role: cm.role,
            is_deleted: cm.is_deleted,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 4. INVITE CODES
    // =========================================================================
    console.log('Seeding invite codes...');
    const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const inviteCodes = [
      {
        id: '77777777-7777-7777-7777-777777777771',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        code: 'YIRR2026',
        expiry_date: futureDate,
        max_usage: 25,
        used_count: 5,
        active: true,
        created_by: '22222222-2222-2222-2222-222222222221',
        created_at: now,
      },
      {
        id: '77777777-7777-7777-7777-777777777772',
        cohort_id: '44444444-4444-4444-4444-444444444442',
        code: 'BUNYA26',
        expiry_date: futureDate,
        max_usage: 20,
        used_count: 3,
        active: true,
        created_by: '22222222-2222-2222-2222-222222222222',
        created_at: now,
      },
      {
        id: '77777777-7777-7777-7777-777777777773',
        cohort_id: '44444444-4444-4444-4444-444444444443',
        code: 'EXPIRED24',
        expiry_date: pastDate,
        max_usage: 10,
        used_count: 2,
        active: false,
        created_by: '22222222-2222-2222-2222-222222222221',
        created_at: pastDate,
      },
      {
        id: '77777777-7777-7777-7777-777777777774',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        code: 'FULL2026',
        expiry_date: futureDate,
        max_usage: 5,
        used_count: 5,
        active: false,
        created_by: '22222222-2222-2222-2222-222222222221',
        created_at: now,
      },
    ];

    for (const ic of inviteCodes) {
      await trx
        .insertInto('invite_codes')
        .values(ic)
        .onConflict((oc) =>
          oc.column('code').doUpdateSet({
            expiry_date: ic.expiry_date,
            max_usage: ic.max_usage,
            used_count: ic.used_count,
            active: ic.active,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 5. BADGES
    // =========================================================================
    console.log('Seeding gamification badges...');
    const badges = [
      {
        id: '55555555-5555-5555-5555-555555555551',
        name: 'First Trail',
        description: 'Completed your very first Junior Ranger outdoor task!',
        image_url: 'https://cdn-icons-png.flaticon.com/512/2583/2583342.png',
        criteria_type: 'task_count',
        criteria_value: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '55555555-5555-5555-5555-555555555552',
        name: 'Water Guardian',
        description: 'Completed 3 environmental and water monitoring tasks.',
        image_url: 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png',
        criteria_type: 'task_count',
        criteria_value: 3,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '55555555-5555-5555-5555-555555555553',
        name: 'Knowledge Keeper',
        description:
          'Accumulated 150 Experience Points (XP) through active missions.',
        image_url: 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png',
        criteria_type: 'xp',
        criteria_value: 150,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '55555555-5555-5555-5555-555555555554',
        name: 'Master Scout',
        description: 'Achieved Ranger Level 3 proficiency.',
        image_url: 'https://cdn-icons-png.flaticon.com/512/2583/2583346.png',
        criteria_type: 'level',
        criteria_value: 3,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Eco Champion',
        description:
          'Outstanding environmental commitment with 10 approved mission completions.',
        image_url: 'https://cdn-icons-png.flaticon.com/512/2583/2583448.png',
        criteria_type: 'task_count',
        criteria_value: 10,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const b of badges) {
      await trx
        .insertInto('badges')
        .values(b)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            name: b.name,
            description: b.description,
            image_url: b.image_url,
            criteria_type: b.criteria_type,
            criteria_value: b.criteria_value,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 6. USER BADGES
    // =========================================================================
    console.log('Seeding awarded user badges...');
    const userBadges = [
      // Jarrah has earned 4 badges
      {
        id: '55555555-0000-0000-0000-000000000001',
        user_id: '33333333-3333-3333-3333-333333333331',
        badge_id: '55555555-5555-5555-5555-555555555551',
        earned_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        is_deleted: false,
        updated_at: now,
      },
      {
        id: '55555555-0000-0000-0000-000000000002',
        user_id: '33333333-3333-3333-3333-333333333331',
        badge_id: '55555555-5555-5555-5555-555555555552',
        earned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        is_deleted: false,
        updated_at: now,
      },
      {
        id: '55555555-0000-0000-0000-000000000003',
        user_id: '33333333-3333-3333-3333-333333333331',
        badge_id: '55555555-5555-5555-5555-555555555553',
        earned_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        is_deleted: false,
        updated_at: now,
      },
      {
        id: '55555555-0000-0000-0000-000000000004',
        user_id: '33333333-3333-3333-3333-333333333331',
        badge_id: '55555555-5555-5555-5555-555555555554',
        earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        is_deleted: false,
        updated_at: now,
      },
      // Maya has earned First Trail
      {
        id: '55555555-0000-0000-0000-000000000005',
        user_id: '33333333-3333-3333-3333-333333333332',
        badge_id: '55555555-5555-5555-5555-555555555551',
        earned_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        is_deleted: false,
        updated_at: now,
      },
    ];

    for (const ub of userBadges) {
      await trx
        .insertInto('user_badges')
        .values(ub)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            earned_at: ub.earned_at,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 7. ADVENTURES & TASKS
    // =========================================================================
    console.log('Seeding adventures and tasks...');
    const adventures = [
      {
        id: '66666666-6666-6666-6666-666666666661',
        title: 'Mangrove Ecosystem & Creek Survey',
        description:
          'Explore and document the health of the local coastal mangrove habitat.',
        image_url:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        task_instructions:
          'Complete all 3 survey tasks to help rangers record coastal health indicators.',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'published',
        created_by_user_id: '22222222-2222-2222-2222-222222222221',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '66666666-6666-6666-6666-666666666662',
        title: 'Traditional Plants & Bush Tucker Trail',
        description:
          'Identify indigenous botanical species used for food and traditional medicine.',
        image_url:
          'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        task_instructions:
          'Follow the designated trail markers and note botanical features.',
        cohort_id: '44444444-4444-4444-4444-444444444442',
        due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'published',
        created_by_user_id: '22222222-2222-2222-2222-222222222222',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const a of adventures) {
      await trx
        .insertInto('adventures')
        .values(a)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            title: a.title,
            description: a.description,
            task_instructions: a.task_instructions,
            status: a.status,
            updated_at: now,
          }),
        )
        .execute();
    }

    const adventureTasks = [
      // Tasks for Adventure 1
      {
        id: '66666666-1111-0000-0000-000000000001',
        adventure_id: '66666666-6666-6666-6666-666666666661',
        title: 'Water Clarity & Salinity Check',
        description:
          'Use the Secchi disk kit to measure water transparency at low tide.',
        xp_reward: 20,
        task_order: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '66666666-1111-0000-0000-000000000002',
        adventure_id: '66666666-6666-6666-6666-666666666661',
        title: 'Identify Mangrove Crab Species',
        description:
          'Photograph and identify either a Fiddler Crab or Mud Crab along the bank.',
        xp_reward: 30,
        task_order: 2,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '66666666-1111-0000-0000-000000000003',
        adventure_id: '66666666-6666-6666-6666-666666666661',
        title: 'Record Shoreline Marine Debris',
        description:
          'Collect, count, and safely dispose of plastics found within 100 meters.',
        xp_reward: 40,
        task_order: 3,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      // Tasks for Adventure 2
      {
        id: '66666666-1111-0000-0000-000000000004',
        adventure_id: '66666666-6666-6666-6666-666666666662',
        title: 'Locate & Document Bunya Pine Cones',
        description:
          'Photograph mature bunya cones and note foliage density in your journal.',
        xp_reward: 25,
        task_order: 1,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '66666666-1111-0000-0000-000000000005',
        adventure_id: '66666666-6666-6666-6666-666666666662',
        title: 'Soap Tree Leaf Demonstration',
        description:
          'Show how Alphitonia excelsa leaves create gentle lather with water.',
        xp_reward: 35,
        task_order: 2,
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const at of adventureTasks) {
      await trx
        .insertInto('adventure_tasks')
        .values(at)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            title: at.title,
            description: at.description,
            xp_reward: at.xp_reward,
            task_order: at.task_order,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 8. TASK COMPLETIONS
    // =========================================================================
    console.log('Seeding task completions...');
    const taskCompletions = [
      // Jarrah's completions (Adventure 1, all 3 tasks approved)
      {
        id: '88888888-8888-8888-8888-888888888881',
        task_id: '66666666-1111-0000-0000-000000000001',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333331',
        submission_text:
          'Secchi depth reached 1.8 meters with clear incoming tide.',
        image_url:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        status: 'approved',
        feedback:
          'Excellent measurement and detailed observation on tide movements!',
        reviewed_by_ranger_id: '22222222-2222-2222-2222-222222222221',
        submitted_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        reviewed_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        xp_awarded: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: '88888888-8888-8888-8888-888888888882',
        task_id: '66666666-1111-0000-0000-000000000002',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333331',
        submission_text:
          'Observed orange-clawed fiddler crab (Austruca) burrowing near stilt roots.',
        image_url:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
        status: 'approved',
        feedback: 'Sharp photo and spot-on species identification.',
        reviewed_by_ranger_id: '22222222-2222-2222-2222-222222222221',
        submitted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        reviewed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        xp_awarded: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: '88888888-8888-8888-8888-888888888883',
        task_id: '66666666-1111-0000-0000-000000000003',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333331',
        submission_text:
          'Collected 14 plastic drink bottles and tangled rope along 150m shoreline.',
        image_url:
          'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
        status: 'approved',
        feedback:
          'Fantastic effort keeping our mangroves clean and safe for marine life!',
        reviewed_by_ranger_id: '22222222-2222-2222-2222-222222222221',
        submitted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        reviewed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        xp_awarded: true,
        created_at: now,
        updated_at: now,
      },
      // Maya's completion (Adventure 2, Task 1 approved)
      {
        id: '88888888-8888-8888-8888-888888888884',
        task_id: '66666666-1111-0000-0000-000000000004',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333332',
        submission_text:
          'Found three fallen bunya pine cones near Russell Park track.',
        image_url:
          'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
        status: 'approved',
        feedback: 'Great field documentation Maya!',
        reviewed_by_ranger_id: '22222222-2222-2222-2222-222222222222',
        submitted_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        reviewed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        xp_awarded: true,
        created_at: now,
        updated_at: now,
      },
      // Kai's completion (Adventure 1, Task 1 submitted, pending review)
      {
        id: '88888888-8888-8888-8888-888888888885',
        task_id: '66666666-1111-0000-0000-000000000001',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333333',
        submission_text:
          'Recorded water clarity reading of 1.4m near creek mouth.',
        image_url:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        status: 'submitted',
        feedback: null,
        reviewed_by_ranger_id: null,
        submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reviewed_at: null,
        xp_awarded: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const tc of taskCompletions) {
      await trx
        .insertInto('task_completions')
        .values(tc)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            submission_text: tc.submission_text,
            status: tc.status,
            feedback: tc.feedback,
            xp_awarded: tc.xp_awarded,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 9. EVENTS, REGISTRATIONS & ATTENDANCE
    // =========================================================================
    console.log('Seeding events and registrations...');
    const event1StartTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const event1EndTime = new Date(
      event1StartTime.getTime() + 3 * 60 * 60 * 1000,
    );
    const event2StartTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const event2EndTime = new Date(
      event2StartTime.getTime() + 4 * 60 * 60 * 1000,
    );

    const events = [
      {
        id: '99999999-9999-9999-9999-999999999991',
        title: 'Saturday Reef Cleanup & Cultural Walk',
        description:
          'Join traditional owners and rangers for a guided shoreline clean-up and cultural story session.',
        location: 'Cairns Northern Esplanade',
        start_time: event1StartTime,
        end_time: event1EndTime,
        registration_deadline: new Date(
          event1StartTime.getTime() - 24 * 60 * 60 * 1000,
        ),
        capacity: 30,
        status: 'published',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        created_by_user_id: '22222222-2222-2222-2222-222222222221',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: '99999999-9999-9999-9999-999999999992',
        title: 'Bunya Forest Tree Planting Day',
        description:
          'Community re-vegetation workshop planting native seedlings along track boundaries.',
        location: 'Bunya Mountains National Park Visitor Centre',
        start_time: event2StartTime,
        end_time: event2EndTime,
        registration_deadline: new Date(
          event2StartTime.getTime() - 24 * 60 * 60 * 1000,
        ),
        capacity: 25,
        status: 'completed',
        cohort_id: '44444444-4444-4444-4444-444444444442',
        created_by_user_id: '22222222-2222-2222-2222-222222222222',
        is_deleted: false,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const ev of events) {
      await trx
        .insertInto('events')
        .values(ev)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            title: ev.title,
            description: ev.description,
            start_time: ev.start_time,
            end_time: ev.end_time,
            status: ev.status,
            updated_at: now,
          }),
        )
        .execute();
    }

    const eventRegistrations = [
      {
        id: '99999999-1111-0000-0000-000000000001',
        event_id: '99999999-9999-9999-9999-999999999991',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333331',
        status: 'registered',
        registered_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        cancelled_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: '99999999-1111-0000-0000-000000000002',
        event_id: '99999999-9999-9999-9999-999999999991',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333333',
        status: 'registered',
        registered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        cancelled_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: '99999999-1111-0000-0000-000000000003',
        event_id: '99999999-9999-9999-9999-999999999992',
        junior_ranger_user_id: '33333333-3333-3333-3333-333333333332',
        status: 'registered',
        registered_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        cancelled_at: null,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const er of eventRegistrations) {
      await trx
        .insertInto('event_registrations')
        .values(er)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            status: er.status,
            updated_at: now,
          }),
        )
        .execute();
    }

    const eventAttendance = [
      {
        id: '99999999-2222-0000-0000-000000000001',
        registration_id: '99999999-1111-0000-0000-000000000003',
        status: 'present',
        marked_by_user_id: '22222222-2222-2222-2222-222222222222',
        marked_at: event2StartTime,
        created_at: now,
        updated_at: now,
      },
    ];

    for (const ea of eventAttendance) {
      await trx
        .insertInto('event_attendance')
        .values(ea)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            status: ea.status,
            marked_by_user_id: ea.marked_by_user_id,
            marked_at: ea.marked_at,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 10. ANNOUNCEMENTS, FEED POSTS & REACTIONS
    // =========================================================================
    console.log('Seeding announcements and community activity...');
    const announcements = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Welcome to Term 4 Junior Ranger Program!',
        content:
          'We are thrilled to begin our seasonal field expeditions across Queensland. Check your adventures tab for upcoming missions.',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        created_by_user_id: '22222222-2222-2222-2222-222222222221',
        status: 'published',
        priority: 'high',
        is_pinned: true,
        is_deleted: false,
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        created_at: now,
        updated_at: now,
      },
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-bbbbbbbbbbbb',
        title: 'Sun Safety and Hydration Reminders',
        content:
          'Please ensure all junior rangers bring protective hats, reef-safe sunscreen, and refillable water bottles for field activities.',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        created_by_user_id: '22222222-2222-2222-2222-222222222221',
        status: 'published',
        priority: 'normal',
        is_pinned: false,
        is_deleted: false,
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        created_at: now,
        updated_at: now,
      },
    ];

    for (const an of announcements) {
      await trx
        .insertInto('announcements')
        .values(an)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            title: an.title,
            content: an.content,
            is_pinned: an.is_pinned,
            priority: an.priority,
            updated_at: now,
          }),
        )
        .execute();
    }

    const activityPosts = [
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        content:
          'Great turnout for the coastal creek survey today! Junior Rangers spotted juvenile barramundi and three mangrove crabs.',
        image_url:
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        cohort_id: '44444444-4444-4444-4444-444444444441',
        created_by_user_id: '22222222-2222-2222-2222-222222222221',
        is_deleted: false,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updated_at: now,
      },
    ];

    for (const ap of activityPosts) {
      await trx
        .insertInto('activity_posts')
        .values(ap)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            content: ap.content,
            image_url: ap.image_url,
            updated_at: now,
          }),
        )
        .execute();
    }

    const reactions = [
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        user_id: '33333333-3333-3333-3333-333333333331',
        target_type: 'activity_post',
        target_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        reaction_type: 'clap',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-dddddddddddd',
        user_id: '33333333-3333-3333-3333-333333333333',
        target_type: 'activity_post',
        target_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        reaction_type: 'thumbs_up',
        created_at: now,
        updated_at: now,
      },
    ];

    for (const rx of reactions) {
      await trx
        .insertInto('reactions')
        .values(rx)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            reaction_type: rx.reaction_type,
            updated_at: now,
          }),
        )
        .execute();
    }

    // =========================================================================
    // 11. NOTIFICATION PREFERENCES & NOTIFICATIONS
    // =========================================================================
    console.log('Seeding notification preferences and notifications...');
    const allUserIds = [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222221',
      '22222222-2222-2222-2222-222222222222',
      '22222222-2222-2222-2222-222222222223',
      '33333333-3333-3333-3333-333333333331',
      '33333333-3333-3333-3333-333333333332',
      '33333333-3333-3333-3333-333333333333',
    ];

    for (const uid of allUserIds) {
      await trx
        .insertInto('notification_preferences')
        .values({
          id: randomUUID(),
          user_id: uid,
          event_updates_enabled: true,
          event_reminders_enabled: true,
          created_at: now,
          updated_at: now,
        })
        .onConflict((oc) =>
          oc.column('user_id').doUpdateSet({
            event_updates_enabled: true,
            event_reminders_enabled: true,
            updated_at: now,
          }),
        )
        .execute();
    }

    const notifications = [
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        user_id: '33333333-3333-3333-3333-333333333331',
        event_id: null,
        type: 'level_up',
        title: 'Level Up!',
        message:
          'Congratulations Jarrah! You have advanced to Level 3 (Master Scout)!',
        is_read: false,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'dddddddd-dddd-dddd-dddd-eeeeeeeeeeee',
        user_id: '33333333-3333-3333-3333-333333333331',
        event_id: '99999999-9999-9999-9999-999999999991',
        type: 'event_reminder',
        title: 'Upcoming Field Event',
        message:
          'Reminder: Saturday Reef Cleanup & Cultural Walk is starting in 7 days.',
        is_read: true,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const nf of notifications) {
      await trx
        .insertInto('notifications')
        .values(nf)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            is_read: nf.is_read,
          }),
        )
        .execute();
    }
  });

  console.log('Database seeding successfully finished!');
}
