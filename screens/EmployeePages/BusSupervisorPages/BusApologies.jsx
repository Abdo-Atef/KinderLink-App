import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../utils/apis";
import { COLORS } from "../../../constants/theme";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import CustomButton from "../../../components/CustomButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import dayjs from "dayjs";
import { FontAwesome } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

function BusApologies() {
  const [date, setDate] = useState(new Date());
  const [DATA, setDATA] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [NotHaveGroup, setNotHaveGroup] = useState(false);

  const onChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setDate(selectedDate);
      filterDataByDate(selectedDate);
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

  const getApologies = async () => {
    setIsLoading(true);
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    let { data } = await axios.get(
      `${BASE_URL}/employees/aplogizesForBusSupervisor/getAplogizesForBusSupervisorByFilter`,
      { headers }
    );
    if (data.error) {
      if (data.error == "You are not joined as a bus supervisor already") {
        setNotHaveGroup(true);
      }
      else{
        Alert.alert("There is an error", data.error);
      }
    } else {
      setDATA(data.allAplogizes);
      filterDataByDate(date, data.allAplogizes); // Ensure initial data is filtered
    }
    setIsLoading(false);
  };

  const filterDataByDate = (selectedDate, data = DATA) => {
    const filtered = data.filter((item) =>
      dayjs(item.dateOfAbsence).isSame(dayjs(selectedDate), "day")
    );
    // console.log(filtered);
    setFilteredData(filtered);
  };

  useEffect(() => {
    getApologies();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ position: "relative", width: "100%" }}
        onPress={showMode}
      >
        <TextInput
          style={styles.input}
          value={dayjs(date).format("YYYY/MM/DD")}
          editable={false}
          pointerEvents="none"
        />
        <View style={styles.iconCo}>
          <FontAwesome name="calendar" size={24} color={COLORS.blue} />
        </View>
      </TouchableOpacity>
      {!IsLoading ? (
        <>
          {!NotHaveGroup ? (
            <>
              {filteredData?.length > 0 ? (
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => <Item data={item} />}
                  keyExtractor={(item) => item.id}
                  onRefresh={getApologies}
                  refreshing={IsLoading}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>There are no apologies</Text>
                </View>
              )}
            </>
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
    </SafeAreaView>
  );
}

const Item = ({ data }) => {
  const { from, dateOfAbsence } = data;

  return (
    <View style={styles.item}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: from.profilePicture.secure_url }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{from.parentName}</Text>
        <Text style={styles.subtitle}>{from.email}</Text>
        <Text style={[styles.subtitle, { textTransform: "capitalize" }]}>
          Child: {from.childName}
        </Text>
        <Text style={styles.subtitle}>{from.region}</Text>
        <Text style={styles.date}>
          Absent on: {dayjs(dateOfAbsence).format("YYYY-MM-DD")}
        </Text>
      </View>
      <Icon
        name="message"
        size={wp(24)}
        color={COLORS.blue}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(10),
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(16),
    marginVertical: hp(8),
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  imageContainer: {
    marginRight: wp(16),
  },
  profileImage: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: wp(18),
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: wp(14),
    color: "#777",
    marginTop: hp(4),
  },
  date: {
    fontSize: wp(14),
    color: COLORS.blue,
    marginTop: hp(4),
  },
  icon: {
    marginLeft: wp(10),
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom:40
  },
  noDataText: {
    fontSize: wp(18),
    // color: COLORS.blue,
    marginTop: hp(20),
  },
});

export default BusApologies;
