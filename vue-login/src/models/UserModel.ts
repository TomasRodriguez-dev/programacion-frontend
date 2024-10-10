export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    remember?: boolean;
    isAdmin: boolean;
    jwtToken?: string;
    refreshTokens: string[];
}
