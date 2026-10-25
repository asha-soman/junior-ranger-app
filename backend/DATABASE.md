# Junior Ranger Platform - Database Architecture & Scripts Guide

This document provides a comprehensive reference for the data layer of the Junior Ranger Mobile Platform, including schema architecture, migration procedures, seed datasets, and operational CLI scripts.

---

## 1. Data Layer Overview

The backend uses **PostgreSQL** coupled with **Kysely**, a type-safe TypeScript SQL query builder. The architecture strictly decouples schema migrations from runtime application code, ensuring zero-downtime deployments and predictable schema evolution.

### Key Highlights
- **Engine**: PostgreSQL 15+ (Hosted on AWS via Neon / Cloud SQL)
- **Query Builder**: Kysely `^0.28.16`
- **Driver**: `pg` with native SSL support
- **Primary Keys**: UUID v4 (`gen_random_uuid()`)
- **Soft Delete Pattern**: Standardized `is_deleted` boolean flag across historical/auditable entities
- **Total Tables**: 25 application domain tables + 2 Kysely migration tracking tables

---

## 2. Environment Configuration

The database connection is configured via `.env` in the `backend/` directory:

```ini
# Database Connection Settings
DB_HOST=ep-aged-salad-a71e2mur.ap-southeast-2.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=your_secure_password
DB_NAME=neondb
DB_SSL=true

# Optional safety override for database reset
FORCE_DB_RESET=false
```

---

## 3. Database Commands Quick Reference

