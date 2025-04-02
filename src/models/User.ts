import { Document, model, Schema } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface UserDocument extends IUser, Document {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: (value: string) => isEmail(value),
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  this.isModified();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  canditatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export const User = model<UserDocument>("User", UserSchema);
