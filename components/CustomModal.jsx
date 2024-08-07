import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { hp, wp } from "../utils/ResponsiveLayout";
import { FONTS } from "../constants/theme";
import CustomButton from "./CustomButton";

export default function CustomModal({
  headerTitle,
  bodyContent,
  ModaIsVisible,
  setModaIsVisible,
  buttonTitle,
  handleFunction
}) {
  return (
    <Modal
      style={styles.modal}
      isVisible={ModaIsVisible}
      backdropOpacity={0.6}
      backdropColor="black"
      onBackdropPress={()=> setModaIsVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>{headerTitle}</Text>
        </View>
        <View style={styles.modalBody}>
          <Text style={styles.modalBodyText}>{bodyContent}</Text>
        </View>
        <View style={styles.buttonsCo}>
          <CustomButton
            buttonStyle={{ backgroundColor: "red" }}
            titleStyles={{ fontSize: wp(14) }}
            title={buttonTitle}
            pressHandler={handleFunction}
          />
          <CustomButton
            buttonStyle={{ backgroundColor: "gray" }}
            titleStyles={{ fontSize: wp(14) }}
            title="Cancel"
            pressHandler={() => setModaIsVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    paddingVertical: hp(20),
    borderRadius: wp(3),
    width: wp(330),
  },
  modalHeader: {
    paddingHorizontal: wp(20),
    borderBottomColor: "#9e9e9eb3",
    borderBottomWidth: 1,
    paddingTop: hp(5),
    paddingBottom: hp(20),
  },
  modalHeaderText: {
    fontSize: wp(17),
    fontFamily: FONTS.bold,
    color: "red",
  },
  modalBody: {
    paddingHorizontal: wp(20),
    borderBottomColor: "#9e9e9eb3",
    borderBottomWidth: 1,
    paddingVertical: hp(30),
  },
  modalBodyText: {
    fontSize: wp(14),
    fontFamily: FONTS.regular,
  },
  buttonsCo: {
    paddingTop: hp(25),
    paddingBottom: hp(5),
    paddingHorizontal: wp(20),
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: wp(7),
  },
});
