import PostFeed from "@/components/post-feed";
import { SHARE_TYPES, shareTypeFromParam } from "@/lib/posts";

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const active = shareTypeFromParam(type);

  return (
    <PostFeed
      title="Share"
      intro="Projects you've tackled and tips worth passing on to other homeowners."
      types={active ? [active] : SHARE_TYPES}
      filters={[
        { label: "All", href: "/share", active: !active },
        { label: "Projects", href: "/share?type=project", active: active === "PROJECT" },
        { label: "Tips & tricks", href: "/share?type=tip", active: active === "TIP" },
      ]}
    />
  );
}
