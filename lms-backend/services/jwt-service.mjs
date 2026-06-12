import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_KEY || process.env.JWT_SECRET;
const TOKEN_VALIDITY = process.env.TOKEN_VALIDITY || "1d";

function getJwtSecret() {
    if (!JWT_SECRET) {
        throw new Error("JWT secret is not configured");
    }

    return JWT_SECRET;
}

export function generateToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_VALIDITY }, (error, token) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })
    });
}

export function validateToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getJwtSecret(), (error, userInfo) => {
            if (error) {
                reject(error);
            } else {
                resolve(userInfo)
            }
        })

    })
}
