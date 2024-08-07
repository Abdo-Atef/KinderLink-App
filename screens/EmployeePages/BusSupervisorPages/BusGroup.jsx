import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../utils/apis";
import { COLORS } from "../../../constants/theme";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import CustomButton from "../../../components/CustomButton";
import { MaterialIcons } from '@expo/vector-icons';

function BusGroup() {
  const [GroupInfo, setGroupInfo] = useState(null);
  const [DATA, setDATA] = useState(null);
  const [AlterDATA, setAlterDATA] = useState(null);

  const getGroupMembers = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(
        `${BASE_URL}/employees/getSpBusForBusSupervisor`,
        {
          headers,
        }
      );
      setGroupInfo(data.group);
      setDATA(data.bus.children);
      setAlterDATA(data.bus.children);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (term) => {
    if (term) {
      const filterdData = AlterDATA.filter((value) => value.parentName.toLowerCase().includes(term))
      setDATA(filterdData);
    } else {
      setDATA(AlterDATA);
    }
  };

  useEffect(() => {
    getGroupMembers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {DATA ? (
        <>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#777" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              onChangeText={handleSearchChange}
            />
          </View>
          {DATA.length > 0 ? (
            <FlatList
              data={DATA}
              renderItem={({ item }) => <Item data={item} />}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>There are no Members</Text>
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
  return (
    <View style={styles.item}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data.profilePicture.secure_url }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{data.parentName}</Text>
        <Text style={styles.subtitle}>{data.email}</Text>
        <Text style={[styles.subtitle, { textTransform: "capitalize" }]}>
          Child: {data.childName}
        </Text>
        <Text style={styles.subtitle}>{data.region}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(10),
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    marginBottom: 16,
    alignItems: 'center',
  },
  groupName: {
    fontSize: 20,
    fontWeight: '600',
  },
  groupCapacity: {
    fontSize: 17,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp(5),
    paddingVertical: wp(10),
    paddingHorizontal: wp(15),
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: wp(16),
    color: "#333",
    marginLeft: wp(10),
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: wp(18),
    color: '#555',
    marginTop: hp(20),
  },
});

export default BusGroup;
