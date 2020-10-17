import React, { useState } from 'react'
import { TextInput, Button, Caption, Headline, Appbar } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'

import firebase from "../../firebase"
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingParamList } from '../../types';

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
      <Appbar.BackAction style={{marginLeft: -10, marginTop: -10}} onPress={() => navigation.goBack()}/>
      <Headline>Welcome to FaceDrop</Headline>
      <Caption>We're glad to have you.</Caption>
      <View style={styles.inputContainer}>
      <TextInput style={styles.input} label="Email" value={email} onChangeText={setEmail}/>
      <TextInput style={styles.input} secureTextEntry={true} label="Password" value={password} onChangeText={setPassword}/>
      <TextInput style={styles.input} secureTextEntry={true} label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}/>
      <Button style={styles.button} color={'#0a7cff'} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} mode="contained" onPress={onRegister}>Register</Button>
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
    marginBottom: 10,
  },
})

export default RegisterScreen