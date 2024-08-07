import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getMyMeals } from "../../../redux/parentSlice";

// Helper function to convert dayWeek number to day name
const getDayName = (dayWeek) => {
  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];
  return days[dayWeek];
};

const MealDetails = ({ meal }) => (
  <View style={styles.mealDetailsContainer}>
    <Image
      source={{ uri: meal.mealImages[0].secure_url }}
      style={styles.mealImage}
    />
    <View style={styles.mealTextContainer}>
      <Text style={styles.mealName}>{meal.mealName}</Text>
      <Text style={styles.mealInfo}>Price: ${meal.price}</Text>
      <Text style={styles.mealInfo}>Weight: {meal.weight}</Text>
      <Text style={styles.mealIngredients}>Ingredients:</Text>
      <Text style={styles.ingredient}>{meal.mealsIngredients.join(", ")}.</Text>
    </View>
  </View>
);

const MealCard = ({ data }) => (
  <React.Fragment>
    {data.meal1 || data.meal2 ? (
      <View style={styles.card}>
        <Text style={styles.day}>{getDayName(data.dayWeek)}</Text>
        {data.meal1 && <MealDetails meal={data.meal1} />}
        {data.meal2 && <MealDetails meal={data.meal2} />}
      </View>
    ) : (
      ""
    )}
  </React.Fragment>
);

export default function MyMeals() {
  const dispatch = useDispatch();
  const myMeals = useSelector((state) => state.parentProfile.myMeals);
  const [modalVisible, setModalVisible] = useState(true);

    const handleModalClose = () => {
    setModalVisible(false);
  };

  
  const handleSave = async () => {
    console.log('test');
  };
  useEffect(() => {
    dispatch(getMyMeals());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      {myMeals ? (
        <FlatList
          data={myMeals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MealCard data={item} />}
          onRefresh={() => dispatch(getMyMeals())}
          refreshing={false}
        />
      ) : (
        <Text style={styles.noMealsText}>No meals available.</Text>
      )}
      {/* <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Delete</Text>
                <Text style={styles.modalContent}>Are you sure you want to delete the meals of the day</Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleSave}
                  >
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleModalClose}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  card: {
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  day: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4A90E2",
  },
  mealDetailsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  mealTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: "#4A90E2",
    borderWidth: 1,
  },
  mealName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  mealInfo: {
    fontSize: 16,
    color: "#666",
    marginVertical: 2,
  },
  mealIngredients: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    fontWeight: "bold",
  },
  ingredient: {
    fontSize: 14,
    color: "#666",
  },
  noMealsText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
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
    fontSize:16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 7,
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "#007BFF",
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
