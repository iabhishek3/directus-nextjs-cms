import { getMentors } from "@/lib/directus";
import MentorsClient from "./MentorsClient";

export const dynamic = "force-dynamic";

export default async function MentorsPage() {
  const mentors = await getMentors();

  return <MentorsClient mentors={mentors} />;
}
