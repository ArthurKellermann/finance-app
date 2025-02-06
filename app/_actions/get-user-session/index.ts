import { clerkClient } from "@clerk/nextjs/server";

export const getUserSession = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);

  if (!user || user.id !== userId) {
    return null;
  }
  return user;
};
