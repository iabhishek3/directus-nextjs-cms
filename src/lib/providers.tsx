"use client";

import { ThemeProvider, createGlobalStyle } from "styled-components";
import StyledComponentsRegistry from "./registry";
import { Color } from "./colors";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${Color.Neutral[1]};
    background: ${Color.Neutral[7]};
  }

  a {
    color: inherit;
  }
`;

const theme = {
  colors: Color,
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
