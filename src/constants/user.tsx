export type UserData = {
    id:string;
    email: string;
    restaurant_id: string;
    last_name: string;
    first_name: string;
    role: string;
    password:string;
};

export class User {
    private data: UserData;

    constructor(userData: UserData) {
        this.data = userData;
    }

    static createNewUser(data: UserData): User {
        return new User(data);
    }

    getUserData(): UserData {
        return this.data;
    }
}
