import React, { useRef, useMemo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'

type Props = {
  visible: boolean
  onAccept: () => void
  onDecline: () => void
  children?: React.ReactNode
  // any other props you need, e.g. incident info
}

export const AlertBanner = ({ visible, onAccept, onDecline }: any) => {
  console.log("AlertBanner rendered, visible =", visible);
  const modalRef = useRef<BottomSheetModal>(null)

  // the sheet will snap to 1% (hidden) and 50% height
  const snapPoints = useMemo(() => ['25%', '70%'], [])

  // show/hide when `visible` toggles
  React.useEffect(() => {

    if (visible) {
      console.log("index 1")
      modalRef.current?.snapToIndex(1)
    } else {
      console.log("closing bottomsheet")
      modalRef.current?.close()
    }
  }, [visible])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  )

  return (
    <>
    {/* Bottom Popup */}
      <View style={styles.content}>
        {/* Top Banner */}
        {/* <View style={styles.bannerRow}>
          <Text style={styles.bannerText}>We need CFRs!</Text>
          <Image
            source={require('../../assets/role_engine/cpr_hero.png')} // Replace with your image path
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View> */}

        {/* Incident Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.heartIcon}>💙</Text>
            <Text style={styles.cardTitle}>Cardiac arrest</Text>
          </View>
          <Text style={styles.cardSubtitle}>Unconscious man at bus stop</Text>
          <View style={styles.row}>
            <Text style={styles.infoIcon}>🚶‍♂️</Text>
            <Text style={styles.cardInfo}>4 min • 250m</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.infoIcon}>📍</Text>
            <View>
              <Text style={styles.busStop}><Text style={{fontWeight: 'bold'}}>Bus stop: Aft Ang Mo Kio Fire Stn (55211)</Text></Text>
              <Text style={styles.address}>Ang Mo Kio Street 62</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.buttonRow}>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={[styles.button, styles.decline]} onPress={onDecline}>
                <Text style={styles.iconText}>&#10008;</Text>
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>Decline</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={[styles.button, styles.accept]} onPress={onAccept}>
                <Text style={styles.iconText}>&#10003;</Text>
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>Accept</Text>
            </View>
          </View>
        </View>
      </View>

      <BottomSheetModal
        ref={modalRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handle}
        onDismiss={onDecline}
        backgroundStyle={{ backgroundColor: 'yellow' }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>We need CFRs!</Text>
          <Text style={{color: 'black'}}>Test Banner Content</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.decline]} onPress={onDecline}>
              <Text style={styles.buttonLabel}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.accept]} onPress={onAccept}>
              <Text style={styles.buttonLabel}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  handle: {
    backgroundColor: '#ccc',
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    minHeight: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  decline: {
    backgroundColor: '#B90B0B',
    width: 72,
    height: 72,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accept: {
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
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    // shadow styles if needed
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heartIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  cardTitle: {
    color: '#223F87',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cardSubtitle: {
    color: '#222',
    fontSize: 16,
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  cardInfo: {
    color: '#222',
    fontSize: 16,
  },
  busStop: {
    color: '#222',
    fontSize: 16,
  },
  address: {
    color: '#888',
    fontSize: 14,
  },
})
