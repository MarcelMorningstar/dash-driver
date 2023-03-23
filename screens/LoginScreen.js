import React, { useState } from 'react'
import { Image, Keyboard, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'

export default function LoginScreen() {
  // const [firstName, setFirstName] = useState('')
  // const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error)
      });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.content}>
        <Image 
          style={{
            flex: 4,
            width: '70%',
            resizeMode: 'contain'
          }}
          source={require("../assets/icon.png")}
        />

        <View style={{ flex: 6, width: '70%' }}>
          {/* <TextInput 
            placeholder='First Name'
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput 
            placeholder='Last Name'
            value={lastName}
            onChangeText={setLastName}
          /> */}
          <TextInput 
            keyboardType='email-address'
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            autoComplete='email'
            textContentType='emailAddress'
            style={styles.input}
          />
          <TextInput 
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableHighlight 
            activeOpacity={0.9}
            underlayColor="#d39109"
            style={styles.btn}
            disabled={!email || !password}
            onPress={handleLogIn}
          >
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    height: '100%',
    paddingTop: StatusBar.currentHeight + 12,
    backgroundColor: '#F5F5F5'
  },
  input: {
    width: '100%',
    height: 44,
    marginVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#E7E7E7',
    borderRadius: 8
  },
  btn: {
    width: '100%',
    height: 44,
    marginVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#F5AD17',
    borderRadius: 8
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
})