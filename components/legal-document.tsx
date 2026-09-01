import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

export type LegalSection = { title: string; body: string };

export function LegalDocument({ title, updatedAt, sections }: { title: string; updatedAt: string; sections: LegalSection[] }) {
  return (
    <ImageBackground source={require('../assets/mitama/kirie.jpg')} style={styles.container} imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.updatedAt}>最終更新日：{updatedAt}</Text>
        <View style={styles.card}>
          {sections.map((section, index) => (
            <View key={section.title} style={index > 0 ? styles.sectionWithDivider : styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.body}>{section.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, paddingTop: 60, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#C45070', textAlign: 'center' },
  updatedAt: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#F9C0CC', padding: 20 },
  section: { paddingBottom: 18 },
  sectionWithDivider: { borderTopWidth: 1, borderTopColor: '#FDF1F3', paddingTop: 18, paddingBottom: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#3D1A1A', marginBottom: 8 },
  body: { fontSize: 14, color: '#4B5563', lineHeight: 23 },
});
