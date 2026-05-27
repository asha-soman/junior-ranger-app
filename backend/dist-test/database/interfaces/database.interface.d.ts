import { UserTable } from '../../modules/users/interfaces/user.interface';
import { CohortTable } from '../../modules/cohorts/interfaces/cohort.interface';
import { InviteCodeTable } from '../../modules/cohorts/interfaces/invite-code.interface';
import { CohortMemberTable } from '../../modules/cohorts/interfaces/cohort-member.interface';
export interface Database {
    users: UserTable;
    cohorts: CohortTable;
    invite_codes: InviteCodeTable;
    cohort_members: CohortMemberTable;
}
