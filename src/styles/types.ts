export type ColorKey = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type ColorObject = {
  [key in ColorKey | string]: string;
};

export interface ThemeColors {
  primary: ColorObject;
  secondary: ColorObject;
  success: ColorObject;
  error: ColorObject;
  warning: ColorObject;
  neutral: ColorObject;
} 