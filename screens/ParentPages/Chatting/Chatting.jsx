import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../../constants/theme";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../constants/firebase_config";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getProfileData } from "../../../redux/parentSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Chatting({ navigation }) {
  const dispatch = useDispatch();
  const { childData } = useSelector((state) => state.parentProfile);
  const [GroupMessages, setGroupMessages] = useState(null);
  const flatListRef = useRef();

  let validation1 = Yup.object({
    message: Yup.string().required("The message is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const docRef = doc(db, "chattingGroups", childData?.groupId.id);
      const messsagesRef = collection(docRef, "messages");
      await addDoc(messsagesRef, {
        userName: childData?.parentName,
        userId: childData?.id,
        message: values.message,
        profileUrl: childData?.profilePicture.secure_url,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getProfileData());
  }, []);

  useEffect(() => {
    if (childData?.groupId) {
      const docRef = doc(db, "chattingGroups", childData?.groupId.id);
      const messsagesRef = collection(docRef, "messages");
      const q = query(messsagesRef, orderBy("createdAt", "asc"));
      const unsub = onSnapshot(q, (snapshot) => {
        const allMessages = snapshot.docs.map((doc) => doc.data());
        setGroupMessages(allMessages);
        // Scroll to end when messages are updated
        if (flatListRef.current && allMessages.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      });
      return unsub;
    }
  }, [childData]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.userId === childData?.id
          ? { alignSelf: "flex-start" }
          : { alignSelf: "flex-end", flexDirection: "row-reverse" },
      ]}
    >
      <View style={styles.messageHeader}>
        <Image
          source={{ uri: item.profileUrl.replace(/.*https:\/\//, "https://") }}
          style={[
            styles.userImage,
            item.userId === childData?.id
              ? { marginRight: 10 }
              : { marginLeft: 10 },
          ]}
        />
      </View>
      <View
        style={[
          item.userId === childData?.id
            ? styles.selfMessage
            : styles.otherMessage,
        ]}
      >
        <View
          style={{ flexDirection: "row-reverse", alignItems: "center", gap: 3 }}
        >
          {item.role ? (
            <MaterialCommunityIcons
              name="crown-circle"
              size={22}
              color="orange"
            />
          ) : (
            ""
          )}
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {dayjs(item.createdAt.toDate()).format("HH:mm")}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {childData?.groupId ? (
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          {GroupMessages ? (
            <FlatList
              ref={flatListRef}
              data={GroupMessages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.chatContainer}
            />
          ) : (
            <ActivityIndicator
              style={styles.chatContainer}
              size={30}
              color={COLORS.blue}
            />
          )}

          <Formik
            initialValues={{ message: "" }}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm();
            }}
            validationSchema={validation1}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  onChangeText={handleChange("message")}
                  onBlur={handleBlur("message")}
                  value={values.message}
                  placeholder="Type message..."
                />
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.sendButton}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 17, color: "blue" }}>
            You are not in a group
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: "70%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  selfMessage: {
    borderRadius: 10,
    padding: 10,
    alignSelf: "flex-end",
    backgroundColor: "#d1e7dd",
    minWidth: 100,
  },
  otherMessage: {
    borderRadius: 10,
    padding: 10,
    alignSelf: "flex-start",
    backgroundColor: "#e2e3e5",
    minWidth: 100,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 5,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  messageText: {
    fontSize: 16,
    marginVertical: 3,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f9fa",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: wp(16),
    color: "#333",
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
