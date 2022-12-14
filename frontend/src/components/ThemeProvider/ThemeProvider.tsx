import React from 'react';
import { ThemeProvider as OThemeProvider } from 'styled-components';

const baseTheme = {
  colors: {
    white: '#ffffff',
    background: '#111b24',
    backgroundDimmed: 'rgba(17, 27, 36, 0.8)',
    primary: '#00eac7',
    primaryLighter: '#7ff4e3',
    primaryDarker: '#00ccab',
    success: '#66D16F',
    warning: '#FFD23F',
    error: '#FF4F4C',
    button: {
      secondary: '#0f3034',
      secondaryHover: '#0e3a3c',
      shadow: 'rgba(127, 244, 227, 0.6)',
      shadowActive: 'rgba(127, 244, 227, 0.4)',
      shadowDark: 'rgba(0, 234, 199, 0.1)',
    },
    night: {
      '100': '#111B24',
      '150': '#14202A',
      '200': '#16232E',
      '250': '#182733',
      '300': '#1B2B38',
      '350': '#2F4252',
    },
    nightShadow:
      '0px 24px 38px rgba(12, 19, 26, 0.14), 0px 9px 46px rgba(12, 19, 26, 0.12), 0px 11px 15px rgba(12, 19, 26, 0.2)',
    gray: {
      medium: '#BCCBD6',
    },
  },
};

export type ThemeType = typeof baseTheme;
export interface Props {
  children: React.ReactNode;
  theme?: ThemeType;
}

const ThemeProvider = ({ children, theme = baseTheme }: Props): JSX.Element => (
  <OThemeProvider theme={theme}>{children}</OThemeProvider>
);

export default ThemeProvider;
