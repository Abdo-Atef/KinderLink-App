import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getAllMeals } from '../../../redux/parentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { hp, wp } from '../../../utils/ResponsiveLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils/apis';
import axios from 'axios';

const MealsPage = ({ navigation }) => {
  let dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState('meal1');
  const [MealId, setMealId] = useState(null);
  const { allMeals } = useSelector((state) => state.parentProfile);
  // console.log(allMeals);
  const handleAdd = (meal) => {
    setModalVisible(true);
    setMealId(meal.id)
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const headers = {
        token: userToken,
      };

      const params = {
        meals: [{dayWeek:Number(selectedDay), [selectedMeal]:MealId}]
      }
      try {
        const { data } = await axios.patch(`${BASE_URL}/childeren/meals/assignMealToChild`,params, {
          headers,
        });
        // console.log(data.childMeals.meals);
        if (data.error) {
          Alert.alert('Something is wrong',data.error)
        }else if(data.success){
          Alert.alert('Done',data.message)
          setModalVisible(false);
        }
      } catch (error) {
        console.log(error);
      }
  };

  useEffect(() => {
    dispatch(getAllMeals());
  }, []);

  return (
    <View style={styles.container}>
      {allMeals ?
        <FlatList
          data={allMeals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <Image source={{ uri: item.mealImages[0].secure_url }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.mealName}</Text>
                <Text style={styles.ingredients}>Ingredients: {item.mealsIngredients.join(', ')}.</Text>
                <Text style={styles.price}>Price: ${item.price}</Text>
                <Text style={styles.weight}>Weight: {item.weight}g</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.button} onPress={() => handleAdd(item)}>
                    <Ionicons name="add-circle-outline" size={22} color="white" />
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
        : ''}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Day and Meal</Text>
                <Text style={styles.modalLabel}>Day of the Week:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedDay}
                    onValueChange={(itemValue) => setSelectedDay(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item value="0" label="Saturday" />
                    <Picker.Item value="1" label="Sunday" />
                    <Picker.Item value="2" label="Monday" />
                    <Picker.Item value="3" label="Tuesday" />
                    <Picker.Item value="4" label="Wednesday" />
                    <Picker.Item value="5" label="Thursday" />
                  </Picker>
                </View>

                <Text style={styles.modalLabel}>Meal:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedMeal}
                    onValueChange={(itemValue) => setSelectedMeal(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Meal 1" value="meal1" />
                    <Picker.Item label="Meal 2" value="meal2" />
                  </Picker>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform:'capitalize'
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  price: {
    fontSize: wp(14),
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 5,
  },
  weight: {
    fontSize: wp(14),
    color: '#28a745',
    marginTop: 5,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical:hp(7),
    paddingHorizontal: wp(14),
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize:wp(14),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 370,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 7,
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MealsPage;
