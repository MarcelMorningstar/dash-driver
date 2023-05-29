import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { TextInput, PrimaryTouchableHighlight } from '../components/Themed'

import Layout from '../components/Layout'

import { useSelector } from 'react-redux'
import { selectUserInfo } from '../slices/authSlice'

import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase'

export default function CarsScreen({ navigation }) {
  const userInfo = useSelector(selectUserInfo)
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [plate, setPlate] = useState('')

  useEffect(() => {
    getCarDate(userInfo.car)
  }, [])

  const getCarDate = async (id) => {
    const docRef = doc(firestore, "cars", id)
    const docSnap = await getDoc(docRef)

    setBrand(docSnap.data().brand)
    setModel(docSnap.data().model)
    setPlate(docSnap.data().plate)
  }

  const updateCarData = async (id) => {
    const docRef = doc(firestore, "cars", id)

    await updateDoc(docRef, {
      brand: brand,
      model: model,
      plate: plate
    })

    navigation.navigate('Profile')
  }

  return (
    <Layout title='My Car' navigation={navigation} backScreen='Profile'>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder='Brand'
            onChangeText={setBrand}
            value={brand}
            style={styles.input}
          />
        
          <TextInput 
            placeholder='Model'
            onChangeText={setModel}
            value={model}
            style={styles.input}
          />
        
          <TextInput 
            placeholder='Plate'
            onChangeText={setPlate}
            value={plate}
            style={styles.input}
          />
        </View>
        
        <PrimaryTouchableHighlight
          activeOpacity={0.6}
          style={styles.saveBtn}
          onPress={() => updateCarData(userInfo.car)}
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