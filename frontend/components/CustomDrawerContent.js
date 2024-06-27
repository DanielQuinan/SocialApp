import React, { useContext } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AuthContext from '../context/AuthContext';

export default function CustomDrawerContent(props) {
  const { user, logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <DrawerItemList {...props} />
      {user && (
        <View style={styles.userInfo}>
          {user.profileImageUrl && (
            <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
          )}
          <Text style={styles.userName}>Bem-vindo, {user.name}</Text>
          <Button title="Logout" onPress={logout} />
        </View>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    height: 80,
    width: 80,
  },
  userInfo: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
