"use server";

import { AppError } from "@/lib/errors";
import { auth } from "@clerk/nextjs/server";
import { utapi } from "./uploadthing";

export async function getUserId() {
  const { userId } = await auth();
  if (!userId) throw new AppError("Unauthorized");
  return userId;
}

export async function uploadImage(file: File, userId: string) {
  const result = await utapi.uploadFiles(file);
  return result.data?.ufsUrl;
}

export async function deleteImage(userId: string) {
  const result = await utapi.deleteFiles(userId);
  return result;
}
