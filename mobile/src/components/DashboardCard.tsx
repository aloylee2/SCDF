// src/components/DashboardCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface DashboardCardProps {
  title: string;
  value: string | number; // Ensure 'value' is defined and can be string or number
  iconSource: ImageSourcePropType; // Ensure 'iconSource' is defined as ImageSourcePropType
  color?: string; // 'color' is optional
}

export default function DashboardCard({ title, value, iconSource, color }: DashboardCardProps) {
  return (
    <View style={[styles.card, { borderColor: color || '#E0E0E0' }]}>
      <View style={styles.iconContainer}>
        <Image source={iconSource} style={[styles.icon, { tintColor: color || '#333' }]} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    marginBottom: 10,
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  title: {
    fontSize: 14,
    color: '#666',
  },
});