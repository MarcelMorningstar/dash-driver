import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { PrimaryView, TextInput, PrimaryTouchableHighlight } from '../components/Themed'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'

import Layout from '../components/Layout'

import * as ImagePicker from 'expo-image-picker'

import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo, selectUserToken, setUserInfo } from '../slices/authSlice'

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch()
  const userInfo = useSelector(selectUserInfo)
  const userToken = useSelector(selectUserToken)
  const [displayName, setDisplayName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [pickedImage, setPickedImage] = useState(null)

  useEffect(() => {
    setDisplayName(userInfo.displayName)
    setFirstName(userInfo.firstName)
    setLastName(userInfo.lastName)
    setEmail(userInfo.email)
  }, [userInfo])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      fileSize: 256000,
    });

    if (!result.canceled) {
      setPickedImage(result.assets[0].uri);
    }
  };

  return (
    <Layout title='Edit Profile' navigation={navigation} backScreen='Profile'>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={pickImage}>
          <View style={styles.picContainer}>
            <PrimaryView style={{ position: 'absolute', zIndex: 10, top: 0, right: 0, padding: 4, borderRadius: 20 }}>
              <MaterialIcons name="edit" size={21} color='white' />
            </PrimaryView>
            {
              userInfo.image || pickedImage ?
                <Image
                  source={{
                    uri: pickedImage ? pickedImage : userInfo.thumbnail,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderRadius: 48
                  }}
                />
              :
                <FontAwesome5 name="user-alt" size={32} color="#555555" />
            }
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder='Display Name'
            onChangeText={setDisplayName}
            value={displayName}
            style={styles.input}
          />

          <TextInput 
            placeholder='First Name'
            onChangeText={setFirstName}
            value={firstName}
            style={styles.input}
          />

          <TextInput 
            placeholder='Last Name'
            onChangeText={setLastName}
            value={lastName}
            style={styles.input}
          />

          <TextInput 
            placeholder='Email'
            onChangeText={setEmail}
            value={email}
            style={styles.input}
          />
        </View>

        <PrimaryTouchableHighlight
          activeOpacity={0.6}
          style={styles.saveBtn}
          onPress={() => {}}
        >
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '500' }}>Save</Text>
        </PrimaryTouchableHighlight>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 96,
    backgroundColor: '#DDDDDD',
    borderRadius: 48
  },
  inputContainer: {
    flex: 8,
    width: '80%',
    marginTop: 20
  },
  input: {
    width: '100%',
    height: 48,
    marginVertical: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 12
  },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    marginVertical: 16,
    borderRadius: 12
  }
})