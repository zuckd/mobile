import React, { useState } from "react"
import { View, StyleSheet, Image, KeyboardAvoidingView, Keyboard, Text, TouchableWithoutFeedback } from "react-native"
import { TextInput, Button, Avatar, Subheading } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingParamList } from "../../types";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase"

type OnboardScreenNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'StartScreen'
>;

type Props = {
  navigation: OnboardScreenNavigationProp;
};

const StartScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [imageVisible, setImageVisible] = useState(true)

  const keyboard = Keyboard
  const onLogin = async() => {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(creds => navigation.navigate("Root"))
  }

  const onRegister = () => navigation.navigate("RegisterScreen")
  return (
    <View style={styles.container}>
      <StatusBar style="dark"/>
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setImageVisible(true)}}>
        <View>
        {imageVisible ?
        <View style={styles.imageContainer}>
          <Image style={styles.image} width={166} height={200} source={require('../../assets/images/header.png')}/>
        </View>
        : null
        }

        <View style={styles.buttonContainer}>
          <TextInput autoCompleteType={"email"} keyboardType={"email-address"} style={styles.input} onFocus={() => setImageVisible(false)} label="Email" value={email} onChangeText={setEmail}/>
          <TextInput style={styles.input} onFocus={() => setImageVisible(false)} secureTextEntry={true} label="Password" value={password} onChangeText={setPassword}/>
          <Button style={styles.button} color={'#0a7cff'} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} mode="contained" onPress={onLogin} disabled={email.length == 0 || password.length == 0}>Login</Button>
        </View>

        <View style={styles.registerContainer}>
          <View style={styles.separator}/>
          <Subheading style={styles.or}>OR</Subheading>
          <Button style={styles.button} color={'#0a7cff'} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} mode="contained" onPress={onRegister}>Register</Button>
        </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 40,
    justifyContent: "space-between"
  },
  imageContainer: {
    alignItems: 'center',
    padding: 40,
  },
  buttonContainer: {
  },
  registerContainer: {
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
  image: {
  },
  input: {
    marginBottom: 15,
  },
  or: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  separator: {
    marginVertical: 30,
    borderWidth: 0.5,
    borderColor: "#aaa"
  },
})


export default StartScreen