import React, { useState } from 'react'
import { TextInput, Button, Caption, Headline, Appbar } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'

import firebase, { registerUser } from "../../firebase"
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingParamList } from '../../types';
import { LinearGradient } from 'expo-linear-gradient';

type RegisterNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'RegisterScreen'
>;

type Props = {
  navigation: RegisterNavigationProp;
};


const RegisterScreen = ({navigation} : Props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const onRegister = async () => {
    if (password === confirmPassword) {
      await registerUser(email, password)
        .then(creds => navigation.navigate("RegisterFaceScreen"))
        .catch(e => setError(e.message))
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.BackAction style={{marginLeft: -10, marginTop: -10}} onPress={() => navigation.goBack()}/>
      <Headline>Welcome to FaceDrop</Headline>
      <Caption>We're glad to have you.</Caption>
      <View style={styles.inputContainer}>
        <Caption>{error}</Caption>
        <TextInput style={styles.input} label="Email" value={email} onChangeText={setEmail}/>
        <TextInput style={styles.input} secureTextEntry={true} label="Password" value={password} onChangeText={setPassword}/>
        <TextInput style={styles.input} secureTextEntry={true} label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}/>
        <LinearGradient
          colors={['#0099ff', '#a033ff', '#ff5280', '#ff7061']}
          style={{marginVertical: 20, borderRadius: 5}}
          start={{x:0,y:0.5}}
          end={{x:1,y:0.5}}
          >

          <Button contentStyle={{paddingVertical: 6}} color={'white'} labelStyle={styles.buttonLabel} onPress={onRegister}>Register</Button>

        </LinearGradient>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 40,
  },
  inputContainer: {
    marginTop: 40,
  },
  buttonLabel: {
    fontSize: 18,
  },
  buttonContent: {
    paddingVertical: 7,
  },
  input: {
    marginBottom: 10,
  },
})

export default RegisterScreen