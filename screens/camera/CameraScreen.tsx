import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from "expo-image-manipulator";
import { Circle, Svg, Rect } from 'react-native-svg';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabCameraParamList } from '../../types';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

type Face = {
  bounds: {origin: {x: number, y: number},
           size: {height: number, width: number}},
  faceID: number,
  rollAngle: number,
  yawAngle: number,
}

type CameraScreenNavigationProp = StackNavigationProp<
  TabCameraParamList,
  'CameraScreen'
>;

type Props = {
  navigation: CameraScreenNavigationProp;
};

export default function CameraScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [disabled, setDisabled] = useState(false);
  const camera = useRef<Camera>(null);
  const [processing, setProcessing] = useState(false);

  const [face, setFace] = useState<FaceDetector.FaceFeature|null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onCapturePress = async () => {
    if (camera && face) {
      setProcessing(true)
      camera.current?.takePictureAsync()
        .then(photo => FaceDetector.detectFacesAsync(photo.uri, {
          mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Landmarks.none,
            runClassifications: FaceDetector.Constants.Classifications.none,
        }))
        .then((result)=> {
          const { faces, image } = result
          const sortedFaces = faces.sort((a, b) => -getBoundingBox(a).width + getBoundingBox(b).width)
          const mainFace = sortedFaces[0];

          return ImageManipulator.manipulateAsync(image.uri,
            [{crop: { 
                originX: mainFace.bounds.origin.x,
                originY: mainFace.bounds.origin.y,
                width: mainFace.bounds.size.width,
                height: mainFace.bounds.size.height,
            }}],{base64: true})
        }).then(i => {
          setProcessing(false)
          navigation.navigate("CaptureScreen", {image: i})
        })
        .catch(e => console.log(e))
        .finally(() => setProcessing(false))
    }
  }

  const getBoundingBox = (face: FaceDetector.FaceFeature): {width: number, height: number} => {
    return {width: face.bounds.size.height, height: face.bounds.size.width}
  }
  const onFacesDetected = (faceResult: FaceDetectionResult) => {
    const { faces } = faceResult;
    if (faces.length == 0) {
      setDisabled(true)
      setFace(null)
    } else {
      // sort faces in decreasing order by bounding box width size
      const sortedFaces = faces.sort((a, b) => -getBoundingBox(a).width + getBoundingBox(b).width)

      // the largest face
      const mainFace = sortedFaces[0];

      setDisabled(false)
      setFace(mainFace)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      <Camera 
        style={styles.camera} 
        type={type} 
        ref={camera}
        onFacesDetected={onFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >

        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>

          { face ?
          <View style={{
            backgroundColor: 'transparent',
            width: face.bounds.size.width,
            height: face.bounds.size.height,
            left: face.bounds.origin.x,
            top: face.bounds.origin.y,
            position: 'absolute',
            borderWidth: 0.5,
            borderColor: "yellow",
          }}/>
          : null
          }

          {!disabled && !processing ?
          <TouchableOpacity
            style={styles.circle}
            disabled={disabled}
            activeOpacity={0.2}
            onPress={onCapturePress}
          >
            <Svg viewBox="0 0 10 10">
              <Circle cx="5" cy="5" r="4" fill={disabled?"black":"white"} opacity="0.5"/>
              <Circle cx="5" cy="5" r="2.5" fill={disabled?"#00000055":"white"} />
            </Svg>
          </TouchableOpacity>
          : null}

          {processing ? <ActivityIndicator style={styles.circle} size={50} color={"#0a7cff"}/> : null}
        </View>
      </Camera>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  outerCircle: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: '#ffffff55',
  },
  innerCircle: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  iconsContainer: {
    position: 'absolute',      
    right: 10,
    top: 30,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 7,
    shadowOffset: {width: 2, height: 2},
  },
  camera: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
