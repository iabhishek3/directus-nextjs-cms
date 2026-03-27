"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Color } from "@/lib/colors";
import { Mentor, getAssetUrl } from "@/lib/directus";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fef3e2 0%, #fae8c8 100%);
  padding: 48px 24px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${Color.Neutral[1]};
  margin-bottom: 24px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 10px 16px;
  border: 1px solid ${Color.Neutral[5]};
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: ${Color.Neutral[2]};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${Color.Primary};
  }
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: ${Color.Neutral[1]};
    color: white;
    &:hover {
      background: ${Color.Neutral[2]};
    }
  `
      : `
    background: white;
    color: ${Color.Neutral[2]};
    border: 1px solid ${Color.Neutral[5]};
    &:hover {
      border-color: ${Color.Neutral[4]};
    }
  `}
`;

const ResultsCount = styled.div`
  font-size: 14px;
  color: ${Color.Neutral[3]};
  margin-bottom: 24px;
`;

const MentorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const MentorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const MentorHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background: ${Color.Neutral[6]};
`;

const AvatarPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${Color.Primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
`;

const MentorInfo = styled.div`
  flex: 1;
`;

const MentorName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${Color.Neutral[1]};
  margin-bottom: 4px;
`;

const MentorTitle = styled.div`
  font-size: 14px;
  color: ${Color.Neutral[3]};
`;

const Bio = styled.p`
  font-size: 14px;
  color: ${Color.Neutral[2]};
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ExpertiseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 60px;
`;

const Tag = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${Color.Cream};
  color: ${Color.Neutral[2]};
  border: 1px solid ${Color.Neutral[5]};
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${Color.Neutral[6]};
`;

const ViewProfileButton = styled(Link)`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  background: white;
  color: ${Color.Neutral[2]};
  border: 1px solid ${Color.Neutral[4]};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Color.Neutral[3]};
    background: ${Color.Neutral[7]};
  }
`;

const ConnectButton = styled(Link)`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  background: ${Color.Neutral[1]};
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: ${Color.Neutral[2]};
  }
`;

interface Props {
  mentors: Mentor[];
}

export default function MentorsClient({ mentors }: Props) {
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");

  // Get all unique expertise tags
  const allExpertiseTags = useMemo(() => {
    const tags = new Set<string>();
    mentors.forEach((mentor) => {
      if (mentor.expertise && Array.isArray(mentor.expertise)) {
        mentor.expertise.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [mentors]);

  // Filter mentors
  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      if (
        selectedExpertise &&
        (!mentor.expertise ||
          !Array.isArray(mentor.expertise) ||
          !mentor.expertise.includes(selectedExpertise))
      ) {
        return false;
      }
      if (
        selectedAvailability &&
        mentor.availability !== selectedAvailability
      ) {
        return false;
      }
      return true;
    });
  }, [mentors, selectedExpertise, selectedAvailability]);

  const handleClear = () => {
    setSelectedExpertise("");
    setSelectedAvailability("");
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Browse all mentors</Title>
          <FilterBar>
            <Select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
            >
              <option value="">Select expertise</option>
              {allExpertiseTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Select>

            <Select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              <option value="">Select availability</option>
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Not Available</option>
            </Select>

            <Button $variant="secondary" onClick={handleClear}>
              ○ Clear
            </Button>
            {/* Note: "Apply" button not needed with real-time filtering */}
          </FilterBar>
          <ResultsCount>{filteredMentors.length} results</ResultsCount>
        </Header>

        <MentorsGrid>
          {filteredMentors.map((mentor) => {
            const imageUrl = getAssetUrl(mentor.image);
            const initials = mentor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            // Strip HTML tags from bio for display
            const plainTextBio = mentor.bio
              ? mentor.bio.replace(/<[^>]*>/g, "")
              : "";

            return (
              <MentorCard key={mentor.id}>
                <MentorHeader>
                  {imageUrl ? (
                    <Avatar src={imageUrl} alt={mentor.name} />
                  ) : (
                    <AvatarPlaceholder>{initials}</AvatarPlaceholder>
                  )}
                  <MentorInfo>
                    <MentorName>{mentor.name}</MentorName>
                    <MentorTitle>{mentor.title || "Mentor"}</MentorTitle>
                  </MentorInfo>
                </MentorHeader>

                {plainTextBio && <Bio>&ldquo;{plainTextBio}&rdquo;</Bio>}

                <ExpertiseTags>
                  {mentor.expertise &&
                    Array.isArray(mentor.expertise) &&
                    mentor.expertise.slice(0, 6).map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                </ExpertiseTags>

                <CardActions>
                  <ViewProfileButton href={`/mentors/${mentor.slug}`}>
                    View profile
                  </ViewProfileButton>
                  <ConnectButton href={`/mentors/${mentor.slug}#connect`}>
                    Easy Connect
                  </ConnectButton>
                </CardActions>
              </MentorCard>
            );
          })}
        </MentorsGrid>

        {filteredMentors.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: "16px", color: Color.Neutral[3] }}>
              No mentors found matching your criteria.
            </p>
          </div>
        )}
      </Container>
    </PageContainer>
  );
}
