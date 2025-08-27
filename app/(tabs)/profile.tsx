import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type R = { reservation_id:number; date:string; time:string; seat_numbers:string; title:string; cinema_name:string };

export default function Profile() {
  const [items, setItems] = useState<R[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/user/reservations');
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // φορτώνει όταν μπαίνεις στο tab
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const remove = async (id: number) => {
    Alert.alert('Διαγραφή', 'Θέλεις σίγουρα να διαγράψεις αυτήν την κράτηση;', [
      { text: 'Άκυρο', style: 'cancel' },
      { text: 'Διαγραφή', style: 'destructive', onPress: async () => {
          await api.delete(`/reservations/${id}`);
          Alert.alert('OK', 'Διαγράφηκε');
          load();
        } 
      }
    ]);
  };

  if (!user) {
    return (
      <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={styles.fill}>
        <View style={styles.centerBox}>
          <Text style={[styles.title, { marginBottom: 8 }]}>Δεν είσαι συνδεδεμένος</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={styles.btnPrimary}>
            <Text style={styles.btnText}>Πήγαινε στο Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ff9a9e', '#fad0c4']} style={styles.fill}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Γεια σου, {user.name}</Text>
          <TouchableOpacity onPress={logout} style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>Αποσύνδεση</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Οι κρατήσεις μου</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FFA500" style={{ marginTop: 16 }} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={x => String(x.reservation_id)}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>
                  {item.cinema_name} • {new Date(item.date).toLocaleDateString('el-GR')} {item.time}
                </Text>
                <Text style={styles.cardSub}>Θέσεις: {item.seat_numbers}</Text>

                <TouchableOpacity onPress={() => remove(item.reservation_id)} style={styles.btnDanger}>
                  <Text style={styles.btnText}>Διαγραφή</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: '#222', fontStyle: 'italic', marginTop: 8 }}>
                Δεν έχεις κρατήσεις ακόμη.
              </Text>
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '800', color: '#222' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: { fontWeight: '800', fontSize: 16, color: '#222' },
  cardSub: { color: '#444', marginTop: 2 },
  btnPrimary: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
  },
  btnDanger: {
    backgroundColor: '#e11d48',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  btnOutlineText: { color: '#111', fontWeight: '700' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});
