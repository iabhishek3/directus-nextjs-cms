"use client";

import Link from "next/link";
import styled from "styled-components";
import { Text } from "@/lib/typography";
import { Color } from "@/lib/colors";
import EventCard from "@/components/EventCard";
import { Event, Category } from "@/lib/directus";

interface EventsClientProps {
  events: Event[];
  categories: Category[];
  selectedCategory?: string;
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${Color.Neutral[7]};
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid ${Color.Neutral[5]};
  padding: 32px 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const BackLink = styled(Link)`
  color: ${Color.Primary};
  text-decoration: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const FilterSection = styled.div`
  margin-bottom: 32px;
`;

const FilterLabel = styled(Text.XSmall)`
  color: ${Color.Neutral[3]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  display: block;
`;

const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterTag = styled(Link)<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  ${(props) =>
    props.$active
      ? `
    background: ${Color.Primary};
    color: white;
  `
      : `
    background: white;
    color: ${Color.Neutral[2]};
    border: 1px solid ${Color.Neutral[5]};

    &:hover {
      border-color: ${Color.Primary};
      color: ${Color.Primary};
    }
  `}
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid ${Color.Neutral[5]};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${Color.Neutral[6]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: ${Color.Neutral[4]};
`;

export default function EventsClient({
  events,
  categories,
  selectedCategory,
}: EventsClientProps) {
  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackLink href="/">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </BackLink>
          <Text.H1>All Events</Text.H1>
          <Text.Body style={{ color: Color.Neutral[3], marginTop: 8 }}>
            Discover and register for upcoming events
          </Text.Body>
        </HeaderContent>
      </Header>

      <MainContent>
        {categories.length > 0 && (
          <FilterSection>
            <FilterLabel $weight="semibold">Filter by Category</FilterLabel>
            <FilterTags>
              <FilterTag href="/events" $active={!selectedCategory}>
                All
              </FilterTag>
              {categories.map((cat) => (
                <FilterTag
                  key={cat.id}
                  href={`/events?category=${cat.slug}`}
                  $active={selectedCategory === cat.slug}
                >
                  {cat.name}
                </FilterTag>
              ))}
            </FilterTags>
          </FilterSection>
        )}

        {events.length > 0 ? (
          <EventsGrid>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </EventsGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </EmptyIcon>
            <Text.H3>No Events Found</Text.H3>
            <Text.Body style={{ color: Color.Neutral[3], marginTop: 8, maxWidth: 400, margin: "8px auto 0" }}>
              {selectedCategory
                ? "No events found in this category. Try selecting a different category."
                : "There are no events available at the moment. Check back soon!"}
            </Text.Body>
            {selectedCategory && (
              <Link href="/events" style={{ color: Color.Primary, marginTop: 16, display: "inline-block" }}>
                View all events
              </Link>
            )}
          </EmptyState>
        )}
      </MainContent>
    </PageContainer>
  );
}
