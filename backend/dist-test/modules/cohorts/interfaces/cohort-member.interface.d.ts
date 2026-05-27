import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import { UserRole } from '../../../common/enums/user-role.enum';
export interface CohortMemberTable {
    id: Generated<string>;
    userId: string;
    cohortId: string;
    role: UserRole;
    createdAt: Generated<Date>;
}
export type CohortMember = Selectable<CohortMemberTable>;
export type NewCohortMember = Insertable<CohortMemberTable>;
export type CohortMemberUpdate = Updateable<CohortMemberTable>;
