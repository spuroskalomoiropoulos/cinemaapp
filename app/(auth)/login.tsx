import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { api } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  const onLogin = async () => {
    if (!email || !password) return Alert.alert('Σφάλμα','Συμπλήρωσε email και κωδικό');
    try {
      const { data } = await api.post('/login', { email, password });
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      router.replace('/(tabs)'); // μετά το login πάμε στα tabs
    } catch (e:any) {
      Alert.alert('Αποτυχία', e?.response?.data?.error || 'Κάτι πήγε στραβά');
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:16, gap:8 }}>
      <Text style={{ fontSize:24, marginBottom:12 }}>Σύνδεση</Text>
      <TextInput placeholder="Email" autoCapitalize="none"
        style={{ borderWidth:1, padding:10, borderRadius:6 }} value={email} onChangeText={setEmail}/>
      <TextInput placeholder="Κωδικός" secureTextEntry
        style={{ borderWidth:1, padding:10, borderRadius:6 }} value={password} onChangeText={setPassword}/>
      <Button title="Login" onPress={onLogin}/>
      <Link href="/(auth)/register">Δεν έχεις λογαριασμό; Register</Link>
    </View>
  );
}
