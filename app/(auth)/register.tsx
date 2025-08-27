import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { api } from '../../lib/api';

export default function Register() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const router = useRouter();

  const onRegister = async () => {
    if (!name || !email || !password) return Alert.alert('Σφάλμα','Συμπλήρωσε όλα τα πεδία');
    try {
      await api.post('/register', { name, email, password });
      Alert.alert('OK','Ο λογαριασμός δημιουργήθηκε. Κάνε login.');
      router.replace('/(auth)/login');
    } catch (e:any) {
      Alert.alert('Αποτυχία', e?.response?.data?.error || 'Κάτι πήγε στραβά');
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:16, gap:8 }}>
      <Text style={{ fontSize:24, marginBottom:12 }}>Εγγραφή</Text>
      <TextInput placeholder="Όνομα"
        style={{ borderWidth:1, padding:10, borderRadius:6 }} value={name} onChangeText={setName}/>
      <TextInput placeholder="Email" autoCapitalize="none"
        style={{ borderWidth:1, padding:10, borderRadius:6 }} value={email} onChangeText={setEmail}/>
      <TextInput placeholder="Κωδικός" secureTextEntry
        style={{ borderWidth:1, padding:10, borderRadius:6 }} value={password} onChangeText={setPassword}/>
      <Button title="Register" onPress={onRegister}/>
      <Link href="/(auth)/login">Έχεις ήδη λογαριασμό; Login</Link>
    </View>
  );
}
