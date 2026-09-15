import { IsIn, IsUUID } from 'class-validator';

export class SetReactionDto {
    @IsIn([
        'announcement',
        'event',
        'activity_post',
        'club_activity',
    ])
    target_type!:
        | 'announcement'
        | 'event'
        | 'activity_post'
        | 'club_activity';

    @IsUUID()
    target_id!: string;

    @IsIn([
        'clap',
        'thumbs_up',
        'star',
        'smile',
        'wow',
        'okay',
    ])
    reaction_type!:
        | 'clap'
        | 'thumbs_up'
        | 'star'
        | 'smile'
        | 'wow'
        | 'okay';
}