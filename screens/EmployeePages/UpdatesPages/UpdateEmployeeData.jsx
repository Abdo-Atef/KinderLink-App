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
import { jwtDecode } from "jwt-decode";

export default function UpdateEmployeeData() {
  let dispatch = useDispatch();

  /* ------------------------------ Update Email ------------------------------ */
  const [ChangeResultError, setChangeResultError] = useState(null);
  const [changeResult, setchangeResult] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);

  let validation1 = Yup.object({
    email: Yup.string().email("Email not valid").required("Email is required"),
    phone: Yup.string()
      .matches("^01[0125][0-9]{8}$", "Not Valid Egyptian Number")
      .required("Phone is Required"),
  });

  const handleUpdateEmail = async (values) => {
    const userToken = await AsyncStorage.getItem("userToken");
    console.log(userToken);
    const decodedData = jwtDecode(userToken);
    console.log(decodedData);
    setIsLoading(true);
    try {
      let headers = {
        token: userToken,
      };
      const { data } = await axios.patch(
        `${BASE_URL}/employees/updateDataOfUser/${decodedData.id}`,
        values,
        { headers }
      );
      console.log(data);
      if (data.success) {
        setchangeResult(data.message);
        setChangeResultError(null);
        setTimeout(() => {
          dispatch(setUserToken(null));
          AsyncStorage.removeItem("userToken");
        }, 5500);
      } else if (data.error) {
        setChangeResultError(data.error);
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
          email: "",
          phone: "",
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
                  errors.email && touched.email ? "red" : COLORS.blue
                }
              />
              {errors.email && touched.email && (
                <Text style={styles.textError}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>New Phone:</Text>
              <CustomTextInput
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                borderColor={
                  errors.phone && touched.phone ? "red" : COLORS.blue
                }
              />
              {errors.phone && touched.phone && (
                <Text style={styles.textError}>{errors.phone}</Text>
              )}
            </View>
            {ChangeResultError && (
              <View style={styles.inputContainer}>
                <Text style={[styles.textError, { textAlign: "center" }]}>
                  {ChangeResultError}
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
    backgroundColor: COLORS.white,
    padding: wp(20),
    borderRadius: wp(5),
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
