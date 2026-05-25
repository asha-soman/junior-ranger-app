import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface InviteCodeTable {
  id: Generated<string>;
  cohortId: string;
  code: string;
  expiryDate: Date;
  maxUsage: number;
  usedCount: Generated<number>;
  active: Generated<boolean>;
  createdAt: Generated<Date>;
  createdBy: string;
}

export type InviteCode = Selectable<InviteCodeTable>;
export type NewInviteCode = Insertable<InviteCodeTable>;
export type InviteCodeUpdate = Updateable<InviteCodeTable>;
