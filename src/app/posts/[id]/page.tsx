import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { POST_TYPES } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import DeleteButton from "@/components/delete-button";
import { deletePost, deleteReply, setSolved } from "../actions";
import ReplyForm from "./reply-form";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });
  if (!post) notFound();

  const config = POST_TYPES[post.type];
  const isAuthor = post.authorId === user.id;
  const isHelp = post.type === "HELP";

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href={config.href} className="text-sm text-emerald-700 hover:underline">
        &larr; {config.title}
      </Link>

      <article className="mt-3 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-semibold text-slate-900">{post.title}</h1>
          {isHelp && post.solved && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              Solved
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {post.author.name} · {formatDate(post.createdAt)}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{post.body}</p>

        {isAuthor && (
          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3">
            {isHelp && (
              <form action={setSolved.bind(null, post.id, !post.solved)}>
                <button type="submit" className="text-xs font-medium text-emerald-700 hover:underline">
                  {post.solved ? "Mark as not solved" : "Mark as solved"}
                </button>
              </form>
            )}
            <DeleteButton
              action={deletePost.bind(null, post.id)}
              confirmText="Delete this post and all of its replies?"
            />
          </div>
        )}
      </article>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-slate-700">
          {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
        </h2>
        <ul className="mt-3 space-y-3">
          {post.replies.map((reply) => (
            <li key={reply.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-800">{reply.body}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {reply.author.name}
                  {reply.authorId === post.authorId && " (author)"} · {formatDate(reply.createdAt)}
                </span>
                {reply.authorId === user.id && (
                  <DeleteButton action={deleteReply.bind(null, post.id, reply.id)} />
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <ReplyForm
            postId={post.id}
            placeholder={
              isHelp && !isAuthor ? "Share what worked for you..." : "Add a reply..."
            }
          />
        </div>
      </section>
    </main>
  );
}
