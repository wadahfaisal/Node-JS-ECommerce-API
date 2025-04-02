import { UserDocument } from "../models/User";

export const createTokenUser = (user: UserDocument) => {
  return { name: user.name, userId: user._id as string, role: user.role };
};

// module.exports = createTokenUser;
