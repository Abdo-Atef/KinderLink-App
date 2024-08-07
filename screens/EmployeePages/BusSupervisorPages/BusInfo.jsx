import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../utils/apis";
import dayjs from "dayjs";
import CustomButton from "../../../components/CustomButton";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import { COLORS } from "../../../constants/theme";

const BusInfo = ({navigation}) => {
  const [DATA, setDATA] = useState(null);
  const [NotHaveGroup, setNotHaveGroup] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);

  const getGroupMembers = async () => {
    setIsLoading(true);
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      let { data } = await axios.get(
        `${BASE_URL}/employees/getSpBusForBusSupervisor`,
        { headers }
      );
      console.log(data);
      if (data.message == "you are't assign to any bus yet") {
        setNotHaveGroup(true);
      } else {
        setDATA(data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getGroupMembers();
  }, []);

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      {icon}
      <Text style={styles.itemText}>
        {label}: {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!IsLoading ? (
          <>
            {DATA && NotHaveGroup == false ? (
              <View style={styles.container}>
                <View style={styles.card}>
                  <View style={styles.header}>
                    <FontAwesome5 name="bus-alt" size={30} color="#3498db" />
                    <Text style={styles.title}>{DATA?.bus?.busName}</Text>
                  </View>
                </View>
                <InfoItem
                  icon={
                    <FontAwesome5 name="hashtag" size={24} color="#FF5722" />
                  }
                  label="Bus Number"
                  value={DATA?.bus?.busNumber}
                />
                <InfoItem
                  icon={
                    <MaterialCommunityIcons
                      name="seat"
                      size={24}
                      color="#3F51B5"
                    />
                  }
                  label="Capacity"
                  value={DATA?.bus?.capacity}
                />
                <InfoItem
                  icon={
                    <MaterialCommunityIcons
                      name="seat-outline"
                      size={24}
                      color="#FFC107"
                    />
                  }
                  label="Available Seats"
                  value={DATA?.numberOfRestSeats}
                />
                <InfoItem
                  icon={
                    <MaterialCommunityIcons
                      name="seat-recline-normal"
                      size={24}
                      color="#E91E63"
                    />
                  }
                  label="Reserved Seats"
                  value={DATA?.numberOfSeatsReversed}
                />
                <InfoItem
                  icon={
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#9C27B0"
                    />
                  }
                  label="Created At"
                  value={dayjs(DATA?.bus?.createdAt).format("YYYY/MM/DD")}
                />
                <InfoItem
                  icon={
                    <Ionicons name="time-outline" size={24} color="#00BCD4" />
                  }
                  label="Last Updated At"
                  value={dayjs(DATA?.bus?.lastUpdatedAt).format("YYYY/MM/DD")}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('BusGroup')}
                >
                  <FontAwesome5 name="users" size={24} color="white" />
                  <Text style={styles.buttonText}>Members</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>You are not in a group</Text>
              </View>
            )}
          </>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 20,
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    marginLeft: 10,
    color: "#3498db",
    fontWeight: "bold",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.65,
    elevation: 5,
  },
  itemText: {
    marginLeft: 15,
    fontSize: wp(17),
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.65,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 40,
  },
  noDataText: {
    fontSize: wp(18),
    marginTop: hp(20),
  },
});

export default BusInfo;
