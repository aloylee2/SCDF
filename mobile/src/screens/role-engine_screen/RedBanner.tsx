import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface RedBannerProps {
  text: string;
  visible?: boolean;
}

export const RedBanner: React.FC<RedBannerProps> = ({ text, visible = true }) => {
  if (!visible) return null;
  return (
    <View style={styles.bannerRow}>
        <Text style={styles.bannerText}>{text}</Text>
        <Image
        source={require('../../assets/role_engine/cpr_hero.png')} // Replace with your image path
        style={styles.bannerImage}
        resizeMode="contain"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'red',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 10,
  },
  
  // Obj Banner
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B22222',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    marginBottom: 8,
    position: 'relative',
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
    flex: 1,
  },
  bannerImage: {
    width: 120,
    height: 120,
    marginLeft: 8,
    position: 'absolute', 
    right: 18,
    top: -24,
    zIndex: 2,
  },
});