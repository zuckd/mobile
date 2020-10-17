import React, { } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Avatar } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingParamList } from "../../types";

type OnboardScreenNavigationProp = StackNavigationProp<
  OnboardingParamList,
  'StartStack'
>;

type Props = {
  navigation: OnboardScreenNavigationProp;
};

const StartScreen = ({navigation}: Props) => {
  const onLogin = () => navigation.navigate("LoginStack")
  const onRegister = () => navigation.navigate("RegisterStack")
  return (
    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <Avatar.Text style={styles.image} size={100} label={"FD"}/>
      </View>

      <View style={styles.buttonContainer}>
        <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} mode="contained" onPress={onLogin}>Login</Button>
        <Button style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel} mode="contained" onPress={onRegister}>Register</Button>
      </View>
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
  buttonContainer: {
  },
  imageContainer: {
    alignItems: "center",
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
})


export default StartScreen