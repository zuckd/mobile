import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from "expo-image-manipulator";
import { Circle, Svg, Rect } from 'react-native-svg';

import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingParamList } from '../../types';

type Face = {
  bounds: {origin: {x: number, y: number},
           size: {height: number, width: number}},
  faceID: number,
  rollAngle: number,
  yawAngle: number,
}

type RegisterFaceScreenNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'RegisterFaceStack'
>;

type Props = {
  navigation: RegisterFaceScreenNavigationProp;
};

export default function RegisterFaceScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [disabled, setDisabled] = useState(false);
  const camera = useRef<Camera>(null);

  const [face, setFace] = useState<Face|null>(null);

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
      await camera.current?.takePictureAsync()
        .then(i => ImageManipulator.manipulateAsync(i.uri,
          [{crop: { 
              originX: face.bounds.origin.x,
              originY: face.bounds.origin.y,
              width: face.bounds.size.width,
              height: face.bounds.size.height,
          }}]))
        .then(i => navigation.navigate("CaptureScreen", {image: i}))
    }
  }

  const getBoundingBox = (face: Face): {width: number, height: number} => {
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

