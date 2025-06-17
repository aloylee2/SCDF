// src/components/ActionCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

interface ActionCardProps {
  title: string;
  description: string;
  iconSource: ImageSourcePropType; // Ensure 'iconSource' is defined as ImageSourcePropType
  onPress: () => void; // Ensure 'onPress' is defined as a function that returns void
}

export default function ActionCard({ title, description, iconSource, onPress }: ActionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={iconSource} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 280,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#666',
  },
});