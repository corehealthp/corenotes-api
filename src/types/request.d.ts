declare global {
    namespace Express {
        interface Request {
            currentUser: {
                id?:string;
                staffObjectId?:string;
                staffId?:string;
                email?:string;
                firstname?:string;
                role?:string;
                cookie?:string;
            }
        }
    }
}

export {};