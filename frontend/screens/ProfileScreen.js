import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const data = await getProfile(token);
          setName(data.name);
          setProfileImagePreview(data.profileImageUrl);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário', error);
      }
    };

    fetchUser();
  }, []);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      setProfileImagePreview(result.uri);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    if (password) {
      formData.append('password', password);
    }
    if (profileImage) {
      let localUri = profileImage;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append('profileImage', { uri: localUri, name: filename, type });
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await updateProfile(formData, token);
      updateUser();
      Alert.alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      {profileImagePreview && <Image source={{ uri: profileImagePreview }} style={styles.profileImage} />}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome"
        required
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Escolha uma imagem</Text>
      </TouchableOpacity>
      <Button title="Salvar" onPress={handleSubmit} />
      <Button title="Logout" onPress={logout} color="#ff0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
  imagePicker: {
    backgroundColor: '#0070f3',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
});
