import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from '../screens/ProfileScreen'
import EditProfileScreen from '../screens/EditProfileScreen'
import HistoryScreen from '../screens/HistoryScreen'

const ProfileStack = createNativeStackNavigator()

export default function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
  )
}