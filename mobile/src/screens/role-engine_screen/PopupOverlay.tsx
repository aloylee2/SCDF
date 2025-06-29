import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ImageSourcePropType } from 'react-native';

type PopupOverlayProps = {
  visible: boolean;
  onClose: () => void;
  bannerText: string;
  imageSource?: ImageSourcePropType;
  description: string;
  acceptLabel?: string;
};

export default function PopupOverlay({
  visible,
  onClose,
  bannerText,
  imageSource,
  description,
}: PopupOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlayBackground}>
        <View style={styles.topOverlayBanner}>
          <Text style={styles.topBannerText}>{bannerText}</Text>
        </View>
        <View style={styles.overlayBox}>
          <View style={styles.overlayContentBox}>
            {imageSource && (
              <Image
                source={imageSource}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.bannerText}>{description}</Text>
          </View>
          <View style={styles.buttonRow}>
            <View style={{ flex: 1 }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <TouchableOpacity style={[styles.button, styles.accept]} onPress={onClose}>
                <Text style={styles.iconText}>&#10003;</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBox: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: '80%',
    height: '35%',
    maxHeight: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topOverlayBanner: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: '80%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B90B0B',
  },
  topBannerText: {
    marginLeft: 10,
    marginRight: 10,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlayContentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  bannerText: {
    padding: 10,
    color: 'black',
    fontSize: 20,
    flex: 2,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  buttonRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    flex: 1,
  },
  button: {
    backgroundColor: '#223F87',
    width: 72,
    height: 72,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  buttonLabel: {
    marginTop: 8,
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  accept: {
    backgroundColor: '#223F87',
  },
});