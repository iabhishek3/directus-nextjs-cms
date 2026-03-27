"use client";

import { useState } from "react";
import styled from "styled-components";
import { Color } from "@/lib/colors";
import { Text, Card, Button, Input, Label } from "@/lib/typography";

interface RegistrationFormProps {
  eventId: number;
  eventTitle: string;
  spotsLeft: number | null;
}

const FormCard = styled(Card)`
  padding: 24px;
`;

const FormTitle = styled(Text.H3)`
  margin-bottom: 8px;
`;

const SpotsText = styled(Text.Body)`
  color: ${Color.Primary};
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: 24px;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${Color.Validation.Green.Background};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: ${Color.Validation.Green.Text};
`;

const SoldOutContainer = styled.div`
  text-align: center;
  padding: 24px;
  background: ${Color.Neutral[6]};
  border-radius: 8px;
`;

const ErrorMessage = styled.div`
  background: ${Color.Validation.Red.Background};
  color: ${Color.Validation.Red.Text};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const RegisterAgainLink = styled.button`
  background: none;
  border: none;
  color: ${Color.Primary};
  cursor: pointer;
  text-decoration: underline;
  margin-top: 16px;
`;

export default function RegistrationForm({
  eventId,
  eventTitle,
  spotsLeft,
}: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isSoldOut = spotsLeft !== null && spotsLeft <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setName("");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    }
  }

  if (status === "success") {
    return (
      <FormCard>
        <SuccessContainer>
          <SuccessIcon>
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </SuccessIcon>
          <Text.H3>Registration Successful!</Text.H3>
          <Text.Body style={{ marginTop: 8 }}>
            You&apos;re registered for <strong>{eventTitle}</strong>. Check your email for confirmation.
          </Text.Body>
          <RegisterAgainLink onClick={() => setStatus("idle")}>
            Register another person
          </RegisterAgainLink>
        </SuccessContainer>
      </FormCard>
    );
  }

  if (isSoldOut) {
    return (
      <FormCard>
        <SoldOutContainer>
          <svg width="48" height="48" fill="none" stroke={Color.Neutral[3]} viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <Text.H3>Event Sold Out</Text.H3>
          <Text.Body style={{ marginTop: 8 }}>
            This event has reached full capacity. Please check back later.
          </Text.Body>
        </SoldOutContainer>
      </FormCard>
    );
  }

  return (
    <FormCard>
      <FormTitle>Register for this Event</FormTitle>
      {spotsLeft !== null && (
        <SpotsText>
          <strong>{spotsLeft}</strong> spots remaining
        </SpotsText>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            required
          />
        </FormGroup>

        {status === "error" && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button.Default
          type="submit"
          disabled={status === "loading"}
          style={{ width: "100%" }}
        >
          {status === "loading" ? "Registering..." : "Register Now"}
        </Button.Default>
      </form>
    </FormCard>
  );
}
