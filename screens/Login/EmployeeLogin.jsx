import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import { hp, wp } from "../../utils/ResponsiveLayout";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../utils/apis";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function EmployeeLogin() {
  let navigate = useNavigation();
  let dispatch = useDispatch();
  const [IsLoading, setIsLoading] = useState(false);
  const [ErrorMsg, setErrorMsg] = useState(null);

  let HandleLogin = async (values) => {
    setIsLoading(true);
    try {
      let { data } = await axios.post(`${BASE_URL}/employees/login`, values);
      if (data.sucess) {
        setErrorMsg(null);
        const decoded = jwtDecode(data.token);
        if (
          decoded.role == "admin" || decoded.role == "evaluator" || decoded.role == "interviewer" || decoded.role == "socialSpecialist"
        ) {
          setErrorMsg('You are not authorized to register on the application');
        }
        else{
          const Token = "ahmed__" + data.token;
          await dispatch(setUserToken(Token));
          await AsyncStorage.setItem("userToken", Token);
        }
      } else {
        setErrorMsg(data.error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  let validationSchema = Yup.object({
    email: Yup.string().email("Email not valid").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum length is 6 characters")
      .max(15, "Maximum length is 15 characters")
      .required("Password is required"),
    pinCode: Yup.string().required("The code is Required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", pinCode: "" }}
      onSubmit={(values, { resetForm }) => HandleLogin(values, { resetForm })}
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
              borderColor={errors.email && touched.email ? "red" : COLORS.blue}
              keyboardType="email-address"
            />
            {errors.email && touched.email && (
              <Text style={styles.textError}>{errors.email}</Text>
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
              secureTextEntry={true}
            />
            {errors.password && touched.password && (
              <Text style={styles.textError}>{errors.password}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Code:</Text>
            <CustomTextInput
              onChangeText={handleChange("pinCode")}
              onBlur={handleBlur("pinCode")}
              value={values.pinCode}
              borderColor={
                errors.pinCode && touched.pinCode ? "red" : COLORS.blue
              }
              secureTextEntry={true}
            />
            {errors.pinCode && touched.pinCode && (
              <Text style={styles.textError}>{errors.pinCode}</Text>
            )}
          </View>
          {ErrorMsg && (
            <View
              style={{
                marginVertical: hp(10),
                alignItems: "center",
                width: "85%",
              }}
            >
              <Text
                style={{
                  color: "red",
                  textTransform: "capitalize",
                  textAlign: "center",
                }}
              >
                {ErrorMsg}
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
              title={"Sign In"}
              buttonStyle={{ width: "85%", marginTop: hp(15) }}
              pressHandler={handleSubmit}
            />
          )}
          <Pressable
            onPress={() => navigate.navigate("Employee_ForgetPassword")}
            style={{ marginVertical: hp(32) }}
          >
            <Text style={{ textDecorationLine: "underline" }}>
              Forget Password?
            </Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
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
    marginBottom: hp(7),
    paddingLeft: 3,
  },
});
