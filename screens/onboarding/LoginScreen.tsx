import React, { useState } from 'react'
import { TextInput, Button } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'

import firebase from "firebase"
import { StackNavigationProp } from '@react-navigation/stack'
import { OnboardingParamList } from '../../types'

type LoginNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'LoginStack'
>;

type Props = {
  navigation: LoginNavigationProp;
};

const LoginScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onLogin = async() => {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(creds => navigation.navigate("Root"))
    
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} label="Email" value={email} onChangeText={setEmail}/>
      <TextInput style={styles.input} secureTextEntry={true} label="Password" value={password} onChangeText={setPassword}/>
      <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} mode="contained" onPress={onLogin}>Login</Button>
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

export default LoginScreen