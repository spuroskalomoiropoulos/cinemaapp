import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Cinema = { cinema_id:number; name:string; location:string; description:string|null };

export default function Cinemas() {
  const [search,setSearch] = useState('');
  const [data,setData] = useState<Cinema[]>([]);
  const router = useRouter();

  const load = async () => {
    const url = search ? `/cinemas?search=${encodeURIComponent(search)}` : '/cinemas';
    const { data } = await api.get(url);
    setData(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.fill}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Κινηματογράφοι</Text>

        <TextInput
          placeholder="Αναζήτηση (όνομα/τοποθεσία)"
          placeholderTextColor="#cfd8dc"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={load}
          style={styles.input}
        />

        <FlatList
          data={data}
          keyExtractor={x => String(x.cinema_id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({
                pathname:'/(tabs)/movies',
                params:{ cinema_id:String(item.cinema_id), name:item.name }
              })}
              style={styles.card}
              activeOpacity={0.85}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.location}</Text>
              {item.description ? (
                <Text style={styles.cardDesc}>{item.description}</Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#a1cdebff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  cardTitle: {
    color: '#fd4949ff',
    fontWeight: '700',
    marginBottom: 2,
    fontSize: 16,
  },
  cardSubtitle: {
    color: '#969fa2ff',
    marginBottom: 4,
  },
  cardDesc: {
    color: '#eceff1',
    opacity: 0.9,
  },
});
