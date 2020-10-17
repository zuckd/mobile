import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, FaceDetectionResult, CameraCapturedPicture } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as ImageManipulator from "expo-image-manipulator";
import { Circle, Svg, Rect } from 'react-native-svg';

import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingParamList } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';

const EPSILON = 4;

enum Step {
  Origin = "Origin",
  RotateLeft = "RotateLeft",
  RotateRight = "RotateRight",
  RotateUp = "RotateUp",
  RotateDown = "RotateDown",
  Done = "Done",
}

type Face = {
  bounds: {origin: {x: number, y: number},
           size: {height: number, width: number}},
  faceID: number,
  rollAngle: number,
  yawAngle: number,
}

type RegisterFaceScreenNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'RegisterFaceScreen'
>;

type Props = {
  navigation: RegisterFaceScreenNavigationProp;
};

export default function RegisterFaceScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [disabled, setDisabled] = useState(false);
  const camera = useRef<Camera>(null);

  const [imageOrigin, setImageOrigin] = useState<CameraCapturedPicture|null>(null)
  const [imageLeft, setImageLeft] = useState<CameraCapturedPicture|null>(null)
  const [imageRight, setImageRight] = useState<CameraCapturedPicture|null>(null)
  const [imageUp, setImageUp] = useState<CameraCapturedPicture|null>(null)
  const [imageDown, setImageDown] = useState<CameraCapturedPicture|null>(null)

  const [step, setStep] = useState<Step>(Step.Origin)
  const [processing, setProcessing] = useState(false)

  const [face, setFace] = useState<FaceDetector.FaceFeature|null>(null);

  const stepMessages = {
    [Step.Origin]: "Center face", 
    [Step.RotateLeft]: "Look left", 
    [Step.RotateRight]: "Look right", 
    [Step.RotateUp]: "Look up", 
    [Step.RotateDown]: "Look down", 
    [Step.Done]: "Complete!"} 

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

  const getBoundingBox = (face: FaceDetector.FaceFeature): {width: number, height: number} => {
    return {width: face.bounds.size.height, height: face.bounds.size.width}
  }

  const cropFace = async (img: CameraCapturedPicture): Promise<ImageManipulator.ImageResult> => {
    const { faces, image } = await FaceDetector.detectFacesAsync(img.uri, {
      mode: FaceDetector.Constants.Mode.accurate,
      detectLandmarks: FaceDetector.Constants.Landmarks.none,
      runClassifications: FaceDetector.Constants.Classifications.none,
    })

    const sortedFaces = faces.sort((a, b) => -getBoundingBox(a).width + getBoundingBox(b).width)
    const mainFace = sortedFaces[0];

    const croppedImg = await ImageManipulator.manipulateAsync(image.uri,
      [{crop: { 
          originX: mainFace.bounds.origin.x,
          originY: mainFace.bounds.origin.y,
          width: mainFace.bounds.size.width,
          height: mainFace.bounds.size.height,
      }}])

    return croppedImg
  }

  const onFacesDetected = async (faceResult: FaceDetectionResult) => {
    const { faces } = faceResult;
    if (faces.length == 0) {
      setDisabled(true)
      setFace(null)
    } else {
      // sort faces in decreasing order by bounding box width size
      const sortedFaces = faces.sort((a, b) => -getBoundingBox(a).width + getBoundingBox(b).width)

      // the largest face
      const mainFace : FaceDetector.FaceFeature = sortedFaces[0];

      setDisabled(false)
      setFace(mainFace)
      if (!processing && mainFace.yawAngle && mainFace.rollAngle) {
        if (step == Step.Origin && Math.abs(mainFace.yawAngle) - EPSILON <= 0 && Math.abs(mainFace.rollAngle) - EPSILON <= 0) {
          console.log("origin")
          if (!imageOrigin) {
            setProcessing(true)
            camera.current?.takePictureAsync()
            .then(cropFace)
            .then(image => {
              setImageOrigin(image)
              setStep(Step.RotateLeft)
            })
            .finally(() =>
              setProcessing(false)
            )
          }
        }
        if (step == Step.RotateLeft && mainFace.yawAngle - EPSILON <= -35) {
          console.log("+Yaw")
          if (!imageLeft) {
            setProcessing(true)
            camera.current?.takePictureAsync()
            .then(cropFace)
            .then(image => {
              setImageOrigin(image)
              setStep(Step.RotateRight)
            })
            .finally(() =>
              setProcessing(false)
            )
          }
        }
        if (step == Step.RotateRight && mainFace.yawAngle - EPSILON >= 35) {
          console.log("-Yaw")
          if (!imageRight) {
            setProcessing(true)
            await camera.current?.takePictureAsync()
            .then(cropFace)
            .then(image => {
              setImageOrigin(image)
              setStep(Step.Done)
            })
            .finally(() => {
              setProcessing(false)
              navigation.navigate("TrainingScreen", {
                imageOrigin: imageOrigin!,
                imageLeft: imageLeft!,
                imageRight: imageRight!
              })
            })
          }
        }
      }
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
            
          <View style={styles.prompt}>
          {!processing ?
          <Text style={styles.promptText}>
            {stepMessages[step]}
          </Text>
          : 
          <ActivityIndicator color="#0a7cff" size={40}/>
          }
          </View>

          <View style={styles.iconsContainer}>
            <MaterialIcons style={{marginBottom: 20}} name="switch-camera" size={36} color={"white"}/>
            <MaterialIcons style={{marginBottom: 20}} name="flash-auto" size={36} color={"white"}/>
          </View>
        </View>
      </Camera>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prompt: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    flex: 1,
    marginBottom: 50,
  },
  promptText: {
    color: 'yellow',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 1,
    shadowRadius: 7,
    shadowOffset: {width: 2, height: 2},
  },
  iconsContainer: {
    position: 'absolute',      
    right: 10,
    top: 10,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 7,
    shadowOffset: {width: 2, height: 2},
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

