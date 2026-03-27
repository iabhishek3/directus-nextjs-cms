"use client";

import styled from "styled-components";
import { Color } from "./colors";

export const Text = {
  H1: styled.h1`
    font-size: 40px;
    font-weight: 700;
    line-height: 1.2;
    color: ${Color.Neutral[1]};
    margin: 0;
  `,
  H2: styled.h2`
    font-size: 32px;
    font-weight: 600;
    line-height: 1.3;
    color: ${Color.Neutral[1]};
    margin: 0;
  `,
  H3: styled.h3`
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    color: ${Color.Neutral[1]};
    margin: 0;
  `,
  H4: styled.h4`
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
    color: ${Color.Neutral[1]};
    margin: 0;
  `,
  H5: styled.h5`
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: ${Color.Neutral[1]};
    margin: 0;
  `,
  Body: styled.p`
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    color: ${Color.Neutral[2]};
    margin: 0;
  `,
  XSmall: styled.span<{ $weight?: "normal" | "semibold" }>`
    font-size: 12px;
    font-weight: ${(props) => (props.$weight === "semibold" ? 600 : 400)};
    line-height: 1.5;
    color: ${Color.Neutral[3]};
  `,
};

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid ${Color.Neutral[6]};
  overflow: hidden;
`;

export const Button = {
  Default: styled.button<{ $styleType?: "light" | "default" }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    ${(props) =>
      props.$styleType === "light"
        ? `
      background: white;
      color: ${Color.Primary};
      &:hover {
        background: ${Color.Neutral[7]};
      }
    `
        : `
      background: ${Color.Primary};
      color: white;
      &:hover {
        background: ${Color.PrimaryDark};
      }
    `}

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
};

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid ${Color.Neutral[5]};
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${Color.Primary};
    box-shadow: 0 0 0 3px ${Color.Primary}20;
  }

  &:disabled {
    background: ${Color.Neutral[7]};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${Color.Neutral[4]};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${Color.Neutral[2]};
  margin-bottom: 8px;
`;
