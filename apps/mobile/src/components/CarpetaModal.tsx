import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Carpeta } from '../types/habit';

const colores = ['#6366F1', '#F59E42', '#10B981', '#EF4444', '#F472B6', '#FBBF24', '#3B82F6'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (carpeta: Carpeta) => void;
}

const CarpetaModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(colores[0]);

  const handleSave = () => {
    if (!nombre.trim()) return;
    onSave({ id: Date.now().toString(), nombre: nombre.trim(), color });
    setNombre('');
    setColor(colores[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView style={styles.centered} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modal}>
          <Text style={styles.title}>Nueva Carpeta</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la carpeta"
            value={nombre}
            onChangeText={setNombre}
          />
          <Text style={styles.label}>Color:</Text>
          <View style={styles.colorRow}>
            {colores.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorCircle, { backgroundColor: c, borderWidth: color === c ? 3 : 1, borderColor: color === c ? '#111827' : '#ccc' }]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.18)' },
  modal: { backgroundColor:'#fff', borderRadius:16, padding:24, width:'88%' },
  title: { color:'#111827', fontSize:20, fontWeight:'bold', marginBottom:18, textAlign:'center' },
  input: { backgroundColor:'#F3F4F6', color:'#111827', borderRadius:8, padding:10, marginBottom:14, fontSize:16 },
  label: { color:'#111827', fontSize:15, marginBottom:6 },
  colorRow: { flexDirection:'row', marginBottom:16, justifyContent:'center' },
  colorCircle: { width:32, height:32, borderRadius:16, marginHorizontal:6 },
  row: { flexDirection:'row', justifyContent:'space-between', marginTop:10 },
  saveBtn: { flex:1, backgroundColor:'#111827', borderRadius:8, padding:12, alignItems:'center', marginRight:6 },
  saveText: { color:'#fff', fontWeight:'bold', fontSize:16 },
  cancelBtn: { flex:1, backgroundColor:'#F3F4F6', borderRadius:8, padding:12, alignItems:'center', marginLeft:6 },
  cancelText: { color:'#111827', fontWeight:'bold', fontSize:16 },
});

export default CarpetaModal; 