import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Appearance, StyleSheet, View, TouchableHighlight, Image, TouchableOpacity } from 'react-native'
import { PrimaryTouchableHighlight, SecondaryTouchableOpacity, SecondaryView, Text, Feather, FontAwesome5 } from './Themed'
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet"

import Overlay from "./Overlay"

import Colors from '../constants/Colors'

import { callNumber } from '../utils/phone'

import { useSelector } from 'react-redux'
import { selectOrderToken, selectOrderInformation, selectCustomerInformation } from '../slices/orderSlice'
import { selectTheme } from '../slices/authSlice'

export default function BootomSheet({ status, setStatus, acceptCall, ignoreCall, setArrived, setInProgress, setPrice, setDone, cancelOrder, fitUser, fitDirection }) {
  const orderToken = useSelector(selectOrderToken)
  const orderInformation = useSelector(selectOrderInformation)
  const customerInformation = useSelector(selectCustomerInformation)

  const [cancel, setCancel] = useState(false)
  const [pay, setPay] = useState(false)

  const storageTheme = useSelector(selectTheme)
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? Appearance.getColorScheme() : storageTheme);

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
    if (!!orderToken) {
      handleSnapPress(2)
      fitDirection(512)
    } else {
      handleSnapPress(0)
    }
  }, [orderToken])

  useEffect(() => {
    handlePresentModalPress()
  }, [])

  const sheetHeight = useRef(new Animated.Value(0)).current;
  const [top, setTop] = useState(0)
  const [b, setB] = useState(0)

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [24, 152, 250, 360], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSnapPress = useCallback((index) => {
    bottomSheetModalRef.current?.snapToIndex(index);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    animation(snapPoints[index])
  }, []);

  const animation = (endValue) => {
    Animated.timing(sheetHeight, {
      toValue: endValue - 12,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const getMinutes = (time) => {
    let a = time.split(':');
    let minutes = (+a[0]) * 60 + (+a[1]);

    return minutes
  }

  return (
    <BottomSheetModalProvider>
      <Animated.View style={{ height: sheetHeight }}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: Colors[theme]['background'] }}
        >
          <View style={styles.contentConainer}>
            {
              status === 'in wait' ? (
                <View style={{ height: 202, flexDirection: 'column', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 42 }}>
                    <Text style={{ fontSize: 15 }}>{ customerInformation?.displayName }</Text>
                    
                    <View style={{ position: 'absolute', bottom: 0, left: -24, width: '200%', height: 1.7, backgroundColor: Colors[theme]['secondaryBackground'] }} />
                    <Text>{ orderInformation?.additions.join(', ') }</Text>
                  </View>

                  <View style={{ marginLeft: 16 }}>
                    {
                      top != 0 && b != 0 && (
                        <SecondaryView style={{ position: 'absolute', top: top, left: -5, width: 8, height: 8 + top + b / 2.14, backgroundColor: 'transparent', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1 }} />
                      )
                    }
                    <View>
                      <View onLayout={(event) => { setTop(event.nativeEvent.layout.height / 1.84) }} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={styles.circle}>○</Text>
                        <Text style={{ fontSize: 16, lineHeight: 16 }}>{ orderInformation?.pick_up.address }</Text>
                      </View>
                      <View onLayout={(event) => { setB(event.nativeEvent.layout.height) }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Text style={styles.circle}>○</Text>
                        <Text style={{ fontSize: 16, lineHeight: 16 }}>{ orderInformation?.destination.address }</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PrimaryTouchableHighlight
                      style={[{ width: '64%' }, styles.button]}
                      onPress={() => { acceptCall(orderToken); fitDirection(1, 'waiting driver'); }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Accept</Text>
                        <Text style={{ fontSize: 14, fontWeight: '400', color: 'white' }}>{ `${orderInformation?.travelInformation?.duration && getMinutes(orderInformation?.travelInformation?.duration)} min ● ${orderInformation?.travelInformation?.distance} km` }</Text>
                      </View>
                    </PrimaryTouchableHighlight>
                  
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor="#6A6A6A"
                      style={[{ width: '32%', backgroundColor: '#555555' }, styles.button]}
                      onPress={() => ignoreCall(orderToken)}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '400', color: 'white' }}>Ignore</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              ) : status === 'waiting driver' ? (
                <View style={{ width: '100%', height: 202, justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ textAlign: 'center', fontSize: 18 }}>Pick up Customer</Text>
                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                      <View style={styles.row}>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, marginRight: 12, backgroundColor: '#DDDDDD', borderRadius: 24 }}>
                          {
                            customerInformation?.photoURL.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi) ?
                              <Image
                                source={{
                                  uri: customerInformation.photoURL,
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  resizeMode: 'cover',
                                  borderRadius: 24
                                }}
                              />
                            : 
                              <FontAwesome5 name="user-alt" size={24} color="#555555" />
                          }
                        </View>
                      
                        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 15 }}>{ customerInformation?.displayName }</Text>
                        </View>
                      </View>
                        
                      <SecondaryTouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24, }} onPress={() => callNumber(customerInformation.phoneNumber)}>
                        <Feather name="phone" size={28} />
                      </SecondaryTouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PrimaryTouchableHighlight
                      style={[{ width: '64%' }, styles.button]}
                      onPress={() => { setArrived(orderToken); fitUser(1); }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Arrived</Text>
                      </View>
                    </PrimaryTouchableHighlight>
                  
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor="#6A6A6A"
                      style={[{ width: '32%', backgroundColor: '#555555' }, styles.button]}
                      onPress={() => setCancel(true)}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '400', color: 'white' }}>Cancel</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              ) : status === 'arrived' ? (
                <View style={{ width: '100%', height: 202, justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ textAlign: 'center', fontSize: 18 }}>Wait a Customer</Text>
                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                      <View style={styles.row}>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, marginRight: 12, backgroundColor: '#DDDDDD', borderRadius: 24 }}>
                          {
                            customerInformation?.photoURL.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi) ?
                              <Image
                                source={{
                                  uri: customerInformation.photoURL,
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  resizeMode: 'cover',
                                  borderRadius: 24
                                }}
                              />
                            : 
                              <FontAwesome5 name="user-alt" size={24} color="#555555" />
                          }
                        </View>
                      
                        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 15 }}>{ customerInformation?.displayName }</Text>
                        </View>
                      </View>
                        
                      <SecondaryTouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24, }} onPress={() => callNumber(customerInformation.phoneNumber)}>
                        <Feather name="phone" size={28} />
                      </SecondaryTouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PrimaryTouchableHighlight
                      style={[{ width: '64%' }, styles.button]}
                      onPress={() => { setInProgress(orderToken); handleSnapPress(1); fitDirection(1, 'in progress'); }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Ready to Drive</Text>
                      </View>
                    </PrimaryTouchableHighlight>
                  
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor="#6A6A6A"
                      style={[{ width: '32%', backgroundColor: '#555555' }, styles.button]}
                      onPress={() => setCancel(true)}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '400', color: 'white' }}>Cancel</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              ) : status === 'in progress' && (
                <View style={{ width: '100%', height: 111, justifyContent: 'space-between' }}>
                  <Text style={{ textAlign: 'center', fontSize: 18 }}>Drive a Customer</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PrimaryTouchableHighlight
                      style={[{ width: '100%' }, styles.button]}
                      onPress={() => { setPay(true); setPrice(orderToken); handleSnapPress(0); fitUser(1); }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Finish</Text>
                      </View>
                    </PrimaryTouchableHighlight>
                  </View>

                  <Overlay visible={pay}>
                    <SecondaryView style={styles.modalView}>
                      <Text style={{ marginBottom: 2, textAlign: 'center', fontSize: 21, fontWeight: '500' }}>Payment</Text>
                      <Text style={{ marginVertical: 8, textAlign: 'center', fontSize: 14 }}>Customers drive value is { orderInformation?.price }€</Text>

                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <TouchableOpacity
                          style={[styles.buttons, { marginRight: 4, backgroundColor: '#ED4337' }]}
                          onPress={() => { setPay(false); setDone(orderToken); }}
                        >
                          <Text style={{ color: 'white', fontWeight: '500' }}>Rejected</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.buttons, { marginLeft: 4, backgroundColor: '#F0F0F0' }]}
                          onPress={() => { setPay(false); setDone(orderToken); }}
                        >
                          <Text style={{ color: 'black', fontWeight: '500' }}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </SecondaryView>
                  </Overlay>
                </View>
              )
            }
          </View>

          <Overlay visible={cancel}>
            <SecondaryView style={styles.modalView}>
              <Text style={{ marginBottom: 2, textAlign: 'center', fontSize: 21, fontWeight: '500' }}>Cancel</Text>
              <Text style={{ marginVertical: 8, textAlign: 'center', fontSize: 14 }}>Are you sure want to cancel?</Text>

              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[styles.buttons, { marginRight: 4, backgroundColor: '#ED4337' }]}
                  onPress={() => { cancelOrder(orderToken); setCancel(false)}}
                >
                  <Text style={{ color: 'white', fontWeight: '500' }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttons, { marginLeft: 4, backgroundColor: '#F0F0F0' }]}
                  onPress={() => setCancel(false)}
                >
                  <Text style={{ color: 'black', fontWeight: '500' }}>No</Text>
                </TouchableOpacity>
              </View>
            </SecondaryView>
          </Overlay>
        </BottomSheetModal>
      </Animated.View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  contentConainer: {
    paddingVertical: 8,
    paddingHorizontal: 24
  },
  button: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 64, 
    borderRadius: 12
  },
  circle: {
    marginHorizontal: 5,
    fontSize: 12, 
  },
  row: {
    flexDirection: 'row'
  },
  modalView: {
    padding: 20,
    borderRadius: 21,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttons: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16
  }
});
