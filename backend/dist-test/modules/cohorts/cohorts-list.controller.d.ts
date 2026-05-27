import { Kysely } from 'kysely';
import { Database } from '../../database/interfaces/database.interface';
export declare class CohortsListController {
    private readonly db;
    constructor(db: Kysely<Database>);
    getCohorts(): Promise<{
        id: string;
        name: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        location: string | null;
        assignedRangerId: string | null;
        createdByRangerId: string | null;
        imageUrl: string | null;
    }[]>;
}
