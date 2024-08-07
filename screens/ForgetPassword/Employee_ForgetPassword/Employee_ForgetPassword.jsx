import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../../utils/apis";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import { COLORS, FONTS } from "../../../constants/theme";
import CustomTextInput from "../../../components/CustomTextInput";
import CustomButton from "../../../components/CustomButton";
import Reset from "./Reset";
import { AntDesign } from "@expo/vector-icons";

export default function Employee_ForgetPassword() {
  const [EmailValid, setEmailValid] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  let validationSchema = Yup.object({
    email: Yup.string()
      .email("This Is Invalid Email")
      .required("Email is Required"),
  });

  const [ApiError, setApiError] = useState(null);
  const [ApiSuccess, setApiSuccess] = useState(null);

  async function forgetSubmit(values) {
    setIsLoading(true);
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/employees/forgetPassword`,
        values
      );
      console.log(data);
      if (data.success) {
        setApiSuccess("Check your Email to get the ResetCode");
        setApiError(null);
        setTimeout(() => {
          setEmailValid(true);
        }, 2500);
      } else if (data.error) {
        setApiError(data.error);
        setApiSuccess(null);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <ScrollView>
          <View style={styles.innerContainer}>
            <View style={styles.imageSection}>
              <Image
                source={
                  EmailValid
                    ? require("../../../assets/resetPassword.jpg")
                    : require("../../../assets/Lock_Svg.png")
                }
                style={styles.image}
              />
            </View>
            <View style={styles.formSection}>
              {!EmailValid ? (
                <>
                  <Text style={styles.title}>Forget Password</Text>

                  <Formik
                    initialValues={{ email: "" }}
                    onSubmit={(values, { resetForm }) =>
                      forgetSubmit(values, { resetForm })
                    }
                    validationSchema={validationSchema}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      resetForm,
                    }) => (
                      <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputTitle}>Email:</Text>
                          <CustomTextInput
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            value={values.email}
                            borderColor={
                              errors.email && touched.email
                                ? "red"
                                : COLORS.blue
                            }
                            keyboardType="email-address"
                          />
                          {errors.email && touched.email && (
                            <Text style={styles.textError}>{errors.email}</Text>
                          )}
                        </View>
                        {ApiError && (
                          <View>
                            <Text
                              style={[
                                styles.textError,
                                { textAlign: "center" },
                              ]}
                            >
                              {ApiError}
                            </Text>
                          </View>
                        )}
                        {ApiSuccess && (
                          <View>
                            <Text
                              style={[
                                styles.textSuccess,
                                { textAlign: "center" },
                              ]}
                            >
                              {ApiSuccess}
                            </Text>
                          </View>
                        )}
                        {IsLoading ? (
                          <CustomButton
                            icon={true}
                            spinColor="white"
                            buttonStyle={{ width: "85%", marginTop: hp(15) }}
                          />
                        ) : (
                          <CustomButton
                            title={"Submit"}
                            buttonStyle={{ width: "85%", marginTop: hp(15) }}
                            pressHandler={handleSubmit}
                          />
                        )}
                      </View>
                    )}
                  </Formik>
                </>
              ) : (
                <Reset />
              )}
            </View>
            <Pressable
              style={{
                marginHorizontal: wp(25),
                marginVertical: hp(10),
                padding: wp(2),
                flexDirection: "row",
              }}
              onPress={() => navigation.navigate("Login")}
            >
              <AntDesign name="arrowleft" size={wp(19)} color="black" />
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: wp(14),
                  marginHorizontal: wp(5),
                  textDecorationLine: "underline",
                }}
              >
                Back To Login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGray,
    justifyContent: "center",
  },
  innerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: wp(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: hp(15),
    marginHorizontal: wp(15),
    marginVertical: hp(20),
  },
  imageSection: {
    width: "100%",
    padding: wp(15),
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp(160),
    height: hp(160),
    resizeMode: "cover",
  },
  formSection: {
    paddingVertical: hp(23),
  },
  title: {
    fontSize: wp(22),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp(22),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    paddingHorizontal: wp(10),
    paddingVertical: hp(10),
    borderRadius: wp(5),
    marginBottom: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: hp(15),
  },
  inputContainer: {
    width: "85%",
    marginVertical: hp(10),
  },
  inputTitle: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: wp(14),
    marginLeft: 2,
  },
  textError: {
    color: "red",
    fontSize: wp(14),
    marginVertical: hp(7),
    textTransform: "capitalize",
  },
  textSuccess: {
    color: "green",
    fontSize: wp(14),
    marginVertical: hp(7),
    textTransform: "capitalize",
  },
});
