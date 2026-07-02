import bcrypt from "bcryptjs";
import { ApiError } from "../../common/api-error";
import { User } from "./user.model";
import { CreateUserInput, LoginUserInput } from "./auth.schema";

type UserDocument = InstanceType<typeof User>;

const toPublicUser = (user: UserDocument) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
});

export const registerUser = async ({ username, email, password }: CreateUserInput) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, `User with email ${email} already exists`);
    }

    const user = await User.create({ username, email, password });

    return toPublicUser(user);
};

export const loginUser = async ({ email, password }: LoginUserInput) => {
    const user = await User.findOne({ email });

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
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};
