import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import placeholderImage from "../assets/placeholderImage.png";

const CustomDrawerContent = (props) => {

  const user = {
    name: props?.profileData?.name,
    parentName: props?.profileData?.parentName,
    email: props?.profileData?.email,
    profilePicture: props?.profileData?.profilePicture?.secure_url
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {user?.profilePicture ?  
        <Image source={{ uri: user?.profilePicture?.replace(/.*https:\/\//, 'https://') }} style={styles.profilePicture} />
        :
        <Image source={placeholderImage} style={styles.profilePicture} />
        }
        <View style={styles.userInfo}>
          {user.parentName? <Text style={styles.name}>{user.parentName}</Text> :''}
          {user.name? <Text style={styles.name}>{user.name}</Text> :''}
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3498db',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom:10
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  editIcon: {
    marginLeft: 'auto',
    padding: 8,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default CustomDrawerContent;
