import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminDashboard() {
  // These will be connected to the admin tRPC router
  const stats = {
    totalUsers: 0,
    freeUsers: 0,
    standardUsers: 0,
    premiumUsers: 0,
    monthlyRevenue: 0,
  };

  return (
    <LinearGradient colors={['#1A0A2E', '#2D1B4E', '#1A0A2E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>管理ダッシュボード</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>総会員数</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.freeUsers}</Text>
            <Text style={styles.statLabel}>フリー</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.standardUsers}</Text>
            <Text style={styles.statLabel}>スタンダード</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.premiumUsers}</Text>
            <Text style={styles.statLabel}>プレミアム</Text>
          </View>
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>今月の売上</Text>
          <Text style={styles.revenueAmount}>
            {stats.monthlyRevenue.toLocaleString()}円
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F2D06B', marginBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#aaa' },
  revenueCard: {
    backgroundColor: 'rgba(242,208,107,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(242,208,107,0.3)',
  },
  revenueLabel: { fontSize: 14, color: '#ccc', marginBottom: 8 },
  revenueAmount: { fontSize: 36, fontWeight: 'bold', color: '#F2D06B' },
});
