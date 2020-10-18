import React, {useState, useEffect} from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingParamList } from '../../types';
import { StyleSheet, View, SafeAreaView, Image } from 'react-native';
import { Headline, Caption, ProgressBar, Button } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import firebase, { addFace, setPidOfUser } from '../../firebase';

type RegisterNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'TrainingScreen'
>;

type RegisterRouteProp = RouteProp<
  OnboardingParamList,
  'TrainingScreen'
>;

type Props = {
  navigation: RegisterNavigationProp
  route: RegisterRouteProp
};

const TrainingScreen = ({route, navigation}: Props) => {
  const {imageOrigin, imageLeft, imageRight} = route.params
  const user = firebase.auth().currentUser

  const [done, setDone] = useState(false)

  useEffect(() => {
    ( async () => {
    if (imageOrigin.base64) {
      console.log(imageOrigin.base64.substr(0, 20))
      await addFace(imageOrigin.base64)
        .then(pid => setPidOfUser(pid))
        .then(() => setDone(true))
        .catch(e => console.log(e))
    } else {
      
    }
  })();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark"/>
      <View style={{padding:40, flex: 1}}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} width={297} height={350} source={require('../../assets/images/xkcd1838.png')}/>
        </View>
        <Headline>Hold on.</Headline>
        <Caption>We are training monkeys to recognize your face.</Caption>
        <LinearGradient
          colors={['#0099ff', '#a033ff', '#ff5280', '#ff7061']}
          style={{marginVertical: 20, borderRadius: 5}}
          start={{x:0,y:0.5}}
          end={{x:1,y:0.5}}
          >

          { !done 
          ?<ProgressBar color={'#0a7cff'} indeterminate/>
          :<Button contentStyle={{paddingVertical: 5}} labelStyle={{fontSize: 16}} color="white" onPress={() => navigation.navigate("Root")}>Continue</Button>
          }

        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
  },
});

export default TrainingScreen