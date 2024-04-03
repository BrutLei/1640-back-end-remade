require('dotenv').config();

export const secret_key = process.env.PRIVATE_KEY;
export const secret_refresh_key = process.env.PRIVATE_REFRESH_KEY;
export const expiresIn = '6h';
