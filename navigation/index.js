import React from "react";
import { Appearance } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

import { NavigationContainer } from "../components/Themed";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

import Colors from "../constants/Colors";

import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken, setUserInfo, setUserToken } from '../slices/authSlice';
import { setOrigin, setActive, setAvailable } from '../slices/mainSlice';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from '../firebase';

const theme = Appearance.getColorScheme()

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator()

function RootNavigator() {
  const dispatch = useDispatch()
  const userToken = useSelector(selectUserToken)

  onAuthStateChanged(auth, (user) => {
    (async () => {
      if (user) {
        let { status } = await Location.requestForegroundPermissionsAsync()
  
        if (status !== 'granted') {
          console.log('Permission to access location was denied')
          return
        }
  
        let location = await Location.getCurrentPositionAsync({})

        dispatch(setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }))

        console.log(user.uid)

        const docSnap = await getDoc(doc(firestore, "drivers", user.uid))
        // const fileUri = FileSystem.documentDirectory + "photo";

        console.log(docSnap.data())
        
        // FileSystem.downloadAsync(user.photoURL, fileUri)

        dispatch(setUserInfo({
          // name: user.displayName,
          // firstName: docSnap.data().firstName,
          // lastName: docSnap.data().lastName,
          // phone: docSnap.data().phoneNumber,
          // email: user.email,
          // image: user.photoURL,
          // thumbnail: fileUri
        }))

        dispatch(setUserToken(user.uid))
      } else {
        dispatch(setUserToken(null))
      }

      await SplashScreen.hideAsync();
    })()
  });

  return (
    <Stack.Navigator>
      {
        userToken == null ? (
          <Stack.Screen name="SignIn" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
        )
      }
      
      {/* <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} /> */}
    </Stack.Navigator>
  )
}

const BottomTab = createBottomTabNavigator()

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      backBehavior='history'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors[theme]['primary']
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="car-outline" color={color} size={40} style={{ marginBottom: -3 }} />,
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  )
}
