import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { INITIAL_CHARACTERS } from '../../constants/characters';

export default function AdminCharactersScreen() {
  const [characters] = useState(INITIAL_CHARACTERS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEdit = (id: number) => {
    const char = characters.find(c => c.id === id);
    if (char) {
      setEditingId(id);
      setEditName(char.name);
      setEditDescription(char.description);
    }
  };

  const handleSave = async () => {
    // Will call tRPC character.upsert
    Alert.alert('保存', 'キャラクター情報を保存しました（実装予定）');
    setEditingId(null);
  };

  return (
    <LinearGradient colors={['#1A0A2E', '#2D1B4E', '#1A0A2E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>キャラクター管理</Text>
        <Text style={styles.subtitle}>むすび族キャラの画像・説明を編集</Text>

        {characters.map((char) => (
          <View key={char.id} style={styles.charCard}>
            <View style={styles.charHeader}>
              <View style={[styles.attributeDot, {
                backgroundColor:
                  char.attribute === 'fire' ? '#E74C3C' :
                  char.attribute === 'water' ? '#3498DB' :
                  char.attribute === 'wind' ? '#2ECC71' : '#F39C12'
              }]} />
              <Text style={styles.charName}>{char.name}</Text>
              <Text style={styles.charNameJa}>{char.nameJa}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(char.id)}
              >
                <Text style={styles.editButtonText}>編集</Text>
              </TouchableOpacity>
            </View>

            {editingId === char.id ? (
              <View style={styles.editForm}>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="キャラ名"
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="説明文"
                  placeholderTextColor="#888"
                  multiline
                  numberOfLines={3}
                />
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>保存</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditingId(null)}
                  >
                    <Text style={styles.cancelButtonText}>キャンセル</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.charDescription}>{char.description}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F2D06B', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#ccc', marginBottom: 24 },
  charCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  charHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  attributeDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  charName: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginRight: 8 },
  charNameJa: { fontSize: 14, color: '#aaa', flex: 1 },
  editButton: {
    backgroundColor: 'rgba(242,208,107,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editButtonText: { color: '#F2D06B', fontSize: 12 },
  charDescription: { fontSize: 13, color: '#bbb', lineHeight: 20 },
  editForm: { marginTop: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  editActions: { flexDirection: 'row', gap: 8 },
  saveButton: { backgroundColor: '#F2D06B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveButtonText: { color: '#1A0A2E', fontWeight: 'bold', fontSize: 14 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 8 },
  cancelButtonText: { color: '#aaa', fontSize: 14 },
});
