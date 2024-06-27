import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { createPost } from '../services/post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUrl(result.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await createPost({ title, content, imageUrl }, token);
      setTitle('');
      setContent('');
      setImageUrl('');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao criar publicação', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Publicação</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        required
      />
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="Conteúdo"
        required
      />
      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Escolha uma imagem</Text>
      </TouchableOpacity>
      <Button title="Criar Publicação" onPress={handleSubmit} />
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
});
