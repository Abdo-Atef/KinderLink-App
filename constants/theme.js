import { PixelRatio } from "react-native";
const fontScale = PixelRatio.getFontScale();
export const SIZES = {
  small: 8 * fontScale,
  medium: 13 * fontScale,
  large: 17 * fontScale,
  xLarge: 24 * fontScale,
};
export const COLORS = {
  white: "#ffffff",
  bgGray: "#f8f9f9",
  textGray:'#ababab',
  black: "#000",
  blue:'#3498db',
  blue2:'#ecf2fa',
  blue3:'#51a0fe',
};
export const FONTS = {
  bold: "InterBold",
  semiBold: "InterSemiBold",
  medium: "InterMedium",
  regular: "InterRegular",
  light: "InterLight",
};