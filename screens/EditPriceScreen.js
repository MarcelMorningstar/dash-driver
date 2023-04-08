import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { PrimaryView, TextInput, PrimaryTouchableHighlight } from '../components/Themed'

import Layout from '../components/Layout'

export default function EditPriceScreen({ navigation }) {
  const [chargePerDistance1, setChargePerDistance1] = useState()
  const [chargePerTime1, setChargePerTime1] = useState()
  const [chargeOfBoarding1, setChargeOfBoarding1] = useState()
  const [chargePerDistance2, setChargePerDistance2] = useState()
  const [chargePerTime2, setChargePerTime2] = useState()
  const [chargeOfBoarding2, setChargeOfBoarding2] = useState()
  const [chargePerDistance3, setChargePerDistance3] = useState()
  const [chargePerTime3, setChargePerTime3] = useState()
  const [chargeOfTaking3, setChargeOfTaking3] = useState()
  const [taxi, setTaxi] = useState(true);
  const [secondDriver, setSecondDriver] = useState(false);
  const [packages, setPackages] = useState(false);

  useEffect(() => {
    if (!taxi) {
      setChargePerDistance1('')
      setChargePerTime1('')
      setChargeOfBoarding1('')
    }
  }, [taxi])

  useEffect(() => {
    if (!secondDriver) {
      setChargePerDistance2('')
      setChargePerTime2('')
      setChargeOfBoarding2('')
    }
  }, [secondDriver])

  useEffect(() => {
    if (!packages) {
      setChargePerDistance3('')
      setChargePerTime3('')
      setChargeOfTaking3('')
    }
  }, [packages])

  return (
    <Layout title='Services' navigation={navigation} backScreen='Profile'>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.serviceContainer}>
            <TouchableWithoutFeedback onPress={() => setTaxi(!taxi)}>
              <View style={styles.radioButton}>
                <View style={styles.valueContainer}>
                  <View style={[styles.value, taxi ? { backgroundColor: "#E88D0A" } : { backgroundColor: "transparent" }]}></View>
                </View>
                <Text style={styles.radioButtonText}>Taxi</Text>
              </View>
            </TouchableWithoutFeedback>
          
            <TextInput 
              placeholder='Price per kilometer'
              onChangeText={setChargePerDistance1}
              value={chargePerDistance1}
              editable={taxi}
              style={styles.input}
            />
          
            <TextInput
              placeholder='Price per minute'
              onChangeText={setChargePerTime1}
              value={chargePerTime1}
              editable={taxi}
              style={styles.input}
            />
          
            <TextInput 
              placeholder='Price of boarding'
              onChangeText={setChargeOfBoarding1}
              value={chargeOfBoarding1}
              editable={taxi}
              style={styles.input}
            />
          </View>
          
          <View style={styles.serviceContainer}>
            <TouchableWithoutFeedback onPress={() => setSecondDriver(!secondDriver)}>
              <View style={styles.radioButton}>
                <View style={styles.valueContainer}>
                  <View style={[styles.value, secondDriver ? { backgroundColor: "#E88D0A" } : { backgroundColor: "transparent" }]}></View>
                </View>
                <Text style={styles.radioButtonText}>Second Driver</Text>
              </View>
            </TouchableWithoutFeedback>
          
            <TextInput 
              placeholder='Price per kilometer'
              onChangeText={setChargePerDistance2}
              value={chargePerDistance2}
              editable={secondDriver}
              style={styles.input}
            />
          
            <TextInput
              placeholder='Price per minute'
              onChangeText={setChargePerTime2}
              value={chargePerTime2}
              editable={secondDriver}
              style={styles.input}
            />
          
            <TextInput 
              placeholder='Price of boarding'
              onChangeText={setChargeOfBoarding2}
              value={chargeOfBoarding2}
              editable={secondDriver}
              style={styles.input}
            />
          </View>

          <View style={styles.serviceContainer}>
            <TouchableWithoutFeedback onPress={() => setPackages(!packages)}>
              <View style={styles.radioButton}>
                <View style={styles.valueContainer}>
                  <View style={[styles.value, packages ? { backgroundColor: "#E88D0A" } : { backgroundColor: "transparent" }]}></View>
                </View>
                <Text style={styles.radioButtonText}>Packages</Text>
              </View>
            </TouchableWithoutFeedback>
          
            <TextInput 
              placeholder='Price per kilometer'
              onChangeText={setChargePerDistance3}
              value={chargePerDistance3}
              editable={packages}
              style={styles.input}
            />
          
            <TextInput
              placeholder='Price per minute'
              onChangeText={setChargePerTime3}
              value={chargePerTime3}
              editable={packages}
              style={styles.input}
            />
          
            <TextInput 
              placeholder='Price of boarding'
              onChangeText={setChargeOfTaking3}
              value={chargeOfTaking3}
              editable={packages}
              style={styles.input}
            />
          </View>
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
  inputContainer: {
    width: '80%', 
    alignItems: 'center'
  },
  serviceContainer: {
    width: '100%',
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
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  valueContainer: {
    width: 28,
    height: 28,
    marginRight: 8,
    padding: 3,
    borderWidth: 2.5,
    borderColor: '#E88D0A',
    borderRadius: 8
  },
  value: {
    width: '100%',
    height: '100%',
    borderRadius: 4
  },
  radioButtonText: {
    fontSize: 18
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