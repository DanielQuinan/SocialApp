import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      await login({ email, password });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao fazer login', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        required
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
        required
      />
      <Button title="Login" onPress={handleSubmit} />
      <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
        Não tem uma conta? Registre-se
      </Text>
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
  linkText: {
    color: '#0070f3',
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
