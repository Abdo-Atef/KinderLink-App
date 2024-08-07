import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/CustomButton";
import { hp, wp } from "../../../utils/ResponsiveLayout";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../utils/apis";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../../constants/theme";
import dayjs from "dayjs";
import { FontAwesome6 } from "@expo/vector-icons";
import { getMyApologies } from "../../../redux/parentSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal";

export default function Apologies() {
  let navigation = useNavigation();
  let dispatch = useDispatch();
  const [ModaIsVisible, setModaIsVisible] = useState(false);
  const { myApologies, apologiesLoading } = useSelector((state) => state.parentProfile);
  const [DeletedItemId, setDeletedItemId] = useState(null);
  const [deleteLoading, setdeleteLoading] = useState(false);

  const deleteHandler = (id) => {
    setDeletedItemId(id);
    setModaIsVisible(true);
  };

  const deleteItem = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = { token: userToken };
    const { data } = await axios.delete(`${BASE_URL}/childeren/aplogizes/deleteApologize/${DeletedItemId}`, { headers });
    if (data.success) {
      setModaIsVisible(false);
      dispatch(getMyApologies());
    }
  };

  useEffect(() => {
    dispatch(getMyApologies());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomButton
          title={"Add Apology"}
          buttonStyle={styles.addButton}
          titleStyles={{fontSize:wp(14)}}
          pressHandler={() => navigation.navigate("NewApology")}
        />
      </View>
      {myApologies ? (
        <FlatList
          data={myApologies}
          renderItem={({ item }) => (
            <Item
              title={item.reasonForAbsence}
              date={item.dateOfAbsence}
              id={item.id}
              deleteHandler={deleteHandler}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <CustomButton
          icon={true}
          buttonStyle={styles.loadingButton}
          spinColor={COLORS.blue}
          spinSize={wp(30)}
        />
      )}{myApologies?.length < 1 ? 
      <View style={{flex:1, alignItems:'center', bottom:40}}>
        <Text style={{fontSize:17}}>There are no apologies yet</Text>
      </View>:''}

      <CustomModal
        headerTitle={"Delete the apology"}
        bodyContent={"Are you sure you want to delete the apology?"}
        buttonTitle={"Delete"}
        ModaIsVisible={ModaIsVisible}
        setModaIsVisible={setModaIsVisible}
        handleFunction={deleteItem}
      />
    </SafeAreaView>
  );
}

const Item = ({ title, date, deleteHandler, id }) => (
  <View style={styles.item}>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.dateStyles}>{dayjs(date).format("YYYY-MMM-DD")}</Text>
    </View>
    <View style={styles.iconsContainer}>
      <TouchableOpacity onPress={() => deleteHandler(id)}>
        <FontAwesome6 name="trash-can" size={24} color="red" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    marginVertical: hp(20),
  },
  addButton: {
    backgroundColor: COLORS.blue,
    alignSelf: "flex-end",
    paddingVertical: hp(12),
    paddingHorizontal: wp(20),
    borderRadius: wp(5),
    marginHorizontal: wp(16),
  },
  loadingButton: {
    backgroundColor: "transparent",
    marginVertical: hp(60),
  },
  item: {
    marginHorizontal: wp(16),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(8),
    paddingHorizontal: wp(20),
    paddingVertical: hp(20),
    marginVertical: hp(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: wp(18),
    fontWeight: "600",
    color: COLORS.dark,
  },
  dateStyles: {
    fontSize: wp(15),
    color: COLORS.gray,
    marginTop: hp(8),
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
