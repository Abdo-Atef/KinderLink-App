import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../utils/apis";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { wp } from "../../../utils/ResponsiveLayout";
import { COLORS, FONTS } from "../../../constants/theme";

const EventCard = ({ event, handleEnroll }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: event.eventPhotos[0].secure_url }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.eventName}>{event.eventName}</Text>
        <Text style={styles.price}>Price: {event.eventPrice} EGP</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="event-note" size={16} color="#888" />
          <Text style={styles.infoText}>
            Date: {dayjs(event.eventDate).format("YYYY/MM/DD")}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="people" size={16} color="#888" />
          <Text style={styles.infoText}>
            Capacity: {event.capacity}/{event.childrens.length}
          </Text>
        </View>
        <Text style={styles.description}>{event.eventDescribtion}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleEnroll(event.id)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MyEvents() {
  const [DATA, setDATA] = useState(null);
  const [Modalvisible, setModalvisible] = useState(false);
  const [EventId, setEventId] = useState(null);

  const getEvents = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = { token: userToken };

    try {
      const { data } = await axios.get(
        `${BASE_URL}/childeren/events/getAllEventsIAttended`,
        { headers }
      );
      setDATA(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEnroll = (id) => {
    setEventId(id);
    setModalvisible(true);
  };

  const handleSave = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = { token: userToken };
    // console.log(EventId);
    try {
      const { data } = await axios.delete(`${BASE_URL}/childeren/events/removeMyReservation/${EventId}`,{ headers });
      console.log(data);
      if (data.error) {
        Alert.alert("sorry you can't cancel the reservation ", data.error);
        setModalvisible(false);
      } else if (data.message) {
        Alert.alert("Done", data.message);
        getEvents();
        setModalvisible(false);
      }
    } catch (error) {
      console.error("Error adding events:", error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {DATA?.length > 0 ? (
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} handleEnroll={handleEnroll} />
          )}
          contentContainerStyle={styles.container}
          onRefresh={getEvents}
          refreshing={false}
        />
      ) : DATA?.length < 1 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "black", fontSize:wp(17) }}>You didn't reserve to any event yet</Text>
        </View>
      ) : (
        <ActivityIndicator
          style={styles.loadingIndicator}
          color="#1E90FF"
          size={25}
        />
      )}
      <Modal visible={Modalvisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Cancellation of the reservation</Text>
            </View>
            {/* Body */}
            <View style={styles.modalBody}>
              <Text style={styles.modalBodyText}>
                Are you sure you want to cancel the reservation of event or the trip?
              </Text>
            </View>
            {/* Footer */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#919191" }]}
                onPress={() => setModalvisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  textContainer: {
    padding: 15,
  },
  eventName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: "#FF6347",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#888888",
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: wp(15),
    fontWeight: "bold",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 370,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderColor: "gray",
    paddingBottom: 10,
    marginBottom: 10,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    marginBottom: 20,
  },
  modalBodyText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 7,
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "red",
    padding: 10,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
