export interface Role{

    userId? : number | null,
    role: ERole
}

export enum ERole{
    ADMIN = 'ADMIN',
    ORGANIZER = 'ORGANIZER',
    PARTICIPANT = 'PARTICIPANT',
}