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

export default function UpdateData() {
  let dispatch = useDispatch()

  /* ------------------------------ Update Email ------------------------------ */
  const [emailChangeResultError, setemailChangeResultError] = useState(null);
  const [changeEmailResult, setchangeEmailResult] = useState(null);
  const [EmailLoading, setEmailLoading] = useState(false);

  let validation1 = Yup.object({
    email: Yup.string().email("Email not valid").required("Email is required"),
  });

  const handleUpdateEmail = async (values) => {
    setEmailLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      let headers = {
        token: userToken,
      };
      const { data } = await axios.patch(`${BASE_URL}/childeren/updateEmail`, values, { headers });
      console.log(data);
      if (data.success) {
        setchangeEmailResult(data.message);
        setemailChangeResultError(null);
        setTimeout(() => {
          dispatch(setUserToken(null));
          AsyncStorage.removeItem("userToken");
        }, 5500);
      }
      else if (data.error){
        setemailChangeResultError(data.error)
        setchangeEmailResult(null)
      }
    } catch (error) {
      console.log(error);
    }
    setEmailLoading(false);
  };

  /* ------------------------------ Update Phone ------------------------------ */
  const [PhoneChangeResultError, setPhoneChangeResultError] = useState(null);
  const [changePhoneResult, setchangePhoneResult] = useState(null);
  const [PhoneLoading, setPhoneLoading] = useState(false);

  let validation2 = Yup.object({
    phone: Yup.string()
      .matches('^01[0125][0-9]{8}$','Not Valid Egyptian Number')
      .required("Phone is Required"),
  });

  const handleUpdatePhone = async (values, {resetForm}) => {
    setPhoneLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      let headers = {
        token: userToken,
      };
      const { data } = await axios.patch(`${BASE_URL}/childeren/updatePhone`, values, { headers });
      console.log(data);
      if (data.success) {
        setchangePhoneResult('The Phone is updated sucessfully')
        setPhoneChangeResultError(null)
        resetForm();
      }
      else if (data.error){
        setPhoneChangeResultError(data.error)
        setchangePhoneResult(null)
      }
    } catch (error) {
      
    }
    setPhoneLoading(false);
  };

  return (
    <ScrollView>
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={(values, { resetForm }) =>
          handleUpdateEmail(values, { resetForm })
        }
        validationSchema={validation1}
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
              <Text style={styles.inputTitle}>New Email:</Text>
              <CustomTextInput
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                borderColor={
                  errors.email && touched.email
                    ? "red"
                    : COLORS.blue
                }
              />
              {errors.email && touched.email && (
                <Text style={styles.textError}>{errors.email}</Text>
              )}
            </View>
            {emailChangeResultError && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textError, { textAlign: "center" }]}>
                  {emailChangeResultError}
                </Text>
              </View>
            )}
            {changeEmailResult && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textSuccess, { textAlign: "center" }]}>
                  {changeEmailResult}
                </Text>
              </View>
            )}
            {EmailLoading ? (
              <CustomButton
                icon={true}
                spinColor="white"
                buttonStyle={{ marginVertical: hp(20) }}
              />
            ) : (
              <CustomButton
                title={"Update"}
                buttonStyle={{ marginVertical: hp(20) }}
                pressHandler={handleSubmit}
              />
            )}
          </View>
        )}
      </Formik>
      <Formik
        initialValues={{
          phone: "",
        }}
        onSubmit={(values, { resetForm }) =>
          handleUpdatePhone(values, { resetForm })
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
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>New Phone:</Text>
              <CustomTextInput
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                borderColor={
                  errors.phone && touched.phone
                    ? "red"
                    : COLORS.blue
                }
              />
              {errors.phone && touched.phone && (
                <Text style={styles.textError}>{errors.phone}</Text>
              )}
            </View>
            {PhoneChangeResultError && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textError, { textAlign: "center" }]}>
                  {PhoneChangeResultError}
                </Text>
              </View>
            )}
            {changePhoneResult && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textSuccess, { textAlign: "center" }]}>
                  {changePhoneResult}
                </Text>
              </View>
            )}
            {PhoneLoading ? (
              <CustomButton
                icon={true}
                spinColor="white"
                buttonStyle={{ marginVertical: hp(20) }}
              />
            ) : (
              <CustomButton
                title={"Update"}
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
    marginVertical: hp(10),
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
