import { authenticateUser, createUser, resetPassword } from "../services/auth-service.mjs";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: Boolean(process.env.SECURE), // true in case of https,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: Boolean(process.env.SECURE) ? "none" : "lax"
}

export async function registerUser(req, res) {
    const { error, status } = await createUser(req.body);
    if (error) {
        res.status(status || 400).json({ message: error });
    } else {
        res.json({ message: "User saved" })
    }
}

export async function login(req, res) {

    const { error, user, token } = await authenticateUser(req.body);
    if (token) {
        res.cookie('token', token, COOKIE_OPTIONS);
        res.send(user);
    } else {
        res.status(401).send({ message: error ?? "Unauthorized user!" })
    }
}

export async function logout(req, res) {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({ message: "Logged out" });
}

export async function forgotPassword(req, res) {
    const { error, message, status } = await resetPassword(req.body);
    if (error) {
        res.status(status || 400).json({ message: error });
    } else {
        res.json({ message });
    }
}

export async function me(req, res) {
    const { email, firstName, lastName, id, role } = req.user;
    res.json({ email, firstName, lastName, id, role });
}
