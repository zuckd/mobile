import React, { useState, useEffect } from 'react'
import { Image, View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabCameraParamList } from '../../types';
import { RouteProp } from '@react-navigation/native';

import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, ProgressBar, Title } from 'react-native-paper';
import { getReceiver, sendFile } from '../../firebase';
import { StatusBar } from 'expo-status-bar';



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
  const [uid, setUid] = useState<string|undefined>()
  const [document, setDocument] = useState<DocumentPicker.DocumentResult>()
  const [error, setError] = useState("")

  useEffect(() => {
    if (image.base64){
      getReceiver(image.base64)
        .then(uid_ => {
          setUid(uid_)
        })
        .catch(e => {console.log(e); setError(e)})
        .finally(() => setDone(true))
    }
  }, [])

  const onPress = async () => {
    setDocument(await DocumentPicker.getDocumentAsync())

    console.log("Done")
    console.log(uid)
    
    if (document?.type == "success" && uid) {
      const { type, uri, name, size } = document
      console.log(uri)

      const blob = await toBlob(uri)
      console.log(`Sending ${name} ${blob}to ${uid}`)
      const response = sendFile(uid, name, blob)
    }
  }

  async function toBlob(uri: string) : Promise<Blob> {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob : Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    })
    return blob
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark"/>
      <View style={styles.imageContainer}>
      <Image style={{width: 200, height:200}} source={{uri: image.uri}} resizeMethod="resize"/>
      </View>

      <Title>{}</Title>

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