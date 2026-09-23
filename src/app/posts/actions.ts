"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, formText, type FormState } from "@/lib/session";
import { POST_TYPES, isPostType } from "@/lib/posts";

export async function createPost(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const type = formText(formData, "type");
  const title = formText(formData, "title");
  const body = formText(formData, "body");

  if (!isPostType(type)) return { error: "Unknown post type." };
  if (!title || !body) return { error: "A title and some details are required." };

  const post = await prisma.post.create({
    data: { type, title, body, authorId: user.id },
  });

  revalidatePath(POST_TYPES[type].href);
  redirect(`/posts/${post.id}`);
}

export async function addReply(
  postId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();
  const body = formText(formData, "body");
  if (!body) return { error: "Write a reply first." };

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { type: true } });
  if (!post) return { error: "This post no longer exists." };

  await prisma.reply.create({ data: { postId, authorId: user.id, body } });

  revalidatePath(`/posts/${postId}`);
  revalidatePath(POST_TYPES[post.type].href);
  return { success: true };
}

export async function setSolved(postId: string, solved: boolean) {
  const user = await requireUser();
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== user.id) {
    throw new Error("Only the author can change this.");
  }
  await prisma.post.update({ where: { id: postId }, data: { solved } });
  revalidatePath(`/posts/${postId}`);
  revalidatePath(POST_TYPES[post.type].href);
}

export async function deletePost(postId: string) {
  const user = await requireUser();
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return;
  if (post.authorId !== user.id) {
    throw new Error("Only the author can delete this post.");
  }
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath(POST_TYPES[post.type].href);
  redirect(POST_TYPES[post.type].href);
}

export async function deleteReply(postId: string, replyId: string) {
  const user = await requireUser();
  const reply = await prisma.reply.findUnique({ where: { id: replyId } });
  if (!reply) return;
  if (reply.authorId !== user.id) {
    throw new Error("Only the author can delete this reply.");
  }
  await prisma.reply.delete({ where: { id: replyId } });
  revalidatePath(`/posts/${postId}`);
}
