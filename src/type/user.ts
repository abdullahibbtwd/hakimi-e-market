export interface User {
    id: string;
    email: string;
    password?: string;  
    name: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
}

export enum UserRole {
    USER = 'USER', 
    ADMIN = 'ADMIN',

}