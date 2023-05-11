import React, { useEffect, useRef, useState } from 'react'
import { Appearance, Platform, StyleSheet, Switch, View } from 'react-native'
import { SafeAreaView, Text, TouchableHighlight } from '../components/Themed'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import Map from '../components/Map'
import BootomSheet from '../components/BootomSheet'

import Colors from '../constants/Colors'

import { getDistance } from '../utils/distancematrix'

import { useDispatch, useSelector } from 'react-redux'
import { selectTheme, selectUserToken } from '../slices/authSlice'
import { selectActive, selectAvailable, selectOrigin, setActive, setAvailable, setOrigin } from '../slices/mainSlice'
import { setOrderToken, setOrderInformation, setCustomerInformation, selectOrderToken, selectOrderInformation, addIgnored, selectIgnored } from '../slices/orderSlice'

import { doc, getDoc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore"
import { firestore } from '../firebase'

import { GOOGLE_API_KEY } from '@env'

export default function HomeScreen() {
  const storageTheme = useSelector(selectTheme)
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? Appearance.getColorScheme() : storageTheme);
  const insets = useSafeAreaInsets()

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
    },
    centerBtn: {
      position: 'absolute',
      zIndex: 7,
      top: insets.top + 12,
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
      height: 50,
      padding: 8,
      backgroundColor: 'white',
      borderRadius: 25,
      elevation: 7,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25
    }
  })

  const mapRef = useRef(null)

  const dispatch = useDispatch()
  const userToken = useSelector(selectUserToken)
  const origin = useSelector(selectOrigin)
  const active = useSelector(selectActive)
  const available = useSelector(selectAvailable)
  const orderToken = useSelector(selectOrderToken)
  const orderInformation = useSelector(selectOrderInformation)
  const ignored = useSelector(selectIgnored)

  const [status, setStatus] = useState('in wait')
  const [calls, setCalls] = useState([])

  useEffect(() => {
    if (storageTheme !== 'automatic') {
      setTheme(storageTheme)
    } else {
      setTheme(Appearance.getColorScheme())
    }
  }, [storageTheme])

  Appearance.addChangeListener((T) => {
    if (storageTheme === 'automatic') {
      setTheme(T.colorScheme)
    }
  })

  useEffect(() => {
    const q = query(collection(firestore, "calls"), where("status", "==", "in wait"))

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const d = await getDoc(doc(firestore, "drivers", userToken))

      if (d.data().active && d.data().available) {
        const temp = []

        querySnapshot.forEach((doc) => {
          let isIgnored = ignored.find(e => e === doc.id)
  
          if (isIgnored === undefined && getDistance(origin.latitude, doc.data().pick_up.latitude, origin.longitude, doc.data().pick_up.longitude) < 10) {
            temp.push({...doc.data(), id: doc.id})
          }
        })
    
        setCalls(temp)
      }
    })
  }, [])

  useEffect(() => {
    if (active && calls.length > 0) {
      setCall()
    } else {
      dispatch(setOrderToken(null))
      dispatch(setOrderInformation(null))
      dispatch(setCustomerInformation(null))
    }
  }, [active, calls])

  const setCall = async () => {
    dispatch(setOrderInformation({
      pick_up: calls[0].pick_up,
      destination: calls[0].destination,
      type: calls[0].type,
      travelInformation: calls[0].travelInformation
    }))

    const user = await getDoc(doc(firestore, 'users', calls[0].user))

    dispatch(setCustomerInformation({
      displayName: user.data().displayName,
      phoneNumber: user.data().phoneNumber,
      photoURL: user.data().photoURL
    }))

    dispatch(setOrderToken(calls[0].id))
  }

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

    const driverRef = doc(firestore, "drivers", userToken);

    updateDoc(driverRef, {
      active: !active,
    }).then(() => {
      if (active) {
        fitUser(360)
      }
    }).catch((error) => {
      dispatch(setActive(active))
    })
  }

  const acceptCall = async (orderToken) => {
    const callRef = doc(firestore, "calls", orderToken);
    const driverRef = doc(firestore, "drivers", userToken);

    await updateDoc(callRef, {
      driver: userToken,
      status: 'waiting driver'
    });

    await updateDoc(driverRef, {
      available: false
    });

    dispatch(setAvailable(false))
    setStatus('waiting driver')
  }

  const ignoreCall = (orderToken) => {
    dispatch(addIgnored(orderToken))

    const index = calls.findIndex(e => e.id === orderToken)
    let temp = calls

    temp.splice(index, 1)

    setCalls(temp)

    if (calls.length === 0) {
      dispatch(setOrderToken(null))
      dispatch(setOrderInformation(null))
      dispatch(setCustomerInformation(null))
      fitUser(500)
    } else {
      setCall()
    }
  }

  const setArrived = async (orderToken) => {
    const callRef = doc(firestore, "calls", orderToken);

    await updateDoc(callRef, {
      status: 'arrived'
    });

    setStatus('arrived')
  }

  const fitUser = (delay) => {
    setTimeout(() => { 
      mapRef.current.animateToRegion({ 
        latitude: origin.latitude, 
        longitude: origin.longitude, 
        latitudeDelta: 0.018,
        longitudeDelta: 0.012,
      }, 1000)
    }, delay)
  }

  const fitDirection = (delay) => {
    setTimeout(() => {
      mapRef.current.fitToCoordinates([
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: orderInformation.pick_up.latitude, longitude: orderInformation.pick_up.longitude },
        { latitude: orderInformation.destination.latitude, longitude: orderInformation.destination.longitude },
      ], {
        edgePadding: {
          top: 140,
          right: 40,
          bottom: 20,
          left: 40,
        },
        animated: true
      })
    }, delay)
  }

  return (
    <View behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      {
        available && (
          <SafeAreaView style={styles.statusContainer}>
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
          </SafeAreaView>
        )
      }

      <TouchableHighlight
        activeOpacity={0.6}
        style={[styles.centerBtn, { right: 16 }]}
        onPress={() => fitUser(1)}
      >
        <MaterialIcons name="my-location" size={25} color="black" />
      </TouchableHighlight>

      {
        orderToken && (
          <TouchableHighlight
            activeOpacity={0.6}
            style={[styles.centerBtn, { left: 16 }]}
            onPress={() => fitDirection(100)}
          >
            <FontAwesome5 name="route" size={25} color="black" />
          </TouchableHighlight>
        )
      }

      <Map mapRef={mapRef} origin={origin} userLocationChange={userLocationChange} insets={insets}>
        {
          (orderToken && (status === 'in wait' || status === 'waiting driver')) && (
            <MapViewDirections 
              origin={origin}
              destination={orderInformation?.pick_up}
              apikey={GOOGLE_API_KEY}
              strokeWidth={4}
              strokeColor={Colors[theme]['tint']}
            />
          )
        }

        {
          (orderToken && (status === 'in wait')) && (
            <MapViewDirections 
              origin={orderInformation?.pick_up}
              destination={orderInformation?.destination}
              apikey={GOOGLE_API_KEY}
              strokeWidth={4}
              strokeColor={Colors[theme]['primary']}
            />
          )
        }

        {
          (orderInformation?.pick_up && (status === 'in wait' || status === 'waiting driver')) && (
            <Marker 
              identifier='customer'
              coordinate={{
                latitude: orderInformation.pick_up?.latitude,
                longitude: orderInformation.pick_up?.longitude,
              }}
              image={require('../assets/user.png')}
            />
          )
        }

        {
          (orderInformation?.destination && (status === 'in wait' || status === 'in progress')) && (
            <Marker 
              identifier='destination'
              coordinate={{
                latitude: orderInformation.destination?.latitude,
                longitude: orderInformation.destination?.longitude,
              }}
            />
          )
        }
      </Map>

      <BootomSheet status={status} setStatus={setStatus} acceptCall={acceptCall} ignoreCall={ignoreCall} setArrived={setArrived} fitDirection={fitDirection} />
    </View>
  )
}
