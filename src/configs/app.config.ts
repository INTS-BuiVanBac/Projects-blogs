import 'dotenv/config';

export const configs = {
    key: {
        private_key: process.env.PRIVATE_KEY,
        public_key: process.env.PUBLIC_KEY,
    },

    db: {
        type: process.env.BD_TYPE,
        host: process.env.HOST,
        port: process.env.PORT,
        username: process.env.USER_NAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    },
};
