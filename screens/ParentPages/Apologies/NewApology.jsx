import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../../constants/theme";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import CustomButton from "../../../components/CustomButton";
import { Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../utils/apis";
import { useDispatch } from "react-redux";
import { getMyApologies } from "../../../redux/parentSlice";

export default function NewApology({ navigation }) {
  let dispatch = useDispatch();
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setDate(selectedDate);
    }
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  let validation1 = Yup.object({
    reasonForAbsence: Yup.string().required("The Reason is required"),
  });

  const [ErrorResult, setErrorResult] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const handleSubmit = async (values) => {
    setIsLoading(true);
    let params = {
      dateOfAbsence: dayjs(date).format("YYYY/MM/DD"),
      reasonForAbsence: values.reasonForAbsence,
    };
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.post(
        `${BASE_URL}/childeren/aplogizes/addApologize`,
        params,
        { headers }
      );
      console.log(data);
      if (data.error) {
        setErrorResult(data.error);
      } else if (data.success) {
        dispatch(getMyApologies());
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          reasonForAbsence: "",
        }}
        onSubmit={(values, { resetForm }) =>
          handleSubmit(values, { resetForm })
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
          <React.Fragment>
            <View style={{ marginBottom: hp(5) }}>
              <Text style={{ fontSize: wp(16) }}>The Date of Absence:</Text>
            </View>
            <TouchableOpacity
              style={{ position: "relative", width: "100%" }}
              onPress={showMode}
            >
              <TextInput
                style={styles.input}
                defaultValue={dayjs(date).format("YYYY/MM/DD")}
                editable={false}
                pointerEvents="none"
              />
              <View style={styles.iconCo}>
                <FontAwesome name="calendar" size={24} color={COLORS.blue} />
              </View>
            </TouchableOpacity>
            <View style={{ marginVertical: hp(30) }}>
              <View style={{ marginBottom: hp(5) }}>
                <Text style={{ fontSize: wp(16) }}>The Reason:</Text>
              </View>
              <TextInput
                style={styles.input}
                multiline={true}
                numberOfLines={5}
                onChangeText={handleChange("reasonForAbsence")}
                onBlur={handleBlur("reasonForAbsence")}
                value={values.reasonForAbsence}
              />
              {errors.reasonForAbsence && touched.reasonForAbsence && (
                <Text style={styles.textError}>{errors.reasonForAbsence}</Text>
              )}
            </View>
            {ErrorResult ? (
              <View>
                <Text
                  style={[
                    styles.textError,
                    { fontSize: wp(14), textAlign: "center" },
                  ]}
                >
                  {ErrorResult}
                </Text>
              </View>
            ) : (
              ""
            )}
            <View>
              {IsLoading ? (
                <CustomButton
                  icon={true}
                  spinColor="white"
                  buttonStyle={{ paddingVertical: hp(15), marginTop: hp(15) }}
                />
              ) : (
                <CustomButton
                  title={"Send"}
                  buttonStyle={{ paddingVertical: hp(15), marginTop: hp(15) }}
                  pressHandler={handleSubmit}
                />
              )}
            </View>
          </React.Fragment>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: wp(20),
  },
  input: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: wp(5),
    paddingVertical: wp(13),
    paddingHorizontal: wp(20),
    width: "100%",
    backgroundColor: "#fff",
    fontSize: wp(16),
    color: "#333",
  },
  iconCo: {
    position: "absolute",
    top: "50%",
    end: wp(20),
    width: 24,
    height: 24,
    transform: [{ translateY: -12 }],
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
