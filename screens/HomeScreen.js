import React, { useRef, useState } from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Map from '../components/Map'

import { useDispatch, useSelector } from 'react-redux'
import { selectUserToken } from '../slices/authSlice'
import { selectActive, selectAvailable, selectOrigin, setActive, setAvailable, setOrigin } from '../slices/mainSlice'

import { doc, updateDoc } from "firebase/firestore";
import { firestore } from '../firebase'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()

  const mapRef = useRef(null)

  const dispatch = useDispatch()
  const userToken = useSelector(selectUserToken)
  const origin = useSelector(selectOrigin)
  const active = useSelector(selectActive)
  const available = useSelector(selectAvailable)

  const [directionsView, setDirectionsView] = useState(false)

  const styles = StyleSheet.create({
    statusContainer: {
      position: 'absolute',
      zIndex: 7,
      top: insets.top + 14,
      left: '50%',
      transform: [{ translateX: -85 }],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      width: 170,
      height: 56,
      paddingHorizontal: 13,
      borderRadius: 28,
      elevation: 4,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25
    },
    statusCircle: {
      width: 12,
      height: 12,
      marginHorizontal: 4,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 15
    },
    statusSwitch: {
      transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
    }
  })

  const userLocationChange = (coordinate) => {
    if (active) {
      dispatch(setOrigin({
        latitude: coordinate.nativeEvent.coordinate.latitude,
        longitude: coordinate.nativeEvent.coordinate.longitude
      }))

      const driverRef = doc(firestore, "drivers", userToken);

      updateDoc(driverRef, {
        location: {
          latitude: coordinate.nativeEvent.coordinate.latitude,
          longitude: coordinate.nativeEvent.coordinate.longitude
        }
      })
    }
  }
  
  const toggleActive = (active) => {
    dispatch(setActive(!active))
    dispatch(setAvailable(!active))

    const driverRef = doc(firestore, "drivers", userToken);

    updateDoc(driverRef, {
      active: !active,
      available: !active
    }).then(() => {

    }).catch((error) => {
      dispatch(setActive(active))
      dispatch(setAvailable(active))
    })
  }

  return (
    <View behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View style={styles.statusContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <View style={[styles.statusCircle, active ? { backgroundColor: '#2ad586' } : { backgroundColor: '#c8c8c8' }]}></View>
          <Text style={styles.statusText}>{ active ? 'Online' : 'Offline' }</Text>
        </View>
        <Switch 
          trackColor={{false: '#c8c8c8', true: '#c8c8c8'}}
          thumbColor={active ? '#2ad586' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleActive(active)}
          value={active}
          style={styles.statusSwitch}
        />
      </View>

      <Map mapRef={mapRef} origin={origin} directionsView={directionsView} userLocationChange={userLocationChange} insets={insets}>

      </Map>
    </View>
  )
}
