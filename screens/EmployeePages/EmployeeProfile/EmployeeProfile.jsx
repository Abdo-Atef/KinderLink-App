import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../../../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import CustomButton from "../../../components/CustomButton";
import { COLORS, FONTS } from "../../../constants/theme";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "../../../utils/apis";
import { Feather } from "@expo/vector-icons";
import placeholderImage from "../../../assets/placeholderImage.png";
import { getEmployeeData } from "../../../redux/employeeSlice";


export default function EmployeeProfile({ navigation }) {
  let dispatch = useDispatch();
  const { employeeData } = useSelector((state) => state.employee);
  // console.log(employeeData);
  let handleLogOut = async () => {
    await dispatch(setUserToken(null));
    await AsyncStorage.removeItem("userToken");
  };

  const handleUploadImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        imageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [ImageLoading, setImageLoading] = useState(false);

  const imageUpload = async (imageURI) => {
    setImageLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      let headers = {
        token: userToken,
        "Content-Type": "multipart/form-data",
      };
      const formData = new FormData();
      formData.append("profilePicture", {
        uri: imageURI,
        type: "image/jpeg",
        name: "profilePicture.jpg",
      });
      const { data } = await axios.patch(`${BASE_URL}/employees/updateProfilePhoto`,
        formData, 
        { headers }
      );
      // console.log(data);
      dispatch(getEmployeeData());
    } catch (error) {
      console.log(error);
    }
    setImageLoading(false);
  };

  useEffect(() => {
    dispatch(getEmployeeData());
  }, []);

  return (
    <ScrollView>
      {employeeData ? (
        <View style={styles.container}>
          <View>
            <View style={styles.imgContainer}>
              {employeeData.profilePicture ? (
                <Image
                  source={{ uri: employeeData.profilePicture.secure_url.replace(/.*https:\/\//, 'https://') }}
                  style={[styles.imgStyles, {borderWidth:1, borderColor:'#e7e7e7'}]}
                />
              ) : (
                <Image
                  source={placeholderImage}
                  style={[styles.imgStyles, {borderWidth:1, borderColor:'#e7e7e7'}]}
                />
              )}
              
              <TouchableOpacity
                style={styles.editImgBtn}
                onPress={() => handleUploadImage()}
              >
                <Feather name="camera" size={23} color={COLORS.blue} />
              </TouchableOpacity>
            </View>
            {ImageLoading ? (
                <CustomButton
                  icon={true}
                  buttonStyle={{
                    backgroundColor: "transparent",
                  }}
                  spinColor={COLORS.blue}
                  spinSize={wp(20)}
                />
              ) : (
                ""
              )}
            <View>
              <Text
                style={{
                  fontSize: wp(19),
                  textTransform: "capitalize",
                  textAlign: "center",
                  fontFamily: FONTS.semiBold,
                }}
              >
                {employeeData.name}
              </Text>
              <Text
                style={{
                  color: "gray",
                  fontSize: wp(14),
                  marginVertical: hp(13),
                  marginBottom: hp(30),
                  textAlign: "center",
                }}
              >
                {employeeData.email}
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: hp(30) }}>
            <CustomButton
              title={"Edit Profile"}
              buttonStyle={{ width: wp(110), marginHorizontal: "auto" }}
              titleStyles={{ fontSize: wp(14), fontFamily: FONTS.medium }}
              pressHandler={() => navigation.navigate("UpdateEmployee",{id:employeeData.id})}
            />
          </View>
          <View>
          <View style={styles.textCo}>
              <FontAwesome name="user-circle" size={19} color="black" />
              <Text style={[styles.infoTextStyles, { marginStart: wp(2) }]}>
                Role: {employeeData.role}
              </Text>
            </View>
            <View style={styles.textCo}>
              <AntDesign name="mobile1" size={22} color="black" />
              <Text style={styles.infoTextStyles}>
                Phone: {employeeData.phone}
              </Text>
            </View>
            <View style={styles.textCo}>
              <MaterialIcons name="location-on" size={22} color="black" />
              <Text style={styles.infoTextStyles}>
                Address: {employeeData.address}
              </Text>
            </View>
            <View style={styles.textCo}>
              <FontAwesome6 name="dollar" size={22} color="black" />
              <Text style={styles.infoTextStyles}>
                Salary: {employeeData.salary}$
              </Text>
            </View>
            
          </View>
          <CustomButton
            title="Sign out"
            buttonStyle={{ backgroundColor: "#dc3545", marginVertical: hp(40) }}
            pressHandler={handleLogOut}
          />
        </View>
      ) : (
        <CustomButton
          icon={true}
          buttonStyle={{
            backgroundColor: "transparent",
            marginVertical: hp(60),
          }}
          spinColor={COLORS.blue}
          spinSize={wp(30)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(15),
    backgroundColor: COLORS.white,
  },
  imgContainer: {
    marginVertical: hp(30),
    margin: "auto",
    position: "relative",
  },
  imgStyles: {
    width: 150,
    height: 150,
    borderRadius: 90,
  },
  textCo: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5),
    paddingVertical: hp(15),
    borderBottomWidth: wp(1),
    borderColor: "#e7e7e7",
  },
  infoTextStyles: {
    fontSize: wp(16),
    textTransform: "capitalize",
    marginVertical: hp(5),
  },
  editImgBtn: {
    backgroundColor: "#ededed",
    borderWidth: 2,
    borderColor: "white",
    paddingHorizontal: wp(5),
    paddingVertical: hp(4),
    borderRadius: 500,
    position: "absolute",
    right: 2,
    bottom: 2,
  },
});
