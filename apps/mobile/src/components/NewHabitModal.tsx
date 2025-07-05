import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Habit } from '../types/habit';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
}

const NewHabitModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [goal, setGoal] = useState('3');
  const [type, setType] = useState<'habit' | 'dream'>('habit');
  const [dreamText, setDreamText] = useState('');

  const handleSave = () => {
    if (!name || !emoji) return;
    onSave({
      id: Date.now().toString(),
      name,
      emoji,
      goal: Number(goal),
      type,
    });
    setName(''); setEmoji(''); setGoal('3'); setType('habit'); setDreamText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView style={styles.centered} behavior="padding">
        <View style={styles.modal}>
          <Text style={styles.title}>Nuevo Hábito</Text>
          <TextInput style={styles.input} placeholder="Emoji" value={emoji} onChangeText={setEmoji} maxLength={2} />
          <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Meta diaria" value={goal} onChangeText={setGoal} keyboardType="numeric" />
          <View style={styles.row}>
            <TouchableOpacity style={[styles.typeBtn, type==='habit'&&styles.active]} onPress={()=>setType('habit')}><Text style={styles.typeText}>Hábito</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.typeBtn, type==='dream'&&styles.active]} onPress={()=>setType('dream')}><Text style={styles.typeText}>Sueño</Text></TouchableOpacity>
          </View>
          {type==='dream' && <TextInput style={[styles.input, {height:60}]} placeholder="Describe tu sueño..." value={dreamText} onChangeText={setDreamText} multiline />}
          <View style={styles.row}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveText}>Guardar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
  modal: { backgroundColor:'#1e1e1e', borderRadius:16, padding:24, width:'90%' },
  title: { color:'#fff', fontSize:20, marginBottom:12, textAlign:'center' },
  input: { backgroundColor:'#222', color:'#fff', borderRadius:8, padding:10, marginBottom:10 },
  row: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:6 },
  typeBtn: { flex:1, margin:2, padding:10, borderRadius:8, backgroundColor:'#222', alignItems:'center' },
  active: { backgroundColor:'#00FF8B' },
  typeText: { color:'#fff' },
  saveBtn: { backgroundColor:'#00FF8B', borderRadius:8, padding:10, flex:1, margin:2, alignItems:'center' },
  saveText: { color:'#000', fontWeight:'bold' },
  cancelBtn: { backgroundColor:'#222', borderRadius:8, padding:10, flex:1, margin:2, alignItems:'center' },
  cancelText: { color:'#fff' },
});

export default NewHabitModal; 