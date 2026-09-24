import PostFeed from "@/components/post-feed";
import { POST_TYPES } from "@/lib/posts";

export default function TipsPage() {
  return <PostFeed title={POST_TYPES.TIP.title} intro={POST_TYPES.TIP.intro} types={["TIP"]} />;
}
