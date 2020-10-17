import React, { useState } from 'react'
import { TextInput, Button } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'

import firebase from "../../firebase"
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingParamList } from '../../types';

type LoginNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'RegisterStack'
>;

type Props = {
  navigation: LoginNavigationProp;
};


const RegisterScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onRegister = async () => {
    if (password === confirmPassword) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(creds => 
          firebase
            .firestore()
            .collection("users")
            .doc(creds.user?.uid).set({
              group: "lambda",
              personId: "",
              storage: ""
            }).catch(e => console.log(e))
        ).catch(e => console.log(e))
    }
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} label="Email" value={email} onChangeText={setEmail}/>
      <TextInput style={styles.input} secureTextEntry={true} label="Password" value={password} onChangeText={setPassword}/>
      <TextInput style={styles.input} secureTextEntry={true} label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}/>
      <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} mode="contained" onPress={onRegister}>Register</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 40,
  },
  button: {
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 18,
  },
  buttonContent: {
    paddingVertical: 7,
  },
  input: {
    marginBottom: 20,
  },
})

export default RegisterScreen