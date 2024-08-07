import React, { useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../../utils/apis";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import { COLORS, FONTS } from "../../../constants/theme";
import CustomTextInput from "../../../components/CustomTextInput";
import CustomButton from "../../../components/CustomButton";

export default function Reset() {

  const [IsLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [ResetResult, setResetResult] = useState(null);
  const [ResetResultError, setResetResultError] = useState(null);

  async function handleResetSubmit(values, { resetForm }) {
    setIsLoading(true);
    const {data} = await axios.patch(`${BASE_URL}/childeren/setFotrgetPass`, values);
    console.log(data);
    if (data.sucess) {
      setResetResult(data.message);
      setResetResultError(null);
      resetForm();
      setTimeout(() => {
        navigation.navigate('Login')
      }, 3000);
    } else if (data.error) {
      setResetResult(null);
      setResetResultError(data.error);
    }
    setIsLoading(false);
  }

  let validation2 = Yup.object({
    email: Yup.string()
      .email("This Is Invalid Email")
      .required("Email is Required"),
    password: Yup.string()
      .min(8, "minimum length is 8 characters")
      .max(15, "maximum length is 15 characters")
      .required("Password is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Not Equal to password")
      .required("Password is Required"),
    resetCode: Yup.string().required("The ResetCode is Required"),
  });
  
  return (
    <>
      <Text style={styles.title}>Reset Password</Text>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "", resetCode: "" }}
        onSubmit={(values, { resetForm }) =>
          handleResetSubmit(values, { resetForm })
        }
        validationSchema={validation2}
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
                  errors.email && touched.email ? "red" : COLORS.blue
                }
                keyboardType="email-address"
              />
              {errors.email && touched.email && (
                <Text style={styles.textError}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Reset Code:</Text>
              <CustomTextInput
                onChangeText={handleChange("resetCode")}
                onBlur={handleBlur("resetCode")}
                value={values.resetCode}
                borderColor={errors.resetCode && touched.resetCode ? "red" : COLORS.blue}
              />
              {errors.resetCode && touched.resetCode && (
                <Text style={styles.textError}>{errors.resetCode}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Password:</Text>
              <CustomTextInput
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                borderColor={
                  errors.password && touched.password ? "red" : COLORS.blue
                }
              />
              {errors.password && touched.password && (
                <Text style={styles.textError}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Confirm Password:</Text>
              <CustomTextInput
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                borderColor={
                  errors.confirmPassword && touched.confirmPassword ? "red" : COLORS.blue
                }
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.textError}>{errors.confirmPassword}</Text>
              )}
            </View>
            {ResetResultError && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textError, { textAlign: "center" }]}>
                  {ResetResultError}
                </Text>
              </View>
            )}
            {ResetResult && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textSuccess, { textAlign: "center" }]}>
                  {ResetResult}
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
    fontSize: wp(13),
    marginVertical: hp(7),
    textTransform: "capitalize",
  },
  textSuccess: {
    color: "green",
    fontSize: wp(13),
    marginVertical: hp(7),
    textTransform: "capitalize",
  },
});
