import { Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import { wp } from "../utils/ResponsiveLayout";

export default function CustomButton({ title, icon, buttonStyle , pressHandler, spinColor, titleStyles, spinSize }) {
  if (icon) {
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, buttonStyle]}
        onPress={pressHandler && pressHandler}
      >
        <ActivityIndicator color={spinColor} size={spinSize}/>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, buttonStyle]}
      onPress={pressHandler && pressHandler}
    >
      <Text style={[styles.buttonTitle, titleStyles]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: wp(12),
    paddingVertical: wp(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(6),
  },
  buttonTitle: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: wp(16),
  },
});
