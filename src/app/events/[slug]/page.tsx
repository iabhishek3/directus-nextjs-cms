import { notFound } from "next/navigation";
import {
  getEventBySlug,
  getRegistrationCount,
} from "@/lib/directus";
import EventDetailClient from "./EventDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const registrationCount = await getRegistrationCount(event.id);
  const spotsLeft =
    event.capacity > 0 ? event.capacity - registrationCount : null;

  return (
    <EventDetailClient
      event={event}
      registrationCount={registrationCount}
      spotsLeft={spotsLeft}
    />
  );
}
