import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { ApiError } from "../../common/api-error";
import { CreateUserInput, LoginUserInput } from "./auth.schema";

const publicUserSelect = {
    id: true,
    username: true,
    email: true,
    createdAt: true,
    updatedAt: true,
} as const;

type PublicUserRow = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

const toPublicUser = (user: PublicUserRow) => ({
    _id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const registerUser = async ({ username, email, password }: CreateUserInput) => {
    // Hashing lives here (not in a model hook): Prisma has no lifecycle
    // hooks, and an explicit hash in the service is easier to audit anyway.
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword },
            select: publicUserSelect,
        });

        return toPublicUser(user);
    } catch (e) {
        // The unique constraint is the authority — no check-then-insert race
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            throw new ApiError(409, `User with email ${email} already exists`);
        }
        throw e;
    }
};

export const loginUser = async ({ email, password }: LoginUserInput) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    return toPublicUser(user);
};

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: publicUserSelect,
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return toPublicUser(user);
};
