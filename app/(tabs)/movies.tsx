import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../lib/api';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

type Movie = { movie_id:number; title:string; duration:number|null; rating:string|null };

const TIME_SLOTS = ['11:00:00','13:30:00','16:00:00','18:30:00','21:00:00','23:00:00','24:00:00'];

const ROWS = ['A','B','C']; // 3 σειρές
const SEATS_PER_ROW = 8;   // μόνο 8 για να μη βγαίνει εκτός οθόνης

export default function MoviesByCinema() {
  const { cinema_id, name } = useLocalSearchParams<{ cinema_id:string; name?:string }>();
  const [movies,setMovies] = useState<Movie[]>([]);
  const [selectedMovie,setSelectedMovie] = useState<number | null>(null);

  // επόμενες 7 ημέρες
  const dateOptions = useMemo(() => {
    const arr: {value:string; label:string}[] = [];
    const weekdays = ['Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο','Κυριακή'];
    const pad = (n:number) => String(n).padStart(2,'0');

    for (let i=0; i<7; i++){
      const d = new Date();
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = pad(d.getMonth()+1);
      const dd = pad(d.getDate());
      const value = `${y}-${m}-${dd}`;
      const label = `${value} (${weekdays[d.getDay()]})`;
      arr.push({ value, label });
    }
    return arr;
  }, []);

  const [date, setDate] = useState<string>(dateOptions[0]?.value || '');
  const [time, setTime] = useState<string>(TIME_SLOTS[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/movies?cinema_id=${cinema_id}`);
      setMovies(data);
    })();
  }, [cinema_id]);

  const toggleSeat = (code: string) => {
    setSelectedSeats(prev =>
      prev.includes(code) ? prev.filter(s => s !== code) : [...prev, code]
    );
  };

  const seatGrid = useMemo(() => {
    const rows: string[][] = [];
    for (const r of ROWS) {
      const row: string[] = [];
      for (let i=1; i<=SEATS_PER_ROW; i++) row.push(`${r}${i}`);
      rows.push(row);
    }
    return rows;
  }, []);

  const reserve = async () => {
    if (!selectedMovie) return Alert.alert('Σφάλμα','Διάλεξε ταινία');
    if (!date || !time) return Alert.alert('Σφάλμα','Διάλεξε ημερομηνία - ώρα');
    if (selectedSeats.length === 0) return Alert.alert('Σφάλμα','Διάλεξε τουλάχιστον μία θέση');

    try {
      await api.post('/reservations', {
        cinema_id: Number(cinema_id),
        movie_id: selectedMovie,
        date,
        time,
        seat_numbers: selectedSeats.join(',')
      });
      Alert.alert('OK','Η κράτηση έγινε επιτυχώς!');
      setSelectedSeats([]);
    } catch (e:any) {
      Alert.alert('Αποτυχία', e?.response?.data?.error || 'Κάτι πήγε στραβά');
    }
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#4b0082', '#6a0dad']} // Dark cinema gradient
      style={{ flex:1, padding:16, gap:10 }}
    >
      <Text style={{ fontSize:22, fontWeight:'600', color:'#fff' }}>{name || 'Ταινίες'}</Text>

      {/* Λίστα ταινιών */}
      <FlatList
        data={movies}
        keyExtractor={x => String(x.movie_id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedMovie(item.movie_id)}
            style={[
              styles.card,
              selectedMovie === item.movie_id && styles.cardSelected
            ]}
          >
            <Text style={{ fontWeight:'700', color:'#fff' }}>{item.title}</Text>
            <Text style={{ color:'#ddd' }}>
              {item.duration ? `Διάρκεια: ${item.duration}ʼ  ` : ''}
              {item.rating ? `Κωδ.: ${item.rating}` : ''}
            </Text>
          </TouchableOpacity>
        )}
        style={{ marginBottom:8 }}
      />

      {/* Ημερομηνία */}
      <Text style={[styles.label, { color:'#fff' }]}>Ημερομηνία</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={date}
          onValueChange={setDate}
          dropdownIconColor="#fff"
          style={{ color:'#fff' }}
        >
          {dateOptions.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {/* Ώρα */}
      <Text style={[styles.label, { color:'#fff' }]}>Ώρα</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={time}
          onValueChange={setTime}
          dropdownIconColor="#fff"
          style={{ color:'#fff' }}
        >
          {TIME_SLOTS.map(t => (
            <Picker.Item key={t} label={t.slice(0,5)} value={t} />
          ))}
        </Picker>
      </View>

      {/* Θέσεις */}
      <Text style={[styles.label, { color:'#fff' }]}>Θέσεις</Text>
      <View style={{ gap:6 }}>
        {seatGrid.map((row, idx) => (
          <View key={idx} style={{ flexDirection:'row', gap:6 }}>
            {row.map(code => {
              const active = selectedSeats.includes(code);
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => toggleSeat(code)}
                  style={[styles.seat, active && styles.seatActive]}
                >
                  <Text style={{ fontWeight:'600', color: active ? '#000' : '#fff' }}>{code}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Κουμπί κράτησης */}
      <TouchableOpacity onPress={reserve} style={styles.reserveBtn}>
        <Text style={{ color:'#fff', fontWeight:'700', textAlign:'center' }}>Κράτηση</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding:12, borderWidth:1, borderRadius:10, marginVertical:6, borderColor:'#888',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  cardSelected: {
    backgroundColor:'#f4d7baff', borderColor:'#f08787ff'
  },
  label: {
    fontWeight:'700', marginTop:6
  },
  pickerBox: {
    borderWidth:1, borderRadius:10, overflow:'hidden', borderColor:'#888'
  },
  seat: {
    borderWidth:1, borderRadius:8, paddingVertical:8, paddingHorizontal:10, borderColor:'#aaa'
  },
  seatActive: {
    backgroundColor:'#f4d7baff', borderColor:'#FFA500'
  },
  reserveBtn: {
    backgroundColor:'#FFA500', padding:14, borderRadius:12, marginTop:10
  }
});
