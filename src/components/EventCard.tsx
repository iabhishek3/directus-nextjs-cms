"use client";

import Link from "next/link";
import styled from "styled-components";
import { Card, Text } from "@/lib/typography";
import { Color } from "@/lib/colors";
import { Event, getAssetUrl, formatShortDate } from "@/lib/directus";

interface EventCardProps {
  event: Event;
}

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
`;

const CardContainer = styled(Card)`
  height: 100%;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 180px;
  background: ${Color.Neutral[6]};
  overflow: hidden;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Color.Neutral[4]};
`;

const Badge = styled.span<{ $variant?: "category" | "price" }>`
  position: absolute;
  top: 12px;
  ${(props) => (props.$variant === "price" ? "right: 12px;" : "left: 12px;")}
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) =>
    props.$variant === "price" ? "white" : Color.Primary};
  color: ${(props) => (props.$variant === "price" ? Color.Neutral[1] : "white")};
`;

const Content = styled.div`
  padding: 20px;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: ${Color.Primary};
`;

const Title = styled(Text.H4)`
  margin-bottom: 8px;
  color: ${Color.Neutral[1]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${Color.Neutral[3]};
  font-size: 14px;
  margin-bottom: 16px;
`;

const Footer = styled.div`
  padding-top: 16px;
  border-top: 1px solid ${Color.Neutral[5]};
  display: flex;
  align-items: center;
  color: ${Color.Primary};
  font-weight: 500;
  font-size: 14px;
`;

export default function EventCard({ event }: EventCardProps) {
  const imageUrl = getAssetUrl(event.image);

  return (
    <StyledLink href={`/events/${event.slug}`}>
      <CardContainer>
        <ImageContainer>
          {imageUrl ? (
            <EventImage src={imageUrl} alt={event.title} />
          ) : (
            <PlaceholderIcon>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </PlaceholderIcon>
          )}
          {event.category && <Badge $variant="category">{event.category}</Badge>}
          <Badge $variant="price">
            {event.price > 0 ? `$${event.price}` : "Free"}
          </Badge>
        </ImageContainer>

        <Content>
          <DateRow>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <Text.XSmall $weight="semibold">{formatShortDate(event.date)}</Text.XSmall>
          </DateRow>

          <Title>{event.title}</Title>

          {event.location && (
            <LocationRow>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </LocationRow>
          )}

          <Footer>
            View Details
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginLeft: 4 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Footer>
        </Content>
      </CardContainer>
    </StyledLink>
  );
}
