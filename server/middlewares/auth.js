import { getAuth } from "@clerk/express";

const authUser = (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
    }

    // Attach Clerk user ID to request
    req.user = { clerkId: userId };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authUser;