All database commands are available as standard npm scripts from the `backend/` directory:

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run migrate:status` | Check status | Displays an ASCII table of all migrations, showing whether each is `EXECUTED` or `PENDING` along with timestamps. |
| `npm run migrate:latest` | Run migrations | Executes all pending migrations in alphabetical/chronological order. |
| `npm run migrate:rollback` | Revert batch | Reverts the most recently executed migration batch using each migration's `down()` method. |
| `npm run db:seed` | Seed data | Populates the database with realistic Queensland Ranger cohorts, missions, badges, and user accounts. Safe and idempotent. |
| `npm run db:reset` | Full teardown | Reverts all executed migrations, migrates to latest, and applies fresh seed data. |

---

## 4. Migration Architecture

Migrations are located in [`backend/src/database/migrations/`](file:///Users/carlo/Developer/junior-ranger-app/backend/src/database/migrations/) and are executed via [`backend/src/database/migrator.ts`](file:///Users/carlo/Developer/junior-ranger-app/backend/src/database/migrator.ts).

### Migration Files
1. **`20261025000001_create_core_identity_and_cohorts.ts`**:
   - Enables `uuid-ossp` and `pgcrypto` extensions.
   - Tables: `users`, `cohorts`, `cohort_members`, `invite_codes`, `auth_challenges`, `sessions`.
   - Core indexes on email, invite codes, and cohort memberships.
2. **`20261025000002_create_media_and_observations.ts`**:
   - Tables: `images` (with JSONB metadata), `observations` (field / educator notes).
3. **`20261025000003_create_adventures_and_tasks.ts`**:
   - Tables: `adventures`, `adventure_tasks`, `adventure_submissions`, `task_completions`, `cohort_adventures`.
   - Indexes on cohort assignment, task sequencing, and submission progress.
4. **`20261025000004_create_events_and_community.ts`**:
   - Tables: `events`, `event_registrations`, `event_attendance`, `announcements`, `activity_posts`, `club_activities`, `reactions`.
   - Unique constraints on user reactions and event registrations.
5. **`20261025000005_create_gamification_and_notifications.ts`**:
   - Tables: `badges`, `user_badges`, `notifications`, `notification_preferences`, `notification_delivery_logs`.
   - Indexes on gamification criteria (`criteria_type`, `criteria_value`) and read status.
6. **`20261025000006_optimize_indexes.ts`**:
   - High-performance composite indexes targeting high-frequency queries and filtering:
     * `cohort_members(cohort_id, is_deleted)` & `cohort_members(user_id, role, is_deleted)`: Optimizes cohort membership queries and bulk member counts.
     * `reactions(target_id, reaction_type, user_id)`: Enables Index-Only Scan for bulk feed reaction queries.
     * `activity_posts(cohort_id, is_deleted, created_at)`: Eliminates filesort for cohort social feed listing.
     * `club_activities(cohort_id, is_deleted, created_at)`: Optimizes club activities feed queries.
     * `announcements(cohort_id, is_deleted, is_pinned, created_at)`: Optimizes pinned and chronological announcement display.
     * `adventures(cohort_id, is_deleted, created_at)`: Fast cohort adventure listing.
     * `adventure_tasks(adventure_id, is_deleted, task_order)`: Fast sequential task retrieval.
     * `cohort_adventures(adventure_id, is_deleted, cohort_id)`: Fast multi-cohort assignment joins.
     * `task_completions(junior_ranger_user_id, status)`: Sub-millisecond gamification badge evaluation and task progress.
     * `task_completions(task_id, submitted_at)`: Fast ranger review queues.
     * `events(status, is_deleted, start_time)`: Optimizes hourly automated event reminder cron jobs.
     * `notifications(user_id, created_at)`: Fast notification polling and inbox retrieval.
     * `users(role, approval_status, is_deleted, created_at)`: Fast admin user management and pending ranger searches.

### How to Add a New Migration
Create a timestamped file in `src/database/migrations/` following the naming format:
`YYYYMMDDHHMMSS_description_of_change.ts`

```typescript
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('bio', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .dropColumn('bio')
    .execute();
}
```

---

## 5. Seed Dataset & Test Credentials

The seeder provides mock data tailored to the **Queensland Indigenous Land and Sea Ranger Program (QILSR)**.

All default test accounts share the common development password:
🔑 **`Password123!`**

### Seed Accounts Summary

| Email | Role | Name | Notes |
| :--- | :--- | :--- | :--- |
| `admin@juniorranger.org.au` | `admin` | Admin Officer | Full system administration and approval authority |
| `ranger.sarah@juniorranger.org.au` | `ranger` | Ranger Sarah Walker | Yirrganydji Coast Ranger leader (Approved) |
| `ranger.david@juniorranger.org.au` | `ranger` | Ranger David Miller | Bunya Mountains Ranger leader (Approved) |
| `ranger.pending@juniorranger.org.au` | `ranger` | Applicant Mark Taylor | Pending ranger registration (to test admin approval workflow) |
| `jr.jarrah@juniorranger.org.au` | `junior_ranger` | Jarrah Connelly | Level 3 Junior Ranger (320 XP, 4 badges earned) |
| `jr.maya@juniorranger.org.au` | `junior_ranger` | Maya Robinson | Level 2 Junior Ranger (140 XP, 1 badge earned) |
| `jr.kai@juniorranger.org.au` | `junior_ranger` | Kai Thorne | Level 1 Junior Ranger (40 XP, newly enrolled) |

### Regional Cohorts
- **Yirrganydji Land and Sea Rangers** (Cairns / Northern Beaches, QLD)
- **Bunya Mountains Junior Rangers** (Bunya Mountains National Park, QLD)
- **Quandamooka Sea Rangers** (Minjerribah / North Stradbroke Island, QLD)

### Seed Invite Codes
- `YIRR2026`: Valid active code for Yirrganydji cohort
- `BUNYA26`: Valid active code for Bunya Mountains cohort
- `EXPIRED24`: Expired code for testing expired invite handling
- `FULL2026`: Fully utilized quota code (`used_count = max_usage`)

### Gamification Badges
- **First Trail** (`criteria_type: 'task_count'`, `criteria_value: 1`)
- **Water Guardian** (`criteria_type: 'task_count'`, `criteria_value: 3`)
- **Knowledge Keeper** (`criteria_type: 'xp'`, `criteria_value: 150`)
- **Master Scout** (`criteria_type: 'level'`, `criteria_value: 3`)
- **Eco Champion** (`criteria_type: 'task_count'`, `criteria_value: 10`)

---

## 6. Table Entity Inventory

| Domain | Table Name | Key Attributes |
| :--- | :--- | :--- |
| **Authentication & Users** | `users` | `id`, `email`, `role`, `approval_status`, `total_xp`, `current_level`, `is_deleted` |
| | `auth_challenges` | `id`, `email`, `code`, `purpose`, `expires_at` |
| | `sessions` | `id`, `user_id`, `token`, `expires_at`, `is_deleted` |
| **Cohorts & Access** | `cohorts` | `id`, `name`, `description`, `location`, `assigned_ranger_id`, `is_deleted` |
| | `cohort_members` | `id`, `user_id`, `cohort_id`, `role`, `is_deleted` |
| | `invite_codes` | `id`, `cohort_id`, `code`, `expiry_date`, `max_usage`, `used_count`, `active` |
| **Adventures & Missions** | `adventures` | `id`, `title`, `description`, `cohort_id`, `due_date`, `status`, `is_deleted` |
| | `adventure_tasks` | `id`, `adventure_id`, `title`, `xp_reward`, `task_order`, `is_deleted` |
| | `adventure_submissions` | `id`, `adventure_id`, `junior_ranger_user_id`, `image_id`, `status`, `feedback` |
| | `task_completions` | `id`, `task_id`, `junior_ranger_user_id`, `submission_text`, `status`, `xp_awarded` |
| | `cohort_adventures` | `id`, `cohort_id`, `adventure_id`, `assigned_by_user_id`, `assigned_by_role` |
| **Events & Community** | `events` | `id`, `title`, `location`, `start_time`, `end_time`, `cohort_id`, `status` |
| | `event_registrations` | `id`, `event_id`, `junior_ranger_user_id`, `status`, `registered_at` |
| | `event_attendance` | `id`, `registration_id`, `status`, `marked_by_user_id`, `marked_at` |
| | `announcements` | `id`, `title`, `content`, `cohort_id`, `is_pinned`, `priority`, `status` |
| | `activity_posts` | `id`, `content`, `image_url`, `cohort_id`, `created_by_user_id` |
| | `club_activities` | `id`, `title`, `description`, `activity_date`, `cohort_id` |
| | `reactions` | `id`, `user_id`, `target_type`, `target_id`, `reaction_type` |
| **Gamification** | `badges` | `id`, `name`, `criteria_type`, `criteria_value`, `is_deleted` |
| | `user_badges` | `id`, `user_id`, `badge_id`, `earned_at`, `is_deleted` |
| **Notifications** | `notifications` | `id`, `user_id`, `event_id`, `type`, `title`, `message`, `is_read` |
| | `notification_preferences` | `id`, `user_id`, `event_updates_enabled`, `event_reminders_enabled` |
| | `notification_delivery_logs`| `id`, `notification_id`, `user_id`, `channel`, `status`, `recipient_email` |
| **Media & Observations** | `images` | `id`, `secure_url`, `metadata` (JSONB), `is_deleted` |
| | `observations` | `id`, `student_id`, `teacher_id`, `notes`, `is_deleted` |
| **Migration Tracking** | `kysely_migration` | `name`, `timestamp` |
| | `kysely_migration_lock` | `id`, `is_locked` |
