export type UserRole = 'admin' | 'ranger' | 'junior_ranger';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type CohortMemberRole = 'ranger' | 'junior_ranger';

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

export interface Database {
  users: UsersTable;
  cohorts: CohortsTable;
  cohort_members: CohortMembersTable;
}