import type { PostType } from "@prisma/client";

export type PostTypeConfig = {
  // Where this type's posts are listed, and the tab path to revalidate.
  href: string;
  feedPath: string;
  title: string;
  intro: string;
  newLabel: string;
  titlePlaceholder: string;
  bodyPlaceholder: string;
};

export const POST_TYPES: Record<PostType, PostTypeConfig> = {
  PROJECT: {
    href: "/share?type=project",
    feedPath: "/share",
    title: "Projects",
    intro: "Show off what you've built, fixed, or remodeled — and how you did it.",
    newLabel: "Share a project",
    titlePlaceholder: "Refinished our deck in a weekend",
    bodyPlaceholder: "What you did, materials used, what you'd do differently...",
  },
  TIP: {
    href: "/share?type=tip",
    feedPath: "/share",
    title: "Tips & tricks",
    intro: "Quick wins and hard-earned lessons from other homeowners.",
    newLabel: "Share a tip",
    titlePlaceholder: "Write the filter size on the furnace with a Sharpie",
    bodyPlaceholder: "Explain the tip and why it helps...",
  },
  HELP: {
    href: "/help",
    feedPath: "/help",
    title: "Help",
    intro: "Stuck on something? Ask the community — or lend a hand to a neighbor.",
    newLabel: "Ask for help",
    titlePlaceholder: "Breaker keeps tripping when the microwave runs",
    bodyPlaceholder: "Describe the problem, what you've tried, and any details (age of house, model #s)...",
  },
};

// The Share tab lists these types together, filterable by ?type=project|tip.
export const SHARE_TYPES = ["PROJECT", "TIP"] as const satisfies readonly PostType[];

export function shareTypeFromParam(param?: string) {
  if (param === "project") return "PROJECT";
  if (param === "tip") return "TIP";
  return undefined;
}

export function isPostType(value: string): value is PostType {
  return value in POST_TYPES;
}
