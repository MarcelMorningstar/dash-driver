import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Appearance, StyleSheet, View } from 'react-native'
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import Colors from '../constants/Colors'

export default function BootomSheet() {
  const sheetHeight = useRef(new Animated.Value(0)).current;
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener((T) => {
    setTheme(T.colorScheme)
  })

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [24, 107, 220, 320], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSnapPress = useCallback((index) => {
    console.log(index)
    bottomSheetModalRef.current?.snapToIndex(index);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    animation(snapPoints[index])
  }, []);

  useEffect(() => {
    handlePresentModalPress()
  }, [])

  const animation = (endValue) => {
    Animated.timing(sheetHeight, {
      toValue: endValue - 12,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

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

          </View>
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
});
