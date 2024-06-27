import React, { useContext } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import AuthContext from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={styles.nav}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <View style={styles.navItems}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        {user ? (
          <>
            {user.profileImageUrl && (
              <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
            )}
            <Text>Bem-vindo, {user.name}</Text>
            <Button title="Criar Publicação" onPress={() => navigation.navigate('CreatePost')} />
            <Button title="Editar Perfil" onPress={() => navigation.navigate('Profile')} />
            <Button title="Logoff" onPress={logout} />
          </>
        ) : (
          <>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            <Button title="Registrar" onPress={() => navigation.navigate('Register')} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#333',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: 40,
    width: 40,
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
});
