"use client";

import Link from "next/link";
import styled from "styled-components";
import { Text, Card } from "@/lib/typography";
import { Color } from "@/lib/colors";
import RegistrationForm from "@/components/RegistrationForm";
import { Event, getAssetUrl, formatEventDate } from "@/lib/directus";

interface EventDetailClientProps {
  event: Event;
  registrationCount: number;
  spotsLeft: number | null;
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${Color.Neutral[7]};
`;

const HeroSection = styled.header<{ $hasImage: boolean }>`
  position: relative;
  height: ${(props) => (props.$hasImage ? "320px" : "180px")};
  background: ${(props) =>
    props.$hasImage ? "transparent" : `linear-gradient(135deg, ${Color.Primary} 0%, #1a237e 100%)`};
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 16px;
  left: 16px;
  background: white;
  color: ${Color.Neutral[1]};
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  margin-top: -80px;
  position: relative;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const EventCard = styled(Card)`
  padding: 32px;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const Badge = styled.span<{ $variant?: "category" | "price" }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;

  ${(props) =>
    props.$variant === "price"
      ? `
    background: ${props.children === "Free Event" ? Color.Neutral[6] : "#e8f5e9"};
    color: ${props.children === "Free Event" ? Color.Neutral[2] : "#2e7d32"};
  `
      : `
    background: ${Color.Primary}15;
    color: ${Color.Primary};
  `}
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 32px 0;
`;

const DetailCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${Color.Neutral[7]};
  border-radius: 12px;
`;

const DetailIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  background: ${(props) => props.$color}20;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.$color};
  flex-shrink: 0;
`;

const DetailContent = styled.div``;

const DetailLabel = styled(Text.XSmall)`
  color: ${Color.Neutral[3]};
  margin-bottom: 4px;
  display: block;
`;

const DetailValue = styled(Text.Body)`
  font-weight: 500;
  color: ${Color.Neutral[1]};
`;

const SpotsInfo = styled(Text.XSmall)`
  color: #4caf50;
  margin-top: 4px;
  display: block;
`;

const DescriptionSection = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid ${Color.Neutral[5]};
`;

const DescriptionContent = styled.div`
  color: ${Color.Neutral[2]};
  line-height: 1.7;

  ul,
  ol {
    margin: 16px 0;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
  }
`;

const SidebarContainer = styled.div`
  position: sticky;
  top: 24px;
`;

export default function EventDetailClient({
  event,
  registrationCount,
  spotsLeft,
}: EventDetailClientProps) {
  const imageUrl = getAssetUrl(event.image);

  return (
    <PageContainer>
      <HeroSection $hasImage={!!imageUrl}>
        {imageUrl && (
          <>
            <HeroImage src={imageUrl} alt={event.title} />
            <HeroOverlay />
          </>
        )}
        <BackButton href="/events">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </BackButton>
      </HeroSection>

      <MainContent>
        <ContentGrid>
          <EventCard>
            <BadgeRow>
              {event.category && <Badge $variant="category">{event.category}</Badge>}
              <Badge $variant="price">
                {event.price > 0 ? `$${event.price}` : "Free Event"}
              </Badge>
            </BadgeRow>

            <Text.H1>{event.title}</Text.H1>

            <DetailsGrid>
              <DetailCard>
                <DetailIcon $color={Color.Primary}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Date & Time</DetailLabel>
                  <DetailValue>{formatEventDate(event.date)}</DetailValue>
                </DetailContent>
              </DetailCard>

              {event.location && (
                <DetailCard>
                  <DetailIcon $color="#9c27b0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Location</DetailLabel>
                    <DetailValue>{event.location}</DetailValue>
                  </DetailContent>
                </DetailCard>
              )}

              {event.capacity > 0 && (
                <DetailCard>
                  <DetailIcon $color="#ff9800">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Capacity</DetailLabel>
                    <DetailValue>
                      {registrationCount} / {event.capacity} registered
                    </DetailValue>
                    {spotsLeft !== null && spotsLeft > 0 && (
                      <SpotsInfo>{spotsLeft} spots left</SpotsInfo>
                    )}
                  </DetailContent>
                </DetailCard>
              )}
            </DetailsGrid>

            {event.description && (
              <DescriptionSection>
                <Text.H3 style={{ marginBottom: 16 }}>About this Event</Text.H3>
                <DescriptionContent
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </DescriptionSection>
            )}
          </EventCard>

          <SidebarContainer>
            <RegistrationForm
              eventId={event.id}
              eventTitle={event.title}
              spotsLeft={spotsLeft}
            />
          </SidebarContainer>
        </ContentGrid>
      </MainContent>
    </PageContainer>
  );
}
