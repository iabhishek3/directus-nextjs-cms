"use client";

import Link from "next/link";
import styled from "styled-components";
import { Color } from "@/lib/colors";

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid ${Color.Neutral[6]};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: ${Color.Primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${Color.Primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavLink = styled(Link)`
  font-size: 15px;
  font-weight: 500;
  color: ${Color.Neutral[2]};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${Color.Primary};
  }
`;

const CTAButton = styled(Link)`
  background: ${Color.Primary};
  color: white;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: ${Color.PrimaryDark};
  }
`;

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo href="/">
          <LogoIcon>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </LogoIcon>
          DISCOVER
        </Logo>

        <Nav>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/mentors">Mentors</NavLink>
          <CTAButton href="/events">Register Now</CTAButton>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}
