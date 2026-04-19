export enum UserRole {
  Professor = 'professor',
  Student = 'student',
}

export interface User {
  id: string;
  email: string;
  hashed_password: string;
  role: UserRole;
  name?: string;
  department?: string;
}

// Added only for testing purposes
export const USERS: User[] = [
  //   {
  //     id: '221091750079',
  //     email: 'dhimasdekananta@unpam.com',
  //     hashed_password:
  //       '$2b$10$.MftzcPPsR5TUTYRyWGyQu9H9Fd3Q6olBlccI1qIAY3qXH7OQ.bQO',
  //     role: UserRole.Student,
  //     name: 'Dhimas Dekananta',
  //     department: 'System Informatics',
  //   },
  //   {
  //     id: '0000001',
  //     email: 'rimasyaayujaeningsih@unpam.com',
  //     hashed_password:
  //       '$2b$10$.MftzcPPsR5TUTYRyWGyQu9H9Fd3Q6olBlccI1qIAY3qXH7OQ.bQO',
  //     role: UserRole.Professor,
  //     name: 'RIMASYA AYU JAENINGSIH',
  //     department: 'System Informatics',
  //   },
];
