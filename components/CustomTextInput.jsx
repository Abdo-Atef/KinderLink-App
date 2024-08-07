import { StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants/theme'

export default function CustomTextInput({ borderColor,inputStyles , ...props}) {
  return (
    <TextInput
    placeholderTextColor={'#d6d6d6'}
    style={[styles.input, {borderColor:borderColor}, inputStyles]}
    cursorColor={COLORS.blue}
    {...props}
    />
  )
}

const styles = StyleSheet.create({
  input:{
    borderWidth:1,
    borderRadius:SIZES.small,
    padding:SIZES.small,
    paddingHorizontal:SIZES.small + 10,
    marginVertical:SIZES.small,
    color:COLORS.black
  }
})