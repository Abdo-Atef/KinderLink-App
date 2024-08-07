import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../utils/apis";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import { COLORS, FONTS } from "../../../constants/theme";
import placeholderImage from "../../../assets/placeholderImage.png";
import CustomButton from "../../../components/CustomButton";
import {
  AntDesign,
  FontAwesome,
  MaterialIcons,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";

export default function ParentDetails_EMP({ route }) {
  const [DATA, setDATA] = useState(null);

  const getProfileDetails = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(
        `${BASE_URL}/employees/getAccountsDetailsForSuperviosr?accountId=${route.params.userId}`,
        {
          headers,
        }
      );
      setDATA(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  return (
    <ScrollView style={{backgroundColor:COLORS.white}}>
      {DATA ? (
        <View style={styles.container}>
          <View>
            <View style={styles.imgContainer}>
              {DATA.profilePicture ? (
                <Image
                  source={{ uri: DATA.profilePicture.secure_url }}
                  style={styles.imgStyles}
                />
              ) : (
                <Image
                  source={placeholderImage}
                  style={[
                    styles.imgStyles,
                    { borderWidth: 1, borderColor: "#e7e7e7" },
                  ]}
                />
              )}
            </View>
            <View>
              <Text
                style={{
                  fontSize: wp(19),
                  textTransform: "capitalize",
                  textAlign: "center",
                  fontFamily: FONTS.semiBold,
                }}
              >
                {DATA.parentName}
              </Text>
              <Text
                style={{
                  color: "gray",
                  fontSize: wp(14),
                  marginVertical: hp(13),
                  marginBottom: hp(15),
                  textAlign: "center",
                }}
              >
                {DATA.email}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor:'#43A047'}]}
                  onPress={() => Linking.openURL(`tel:${DATA.phone}`)}
                >
                  <Feather name="phone-call" size={24} color={COLORS.white} />
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor:COLORS.blue}]}
                  onPress={() => Linking.openURL(`mailto:${DATA.email}`)}
                >
                  <MaterialIcons name="email" size={24} color={COLORS.white} />
                  <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <View style={[styles.textCo, { marginStart: wp(4) }]}>
              <FontAwesome6 name="user-tie" size={21} color="black" />
              <Text style={[styles.infoTextStyles, { marginStart: wp(1) }]}>
                Child: {DATA.childName} {DATA.parentName}
              </Text>
            </View>
            <View style={styles.textCo}>
              <AntDesign name="mobile1" size={22} color="black" />
              <Text style={styles.infoTextStyles}>Phone: {DATA.phone}</Text>
            </View>
            <View style={styles.textCo}>
              <MaterialIcons name="location-on" size={22} color="black" />
              <Text style={styles.infoTextStyles}>
                Location: {DATA.location}
              </Text>
            </View>
            <View style={styles.textCo}>
              <FontAwesome name="map-marker" size={18} color="black" />
              <Text style={[styles.infoTextStyles, { marginStart: wp(2) }]}>
                Region: {DATA.region}
              </Text>
            </View>
          </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(30),
    marginVertical: hp(10),
    paddingVertical: hp(18),
    borderTopColor: "rgb(237, 237, 237)",
    borderTopWidth: 1,
    borderBottomColor: "rgb(237, 237, 237)",
    borderBottomWidth: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(10),
    paddingHorizontal: wp(30),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: wp(15),
    marginLeft: wp(5),
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
});
