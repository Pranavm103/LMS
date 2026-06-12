import User from "../models/users.mjs";
import { isConnected } from "../config/db.mjs";
import { hash, compare } from "bcrypt";
const SALT_ROUNDS = 10;
import { generateToken } from "./jwt-service.mjs";
import chalk from "chalk";
export async function createUser(user) {
    try {
        if (!isConnected()) {
            return { error: "Database is not connected. Please start MongoDB and try again.", status: 503 };
        }

        const normalizedUser = normalizeUser(user);
        const validationError = validateUser(normalizedUser);
        if (validationError) {
            return { error: validationError, status: 400 };
        }

        await User.init(); // ensure index is built - duplicate emails will not be allowed
        const newUser = await User.create({ ...normalizedUser, password: await hashPassword(normalizedUser.password) });
        return { error: null, user: newUser }
    } catch (ex) {
        if (ex.code === 11000) {
            return { error: "Email already exists", status: 409 };
        }

        return { error: ex.message, status: 400 };
    }
}

function normalizeUser(user = {}) {
    return {
        firstName: user.firstName?.trim(),
        lastName: user.lastName?.trim(),
        email: user.email?.trim().toLowerCase(),
        password: user.password,
        role: user.role || "student",
    };
}

function validateUser(user) {
    if (!user.firstName) {
        return "First name is required";
    }

    if (!user.lastName) {
        return "Last name is required";
    }

    if (!user.email) {
        return "Email is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        return "Enter a valid email address";
    }

    if (!user.password) {
        return "Password is required";
    }

    if (user.password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    if (!["student", "instructor"].includes(user.role)) {
        return "Select a valid role";
    }

    return null;
}

function hashPassword(password) {
    if (password) {
        return hash(password, SALT_ROUNDS)
    } else {
        throw new Error("Password not found")
    }
}

export async function authenticateUser(credentials) {
    const { email, password } = credentials;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return { error: 'Invalid username or password!' };
    }

    const validUser = await compare(password, existingUser.password);
    if (validUser) {
        try {
            const { firstName, lastName, role, _id: id } = existingUser;
            const token = await generateToken({
                email, firstName, lastName,
                id, role
            });
            return { user: { email, role, id, firstName, lastName }, token };
        } catch (ex) {
            console.error(chalk.redBright(ex));
            return { error: "Error while generating token" }
        }
    } else {
        return { error: 'Invalid username or password!' };
    }
}

export async function resetPassword({ email, password }) {
    try {
        if (!isConnected()) {
            return { error: "Database is not connected. Please start MongoDB and try again.", status: 503 };
        }

        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail) {
            return { error: "Email is required", status: 400 };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return { error: "Enter a valid email address", status: 400 };
        }

        if (!password) {
            return { error: "Password is required", status: 400 };
        }

        if (password.length < 8) {
            return { error: "Password must be at least 8 characters long", status: 400 };
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return { error: "No account found with that email", status: 404 };
        }

        user.password = await hashPassword(password);
        await user.save();

        return { message: "Password reset successfully" };
    } catch (ex) {
        return { error: ex.message, status: 400 };
    }
}

// export async function logout(req, res) {
//     await logoutUser(req.user.username, { token: null });
//     res.send({ message: "User logged out successfully!" })
// }
