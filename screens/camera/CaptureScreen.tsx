import React, {} from 'react'
import { Image, View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabCameraParamList } from '../../types';
import { RouteProp } from '@react-navigation/native';


type CaptureScreenNavigationProp = StackNavigationProp<
  TabCameraParamList,
  'CaptureScreen'
>;

type CaptureScreenRouteProp = RouteProp<
  TabCameraParamList, 
  'CaptureScreen'
>;

type Props = {
  navigation: CaptureScreenNavigationProp;
  route: CaptureScreenRouteProp;
};

const CaptureScreen = ({ route, navigation }: Props) => {
  const { image } = route.params
  console.log(image.height)
  console.log(image.width)
  return (
    <View style={styles.container}>
      <Image style={{width: 200, height:200}} source={{uri: image.uri}} resizeMethod="resize"/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CaptureScreen;