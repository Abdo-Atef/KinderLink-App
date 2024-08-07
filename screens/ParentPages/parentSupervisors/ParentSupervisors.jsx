import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../utils/apis";
import { COLORS } from "../../../constants/theme";


const PersonCard = ({ name, email, phone, image }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: image.secure_url.replace(/.*https:\/\//, "https://") }}
      style={styles.image}
    />
    <View style={styles.cardContent}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.infoContainer}>
        <Ionicons name="mail-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Ionicons name="call-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{phone}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Pressable
          style={[styles.actionButton, styles.emailButton]}
          onPress={() => Linking.openURL(`mailto:${email}`)}
        >
          <Ionicons name="mail-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Email</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.callButton]}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <Ionicons name="call-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Call</Text>
        </Pressable>
      </View>
    </View>
  </View>
);

export default function ParentSupervisors() {
  const [DATA, setDATA] = useState(null);

  const getSupervisors = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = { token: userToken };

    try {
      const { data } = await axios.get(
        `${BASE_URL}/childeren/childEmployeeContact`,
        { headers }
      );
      // console.log(data);
      setDATA(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    getSupervisors();
  }, []);

  if (!DATA) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          color={COLORS.blue}
          size={30}
          style={{bottom:40}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {DATA?.supervisor ? (
          <View>
            <Text style={styles.sectionHeader}>Class Supervisor</Text>
            <PersonCard
              name={DATA.supervisor.groupSupervisor.name}
              email={DATA.supervisor.groupSupervisor.email}
              phone={DATA.supervisor.groupSupervisor.phone}
              image={DATA.supervisor.groupSupervisor.profilePicture}
            />
          </View>
        ) : (
          ""
        )}
        {DATA?.busSupervisor ? (
          <View>
            <Text style={styles.sectionHeader}>Bus Supervisor</Text>
            <PersonCard
              name={DATA.busSupervisor.busSupervisor.name}
              email={DATA.busSupervisor.busSupervisor.email}
              phone={DATA.busSupervisor.busSupervisor.phone}
              image={DATA.busSupervisor.busSupervisor.profilePicture}
            />
          </View>
        ) : (
          ""
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    padding: 10,
    backgroundColor: "#314753",
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 35,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  cardContent: {
    marginLeft: 15,
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  emailButton: {
    backgroundColor: "#2386c8",
  },
  callButton: {
    backgroundColor: "#43A047",
  },
  actionText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 5,
  },
});
