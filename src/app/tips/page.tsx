import { redirect } from "next/navigation";

export default function TipsPage() {
  redirect("/share?type=tip");
}
