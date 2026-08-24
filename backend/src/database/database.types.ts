export type UserRole = 'admin' | 'ranger' | 'junior_ranger';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AdventureStatus = 'draft' | 'published' | 'archived';
export type CohortMemberRole = 'ranger' | 'junior_ranger';
export type SubmissionStatus = 'submitted' | 'approved' | 'rejected';
export type AdventureAssignedByRole = 'admin' | 'ranger';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventRegistrationStatus = 'registered' | 'cancelled';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';
export type AnnouncementPriority = 'normal' | 'high';
export type ReactionType =
  | 'clap'
  | 'thumbs_up'
  | 'star'
  | 'smile'
  | 'wow'
  | 'okay';

export type ReactionTargetType =
  | 'announcement'
  | 'event'
  | 'activity_post'
  | 'club_activity';

export interface UsersTable {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_deleted: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  password_hash: string | null;
  is_active: boolean;
  approval_status: ApprovalStatus;
}

export interface CohortsTable {
  id: string;
  name: string;
  description: string | null;
  is_deleted: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  location: string | null;
  created_by_ranger_id: string | null;
  assigned_ranger_id: string | null;
  image_url: string | null;
}

export interface CohortMembersTable {
  id: string;
  user_id: string | null;
  cohort_id: string | null;
  role: CohortMemberRole;
  is_deleted: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface AdventuresTable {
  id: string;
  title: string;
  description: string;
  task_instructions: string | null;
  cohort_id: string;
  due_date: Date | null;
  status: AdventureStatus;
  created_by_user_id: string | null;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface AdventureSubmissionsTable {
  id: string;
  adventure_id: string;
  cohort_id: string;
  junior_ranger_user_id: string;
  submission_text: string;
  image_url: string | null;
  status: SubmissionStatus;
  feedback: string | null;
  reviewed_by_ranger_id: string | null;
  submitted_at: Date;
  reviewed_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface CohortAdventuresTable {
  id: string;
  cohort_id: string;
  adventure_id: string;
  assigned_by_user_id: string;
  assigned_by_role: AdventureAssignedByRole;
  is_deleted: boolean;
  assigned_at: Date;
  created_at: Date;
  updated_at: Date | null;
}

export interface InviteCodesTable {
  id: string;
  cohort_id: string;
  code: string;
  expiry_date: Date;
  max_usage: number;
  used_count: number;
  active: boolean;
  created_at: Date;
  created_by: string;
}

export interface AuthChallengesTable {
  id: string;
  email: string;
  code: string;
  expires_at: Date;
  created_at: Date;
}

export interface BadgesTable {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface UserBadgesTable {
  id: string;
  user_id: string;
  badge_id: string;
  is_deleted: boolean;
  earned_at: Date;
  updated_at: Date | null;
}

export interface SessionsTable {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface ObservationsTable {
  id: string;
  student_id: string;
  teacher_id: string;
  notes: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface EventsTable {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: Date;
  end_time: Date;
  registration_deadline: Date | null;
  capacity: number | null;
  status: EventStatus;
  cohort_id: string;
  created_by_user_id: string;
  is_deleted: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface EventRegistrationsTable {
  id: string;
  event_id: string;
  junior_ranger_user_id: string;
  status: EventRegistrationStatus;
  registered_at: Date | null;
  cancelled_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface AnnouncementsTable {
  id: string;
  title: string;
  content: string;
  cohort_id: string;
  created_by_user_id: string;
  status: AnnouncementStatus;
  priority: AnnouncementPriority;
  is_pinned: boolean;
  is_deleted: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface ActivityPostsTable {
  id: string;
  content: string;
  image_url: string | null;
  cohort_id: string;
  created_by_user_id: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface ReactionsTable {
  id: string;
  user_id: string;
  target_type: ReactionTargetType;
  target_id: string;
  reaction_type: ReactionType;
  created_at: Date;
  updated_at: Date | null;
}

export interface ClubActivitiesTable {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cohort_id: string;
  created_by_user_id: string;
  activity_date: Date | null;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface Database {
  users: UsersTable;
  cohorts: CohortsTable;
  cohort_members: CohortMembersTable;
  adventures: AdventuresTable;
  adventure_submissions: AdventureSubmissionsTable;
  cohort_adventures: CohortAdventuresTable;
  invite_codes: InviteCodesTable;
  auth_challenges: AuthChallengesTable;
  badges: BadgesTable;
  user_badges: UserBadgesTable;
  sessions: SessionsTable;
  observations: ObservationsTable;
  events: EventsTable;
  event_registrations: EventRegistrationsTable;
  announcements: AnnouncementsTable;
  activity_posts: ActivityPostsTable;
  reactions: ReactionsTable;
  club_activities: ClubActivitiesTable;
}

