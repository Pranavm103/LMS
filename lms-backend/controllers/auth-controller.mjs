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
    try {
        const result = await authenticateUser(req.body);

        if (result.error) {
            return res.status(401).json({ message: result.error });
        }

        const { token, user } = result;

        // 🔥 THIS IS WHAT YOU ARE MISSING
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.json({ user });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return res.json({ message: "Logged out successfully" });
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
