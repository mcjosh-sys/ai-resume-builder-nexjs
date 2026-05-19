"use server";

import { AppError } from "@/lib/errors";
import { auth } from "@clerk/nextjs/server";
import { utapi } from "../uploadthing";

export async function getUserId<T extends boolean = false>(
  safe?: T,
): Promise<string | (T extends true ? null : never)> {
  const { userId } = await auth();
  if (!userId) {
    if (safe) return null as T extends true ? null : never;
    throw new AppError("Unauthorized", { status: 401 });
  }
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
