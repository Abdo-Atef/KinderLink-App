import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../constants/theme";
import ParentLogin from "./ParentLogin";
import EmployeeLogin from "./EmployeeLogin";
import { hp, wp } from "../../utils/ResponsiveLayout";

export default function Login() {
  const [Active, setActive] = useState("parent");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ width: "100%" }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.Logo}
            source={require("../../assets/logo.png")}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={styles.navigationCo}>
            <Pressable
              onPress={() => setActive("parent")}
              style={
                Active == "parent"
                  ? styles.ActiveNavigationEle
                  : styles.NavigationEle
              }
            >
              <Text
                style={
                  Active == "parent"
                    ? styles.ActiveNavigationText
                    : styles.NavigationText
                }
              >
                Parent
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActive("employee")}
              style={
                Active == "employee"
                  ? styles.ActiveNavigationEle
                  : styles.NavigationEle
              }
            >
              <Text
                style={
                  Active == "employee"
                    ? styles.ActiveNavigationText
                    : styles.NavigationText
                }
              >
                Employee
              </Text>
            </Pressable>
          </View>
        </View>
        {Active == "parent" ? <ParentLogin /> : <EmployeeLogin />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  Logo: {
    width: wp(260),
    height: hp(260),
  },
  navigationCo: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    gap: wp(12),
    paddingHorizontal: wp(11),
    paddingVertical: wp(11),
    borderRadius: 10,
  },
  NavigationEle: {
    backgroundColor: "#FFFFFF",
    paddingVertical: hp(9),
    paddingHorizontal: wp(27),
    borderRadius: 10,
  },
  ActiveNavigationEle: {
    backgroundColor: COLORS.blue,
    paddingVertical: hp(9),
    paddingHorizontal: wp(27),
    borderRadius: 10,
  },
  ActiveNavigationText: {
    color: "#FFFFFF",
    fontSize: wp(14),
  },
  NavigationText: {
    color: "#000000",
    fontSize: wp(14),
  },
});
