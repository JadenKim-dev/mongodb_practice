import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  avatar?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
});

const User = model<IUser>('User', userSchema);

const user = new User({
    email: 'user@ddd',
    name: 'user',
});
await user.save();
