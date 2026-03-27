"use client";

import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { Text, Button } from "@/lib/typography";
import { Color } from "@/lib/colors";
import { Event, HeroSection, getAssetUrl } from "@/lib/directus";

interface HomeClientProps {
  events: Event[];
  hero: HeroSection | null;
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${Color.Background.White};
`;

// Hero Section Styles
const HeroSectionContainer = styled.section`
  background: ${Color.Background.Cream};
  padding: 60px 0;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroTextContent = styled.div``;

const HeroTitle = styled.h1`
  font-size: 42px;
  font-weight: 700;
  color: ${Color.Neutral[1]};
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: ${Color.Neutral[2]};
  margin-bottom: 24px;
  line-height: 1.6;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${Color.Primary};
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: ${Color.PrimaryDark};
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const HeroImageContainer = styled.div`
  position: relative;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${Color.Primary}20 0%, ${Color.Accent.Yellow}20 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Color.Neutral[4]};
`;

// Happenings Section Styles
const HappeningsSection = styled.section`
  padding: 64px 0;
  background: ${Color.Background.White};
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const SectionHeader = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${Color.Neutral[1]};
  margin-bottom: 8px;
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: ${Color.Neutral[3]};
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

// Event Card Styles
const EventCard = styled(Link)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardImage = styled.div`
  position: relative;
  height: 180px;
  background: ${Color.Neutral[6]};
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${Color.Accent.Yellow};
  color: ${Color.Neutral[1]};
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${Color.Neutral[1]};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const CardMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${Color.Neutral[3]};

  svg {
    flex-shrink: 0;
    color: ${Color.Neutral[4]};
  }
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid ${Color.Neutral[6]};
`;

const CardTag = styled.span`
  font-size: 11px;
  color: ${Color.Neutral[3]};
  background: ${Color.Neutral[7]};
  padding: 4px 8px;
  border-radius: 4px;
`;

const ViewAllLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 40px;
  color: ${Color.Neutral[2]};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: ${Color.Primary};
  }
`;

// Marquee Styles
const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const MarqueeSection = styled.section`
  background: ${Color.Accent.Yellow};
  padding: 16px 0;
  overflow: hidden;
`;

const MarqueeTrack = styled.div`
  display: flex;
  animation: ${scroll} 20s linear infinite;
`;

const MarqueeContent = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const MarqueeText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${Color.Neutral[1]};
  padding: 0 24px;
`;

const MarqueeDot = styled.span`
  width: 8px;
  height: 8px;
  background: ${Color.Neutral[1]};
  border-radius: 50%;
`;

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: ${Color.Neutral[7]};
  border-radius: 12px;
`;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HomeClient({ events, hero }: HomeClientProps) {
  const heroTitle = hero?.title || "What does your future look like?";
  const heroSubtitle = hero?.subtitle || "Whether you already know what the future holds, or figuring it out, DISCOVER has the resources for you";
  const buttonText = hero?.button_text || "Personalise your journey";
  const buttonLink = hero?.button_link || "/events";
  const backgroundImage = getAssetUrl(hero?.background_image);

  const marqueeItems = ["career", "happenings", "mentors"];

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSectionContainer>
        <HeroContent>
          <HeroTextContent>
            <HeroTitle>{heroTitle}</HeroTitle>
            <HeroSubtitle>{heroSubtitle}</HeroSubtitle>
            <HeroButton href={buttonLink}>
              {buttonText}
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </HeroButton>
          </HeroTextContent>

          <HeroImageContainer>
            {backgroundImage ? (
              <HeroImage src={backgroundImage} alt={heroTitle} />
            ) : (
              <HeroImagePlaceholder>
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </HeroImagePlaceholder>
            )}
          </HeroImageContainer>
        </HeroContent>
      </HeroSectionContainer>

      {/* Happenings Section */}
      <HappeningsSection>
        <SectionContent>
          <SectionHeader>
            <SectionTitle>Happenings</SectionTitle>
            <SectionSubtitle>
              Looking for a new skill? or want to test out a job role? DISCOVER&apos;s upcoming happenings has something for everyone
            </SectionSubtitle>
          </SectionHeader>

          {events.length > 0 ? (
            <>
              <EventsGrid>
                {events.slice(0, 3).map((event) => (
                  <EventCard key={event.id} href={`/events/${event.slug}`}>
                    <CardImage>
                      {getAssetUrl(event.image) ? (
                        <CardImg src={getAssetUrl(event.image)!} alt={event.title} />
                      ) : (
                        <HeroImagePlaceholder>
                          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </HeroImagePlaceholder>
                      )}
                      {event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual") ? (
                        <CardBadge>Virtual</CardBadge>
                      ) : event.category ? (
                        <CardBadge>{event.category}</CardBadge>
                      ) : null}
                    </CardImage>
                    <CardContent>
                      <CardTitle>{event.title}</CardTitle>
                      <CardMeta>
                        <CardMetaItem>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.date)}
                        </CardMetaItem>
                        {event.location && (
                          <CardMetaItem>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </CardMetaItem>
                        )}
                      </CardMeta>
                      {event.category && (
                        <CardTags>
                          <CardTag>{event.category}</CardTag>
                        </CardTags>
                      )}
                    </CardContent>
                  </EventCard>
                ))}
              </EventsGrid>
              <ViewAllLink href="/events">
                View {events.length} happenings
              </ViewAllLink>
            </>
          ) : (
            <EmptyState>
              <Text.H3>No Upcoming Events</Text.H3>
              <Text.Body style={{ color: Color.Neutral[3], marginTop: 8 }}>
                Check back soon for exciting happenings!
              </Text.Body>
            </EmptyState>
          )}
        </SectionContent>
      </HappeningsSection>

      {/* Marquee Section */}
      <MarqueeSection>
        <MarqueeTrack>
          <MarqueeContent>
            {[...Array(6)].map((_, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                {marqueeItems.map((item, j) => (
                  <span key={`${i}-${j}`} style={{ display: "flex", alignItems: "center" }}>
                    <MarqueeText>{item}</MarqueeText>
                    <MarqueeDot />
                  </span>
                ))}
              </span>
            ))}
          </MarqueeContent>
          <MarqueeContent>
            {[...Array(6)].map((_, i) => (
              <span key={`dup-${i}`} style={{ display: "flex", alignItems: "center" }}>
                {marqueeItems.map((item, j) => (
                  <span key={`dup-${i}-${j}`} style={{ display: "flex", alignItems: "center" }}>
                    <MarqueeText>{item}</MarqueeText>
                    <MarqueeDot />
                  </span>
                ))}
              </span>
            ))}
          </MarqueeContent>
        </MarqueeTrack>
      </MarqueeSection>
    </PageContainer>
  );
}
