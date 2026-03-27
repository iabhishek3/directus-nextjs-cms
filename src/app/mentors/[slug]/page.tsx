import { getMentorBySlug, getMentorRegistrationCount } from "@/lib/directus";
import { notFound } from "next/navigation";
import MentorDetailClient from "./MentorDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MentorDetailPage({ params }: Props) {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);

  if (!mentor) {
    notFound();
  }

  const registrationCount = await getMentorRegistrationCount(mentor.id);

  return <MentorDetailClient mentor={mentor} registrationCount={registrationCount} />;
}
