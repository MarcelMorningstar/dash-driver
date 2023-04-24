import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import { Text, PrimaryTouchableHighlight } from '../components/Themed'
import CurrencyInput from 'react-native-currency-input';

import Layout from '../components/Layout'

import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo, selectUserToken, setUserInfo } from '../slices/authSlice'

import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function EditPriceScreen({ navigation }) {
  const dispatch = useDispatch()
  const userToken = useSelector(selectUserToken)
  const userInfo = useSelector(selectUserInfo)
  const [chargePerDistance1, setChargePerDistance1] = useState()
  const [chargePerTime1, setChargePerTime1] = useState()
  const [chargeOfBoarding1, setChargeOfBoarding1] = useState()
  const [chargePerDistance2, setChargePerDistance2] = useState()
  const [chargePerTime2, setChargePerTime2] = useState()
  const [chargeOfBoarding2, setChargeOfBoarding2] = useState()
  const [taxi, setTaxi] = useState(false);
  const [secondDriver, setSecondDriver] = useState(false);

  useEffect(() => {
    setTaxi(userInfo.services.taxi.work)
    setChargePerDistance1(userInfo.services.taxi.values[0].toString())
    setChargePerTime1(userInfo.services.taxi.values[1].toString())
    setChargeOfBoarding1(userInfo.services.taxi.values[2].toString())

    setSecondDriver(userInfo.services.secondDriver.work)
    setChargePerDistance2(userInfo.services.secondDriver.values[0].toString())
    setChargePerTime2(userInfo.services.secondDriver.values[1].toString())
    setChargeOfBoarding2(userInfo.services.secondDriver.values[2].toString())
  }, [])

  const savePricing = () => {
    const driverRef = doc(firestore, "drivers", userToken);

    updateDoc(driverRef, {
      services: {
        taxi: {
          work: taxi,
          values: [parseFloat(chargePerDistance1), parseFloat(chargePerTime1), parseFloat(chargeOfBoarding1)]
        },
        secondDriver: {
          work: secondDriver,
          values: [parseFloat(chargePerDistance2), parseFloat(chargePerTime2), parseFloat(chargeOfBoarding2)]
        }
      },
    }).then(() => {
      dispatch(setUserInfo({
        services: {
          taxi: {
            work: taxi,
            values: [parseFloat(chargePerDistance1), parseFloat(chargePerTime1), parseFloat(chargeOfBoarding1)]
          },
          secondDriver: {
            work: secondDriver,
            values: [parseFloat(chargePerDistance2), parseFloat(chargePerTime2), parseFloat(chargeOfBoarding2)]
          }
        }
      }))

      navigation.goBack()
    }).catch((error) => {
      
    })
  }

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
          
            <CurrencyInput 
              placeholder='Price per kilometer'
              value={chargePerDistance1} 
              onChangeValue={setChargePerDistance1}
              editable={taxi}
              ignoreNegative={true}
              precision={2}
              prefix="€ "
              separator=","
              style={styles.input}
            />
          
            <CurrencyInput
              placeholder='Price per minute'
              value={chargePerTime1}
              onChangeValue={setChargePerTime1}
              editable={taxi}
              ignoreNegative={true}
              precision={2}
              prefix="€ "
              separator=","
              style={styles.input}
            />
          
            <CurrencyInput 
              placeholder='Price of boarding'
              value={chargeOfBoarding1}
              onChangeValue={setChargeOfBoarding1}
              editable={taxi}
              ignoreNegative={true}
              precision={2}
              prefix="€ "
              separator=","
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
          
            <CurrencyInput 
              placeholder='Price per kilometer'
              value={chargePerDistance2}
              onChangeValue={setChargePerDistance2}
              editable={secondDriver}
              ignoreNegative={true}
              precision={2}
              prefix="€ "
              separator=","
              style={styles.input}
            />
          
            <CurrencyInput
              placeholder='Price per minute'
              value={chargePerTime2}
              onChangeValue={setChargePerTime2}
              editable={secondDriver}
              ignoreNegative={true}
              precision={2}
              prefix="€ "
              separator=","
              style={styles.input}
            />
          
            <CurrencyInput 
              placeholder='Price of boarding'
              value={chargeOfBoarding2}
              onChangeValue={setChargeOfBoarding2}
              editable={secondDriver}
              ignoreNegative={true}
              precision={2}
              prefix="€ "
              separator=","
              style={styles.input}
            />
          </View>
        </View>

        <PrimaryTouchableHighlight
          activeOpacity={0.6}
          style={styles.saveBtn}
          onPress={() => savePricing()}
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
    backgroundColor: '#DDD',
    borderRadius: 12,
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