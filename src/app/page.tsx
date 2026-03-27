import { getUpcomingEvents, getHeroSection } from "@/lib/directus";
import HomeClient from "./HomeClient";

// Don't cache - always fetch fresh data from CMS
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, hero] = await Promise.all([
    getUpcomingEvents(6),
    getHeroSection(),
  ]);

  return <HomeClient events={events} hero={hero} />;
}
