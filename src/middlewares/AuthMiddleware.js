import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";
import jwt from "jsonwebtoken";

const adminMiddleware = async (req, res, next) => {
  const { userId } = await getAuth(req);
  const role = (await clerkClient.users.getUser(userId)).publicMetadata.role;
  if (role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export default adminMiddleware;
