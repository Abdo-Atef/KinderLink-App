import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../../../components/CustomTextInput";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import { COLORS, FONTS } from "../../../constants/theme";
import CustomButton from "../../../components/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../utils/apis";
import { setUserToken } from "../../../redux/userSlice";
import { useDispatch } from "react-redux";

export default function ChangeEmployeePassword() {
  const [changeResultError, setchangeResultError] = useState(null);
  const [changeResult, setchangeResult] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  let dispatch = useDispatch()

  let validation = Yup.object({
    oldPassword: Yup.string()
      .min(8, "minimum length is 8 characters")
      .max(15, "maximum length is 15 characters")
      .required("Old password is Required"),
    newPassword: Yup.string()
      .min(8, "minimum length is 8 characters")
      .max(15, "maximum length is 15 characters")
      .required("New Password is Required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Not Equal to password")
      .required("Confirm Password is Required"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const userToken = await AsyncStorage.getItem("userToken");
    let headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/employees/updatePassword`,
        values,
        { headers }
      );
      console.log(data);
      if (data.sucess) {
        setchangeResult(data.message + ", Please Login again ");
        setchangeResultError(null);
        setTimeout(() => {
          dispatch(setUserToken(null));
          AsyncStorage.removeItem("userToken");
        }, 5000);
      } else if (!data.sucess) {
        setchangeResultError('There is an error, please make sure that the old password is right');
        setchangeResult(null);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <ScrollView>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          rePassword: "",
        }}
        onSubmit={(values, { resetForm }) =>
          handleSubmit(values, { resetForm })
        }
        validationSchema={validation}
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
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Old Password:</Text>
              <CustomTextInput
                onChangeText={handleChange("oldPassword")}
                onBlur={handleBlur("oldPassword")}
                value={values.oldPassword}
                borderColor={
                  errors.oldPassword && touched.oldPassword
                    ? "red"
                    : COLORS.blue
                }
                secureTextEntry={true}
              />
              {errors.oldPassword && touched.oldPassword && (
                <Text style={styles.textError}>{errors.oldPassword}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>New Password:</Text>
              <CustomTextInput
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                value={values.newPassword}
                borderColor={
                  errors.newPassword && touched.newPassword
                    ? "red"
                    : COLORS.blue
                }
                secureTextEntry={true}
              />
              {errors.newPassword && touched.newPassword && (
                <Text style={styles.textError}>{errors.newPassword}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Confirm Password:</Text>
              <CustomTextInput
                onChangeText={handleChange("rePassword")}
                onBlur={handleBlur("rePassword")}
                value={values.rePassword}
                borderColor={
                  errors.rePassword && touched.rePassword
                    ? "red"
                    : COLORS.blue
                }
                secureTextEntry={true}
              />
              {errors.rePassword && touched.rePassword && (
                <Text style={styles.textError}>{errors.rePassword}</Text>
              )}
            </View>
            {changeResultError && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textError, { textAlign: "center" }]}>
                  {changeResultError}
                </Text>
              </View>
            )}
            {changeResult && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textSuccess, { textAlign: "center" }]}>
                  {changeResult}
                </Text>
              </View>
            )}
            {IsLoading ? (
              <CustomButton
                icon={true}
                spinColor="white"
                buttonStyle={{ marginVertical: hp(20) }}
              />
            ) : (
              <CustomButton
                title={"Submit"}
                buttonStyle={{ marginVertical: hp(20) }}
                pressHandler={handleSubmit}
              />
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(20),
    marginHorizontal: wp(10),
    backgroundColor:COLORS.white,
    padding:wp(20),
    borderRadius:wp(5)
  },
  inputContainer: {
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
