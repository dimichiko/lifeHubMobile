import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../types/habit';

interface Props {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  onEdit: () => void;
  week: number[];
}

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const colors = ['#222', '#FFD600', '#00FF8B'];

const ViewHabitModal: React.FC<Props> = ({ visible, habit, onClose, onEdit, week }) => {
  if (!habit) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.centered}>
        <View style={styles.modal}>
          <Text style={styles.title}>{habit.emoji} {habit.name}</Text>
          <View style={styles.row}>
            {week.map((val, idx) => (
              <View key={idx} style={[styles.square, { backgroundColor: colors[val] || '#222' }] }>
                <Text style={styles.day}>{days[idx]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.editBtn} onPress={onEdit}><Text style={styles.editText}>Editar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}><Text style={styles.closeText}>Cerrar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
  modal: { backgroundColor:'#1e1e1e', borderRadius:16, padding:24, width:'90%' },
  title: { color:'#fff', fontSize:20, marginBottom:12, textAlign:'center' },
  row: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:6 },
  square: { width:32, height:32, borderRadius:8, margin:2, alignItems:'center', justifyContent:'center' },
  day: { color:'#fff', fontWeight:'bold' },
  editBtn: { backgroundColor:'#00FF8B', borderRadius:8, padding:10, flex:1, margin:2, alignItems:'center' },
  editText: { color:'#000', fontWeight:'bold' },
  closeBtn: { backgroundColor:'#222', borderRadius:8, padding:10, flex:1, margin:2, alignItems:'center' },
  closeText: { color:'#fff' },
});

export default ViewHabitModal; 