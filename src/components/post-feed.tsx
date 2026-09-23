import Link from "next/link";
import type { PostType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { POST_TYPES } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import NewPostForm from "./new-post-form";

export default async function PostFeed({ type }: { type: PostType }) {
  const config = POST_TYPES[type];
  const isHelp = type === "HELP";

  const posts = await prisma.post.findMany({
    where: { type },
    // Unanswered questions float to the top of the Help tab.
    orderBy: isHelp ? [{ solved: "asc" }, { createdAt: "desc" }] : { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { replies: true } },
    },
    take: 100,
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-900">{config.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{config.intro}</p>

      <div className="mt-4">
        <NewPostForm type={type} config={config} />
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          No {config.singular}s yet — be the first to post one.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900">{post.title}</p>
                  {isHelp && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.solved
                          ? "bg-emerald-100 text-emerald-800"
                          : post._count.replies === 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {post.solved ? "Solved" : post._count.replies === 0 ? "Needs help" : "Open"}
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.body}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {post.author.name} · {formatDate(post.createdAt)} ·{" "}
                  {post._count.replies} {post._count.replies === 1 ? "reply" : "replies"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
