import { redirect } from "next/navigation";
import PostFeed from "@/components/post-feed";

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  // Tips used to live here as a filter; they have their own tab now.
  if ((await searchParams).type === "tip") redirect("/tips");

  return (
    <PostFeed
      title="Share"
      intro="Show off what you've built, fixed, or remodeled — and how you did it."
      types={["PROJECT"]}
    />
  );
}
