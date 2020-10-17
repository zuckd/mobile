import React, { useState, useEffect } from 'react'
import { Image, View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabCameraParamList } from '../../types';
import { RouteProp } from '@react-navigation/native';

import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, ProgressBar } from 'react-native-paper';



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
  const [done, setDone] = useState(false)

  const [document, setDocument] = useState<DocumentPicker.DocumentResult>()

  useEffect(() => {setTimeout(() => setDone(true), 1000)}, [])

  const onPress = async () => {
    setDocument(await DocumentPicker.getDocumentAsync())
    if (document?.type == "success") {
      const { type, uri, name, size } = document
      console.log(uri)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      <Image style={{width: 200, height:200}} source={{uri: image.uri}} resizeMethod="resize"/>
      </View>

      <LinearGradient
        colors={['#0099ff', '#a033ff', '#ff5280', '#ff7061']}
        style={{marginVertical: 20, borderRadius: 5}}
        start={{x:0,y:0.5}}
        end={{x:1,y:0.5}}
        >

        { !done 
        ?<ProgressBar color={'#0a7cff'} indeterminate/>
        :<Button contentStyle={{paddingVertical: 5}} labelStyle={{fontSize: 16}} color="white" onPress={onPress}>Send File</Button>
        }

      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  imageContainer: {
    alignItems: 'center'
  },
});

export default CaptureScreen;