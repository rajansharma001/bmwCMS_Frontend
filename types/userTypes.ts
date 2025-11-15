export interface UserTypes {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profileImg?: string;
  password?: string;
  role?: "admin" | "user";
  isVerified?: boolean;
  isSuspend?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
