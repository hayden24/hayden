import PostFeed from "@/components/post-feed";
import { POST_TYPES } from "@/lib/posts";

export default function HelpPage() {
  return <PostFeed title={POST_TYPES.HELP.title} intro={POST_TYPES.HELP.intro} types={["HELP"]} />;
}
