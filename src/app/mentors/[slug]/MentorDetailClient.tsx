"use client";

import { useState } from "react";
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
  max-width: 900px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${Color.Neutral[2]};
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 24px;

  &:hover {
    color: ${Color.Primary};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  background: ${Color.Neutral[6]};
`;

const AvatarPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${Color.Primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 600;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${Color.Neutral[1]};
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-size: 18px;
  color: ${Color.Neutral[3]};
  margin-bottom: 16px;
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${Color.Neutral[3]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${Color.Neutral[1]};
`;

const AvailabilityBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;

  ${(props) => {
    if (props.$status === "available") {
      return `
        background: #d4edda;
        color: #155724;
      `;
    } else if (props.$status === "limited") {
      return `
        background: #fff3cd;
        color: #856404;
      `;
    } else {
      return `
        background: #f8d7da;
        color: #721c24;
      `;
    }
  }}
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const SocialLink = styled.a`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: ${Color.Neutral[2]};
  background: ${Color.Neutral[7]};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${Color.Neutral[6]};
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${Color.Neutral[1]};
  margin-bottom: 16px;
`;

const BioContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: ${Color.Neutral[2]};

  p {
    margin-bottom: 16px;
  }
`;

const ExpertiseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Tag = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: ${Color.Cream};
  color: ${Color.Neutral[2]};
  border: 1px solid ${Color.Neutral[5]};
`;

const ConnectSection = styled.div`
  background: ${Color.Cream};
  border-radius: 12px;
  padding: 32px;
  margin-top: 32px;
`;

const ConnectTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${Color.Neutral[1]};
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${Color.Neutral[2]};
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${Color.Neutral[5]};
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${Color.Primary};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid ${Color.Neutral[5]};
  border-radius: 8px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${Color.Primary};
  }
`;

const SubmitButton = styled.button`
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background: ${Color.Primary};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${Color.PrimaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ $type: "success" | "error" }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;

  ${(props) =>
    props.$type === "success"
      ? `
    background: #d4edda;
    color: #155724;
  `
      : `
    background: #f8d7da;
    color: #721c24;
  `}
`;

interface Props {
  mentor: Mentor;
  registrationCount: number;
}

export default function MentorDetailClient({
  mentor,
  registrationCount,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const imageUrl = getAssetUrl(mentor.image);
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const availableSpots =
    mentor.max_mentees > 0 ? mentor.max_mentees - registrationCount : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage(null);

    try {
      const response = await fetch("/api/mentor-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: mentor.id,
          name,
          email,
          message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResultMessage({
          type: "success",
          text: "Registration submitted successfully! The mentor will review your request.",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setResultMessage({
          type: "error",
          text: data.error || "Failed to submit registration. Please try again.",
        });
      }
    } catch (error) {
      setResultMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Container>
        <BackLink href="/mentors">← Back to all mentors</BackLink>

        <Card>
          <Header>
            {imageUrl ? (
              <Avatar src={imageUrl} alt={mentor.name} />
            ) : (
              <AvatarPlaceholder>{initials}</AvatarPlaceholder>
            )}

            <HeaderInfo>
              <Name>{mentor.name}</Name>
              <Title>{mentor.title || "Mentor"}</Title>

              <Stats>
                {mentor.years_experience && (
                  <Stat>
                    <StatLabel>Experience</StatLabel>
                    <StatValue>{mentor.years_experience} years</StatValue>
                  </Stat>
                )}
                {mentor.max_mentees > 0 && (
                  <Stat>
                    <StatLabel>Available Spots</StatLabel>
                    <StatValue>
                      {availableSpots !== null && availableSpots >= 0
                        ? availableSpots
                        : "N/A"}
                    </StatValue>
                  </Stat>
                )}
                <Stat>
                  <StatLabel>Current Mentees</StatLabel>
                  <StatValue>{registrationCount}</StatValue>
                </Stat>
              </Stats>

              <AvailabilityBadge $status={mentor.availability}>
                {mentor.availability === "available"
                  ? "Available"
                  : mentor.availability === "limited"
                  ? "Limited Availability"
                  : "Not Available"}
              </AvailabilityBadge>

              {(mentor.linkedin || mentor.twitter) && (
                <SocialLinks>
                  {mentor.linkedin && (
                    <SocialLink
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </SocialLink>
                  )}
                  {mentor.twitter && (
                    <SocialLink
                      href={mentor.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </SocialLink>
                  )}
                </SocialLinks>
              )}
            </HeaderInfo>
          </Header>

          {mentor.bio && (
            <Section>
              <SectionTitle>About</SectionTitle>
              <BioContent dangerouslySetInnerHTML={{ __html: mentor.bio }} />
            </Section>
          )}

          {mentor.expertise && Array.isArray(mentor.expertise) && mentor.expertise.length > 0 && (
            <Section>
              <SectionTitle>Expertise</SectionTitle>
              <ExpertiseTags>
                {mentor.expertise.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </ExpertiseTags>
            </Section>
          )}

          <ConnectSection id="connect">
            <ConnectTitle>Connect with {mentor.name}</ConnectTitle>

            {mentor.availability === "unavailable" ? (
              <Message $type="error">
                This mentor is not currently accepting new mentees.
              </Message>
            ) : availableSpots !== null && availableSpots <= 0 ? (
              <Message $type="error">
                This mentor has reached their maximum capacity.
              </Message>
            ) : (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="message">Message (optional)</Label>
                  <TextArea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the mentor why you're interested in working with them..."
                    disabled={loading}
                  />
                </FormGroup>

                {resultMessage && (
                  <Message $type={resultMessage.type}>
                    {resultMessage.text}
                  </Message>
                )}

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Request"}
                </SubmitButton>
              </Form>
            )}
          </ConnectSection>
        </Card>
      </Container>
    </PageContainer>
  );
}
