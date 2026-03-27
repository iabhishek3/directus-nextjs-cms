import { getEvents, getCategories } from "@/lib/directus";
import EventsClient from "./EventsClient";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const [events, categories] = await Promise.all([
    getEvents({ category: selectedCategory }),
    getCategories(),
  ]);

  return (
    <EventsClient
      events={events}
      categories={categories}
      selectedCategory={selectedCategory}
    />
  );
}
