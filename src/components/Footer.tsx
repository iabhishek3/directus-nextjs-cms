"use client";

import Link from "next/link";
import styled from "styled-components";
import { Color } from "@/lib/colors";

const FooterContainer = styled.footer`
  background: ${Color.Neutral[1]};
  color: white;
  padding: 48px 0 24px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const BrandSection = styled.div``;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${Color.Primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandDescription = styled.p`
  color: ${Color.Neutral[4]};
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
`;

const FooterSection = styled.div``;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FooterLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 12px;
`;

const FooterLink = styled(Link)`
  color: ${Color.Neutral[4]};
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${Color.Neutral[2]};
  margin: 0 0 24px 0;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Copyright = styled.p`
  color: ${Color.Neutral[4]};
  font-size: 14px;
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialLink = styled.a`
  color: ${Color.Neutral[4]};
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <BrandSection>
            <Logo href="/">
              <LogoIcon>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </LogoIcon>
              DISCOVER
            </Logo>
            <BrandDescription>
              Discover and register for conferences, workshops, meetups, and more. Join our community of learners and innovators.
            </BrandDescription>
          </BrandSection>

          <FooterSection>
            <SectionTitle>Quick Links</SectionTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink href="/">Home</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/events">All Events</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/events?category=workshop">Workshops</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/events?category=conference">Conferences</FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Categories</SectionTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink href="/events?category=workshop">Workshops</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/events?category=conference">Conferences</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/events?category=meetup">Meetups</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="/events?category=webinar">Webinars</FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Contact</SectionTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink href="mailto:hello@discover.com">hello@discover.com</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="tel:+6512345678">+65 1234 5678</FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <Divider />

        <BottomBar>
          <Copyright suppressHydrationWarning>&copy; {new Date().getFullYear()} DISCOVER. All rights reserved.</Copyright>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </SocialLink>
            <SocialLink href="#" aria-label="LinkedIn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </SocialLink>
          </SocialLinks>
        </BottomBar>
      </FooterContent>
    </FooterContainer>
  );
}
