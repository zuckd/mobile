import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { List, Avatar, Title } from 'react-native-paper'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 

import EditScreenInfo from '../components/EditScreenInfo'
import { ScrollView } from 'react-native-gesture-handler';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatar}>
      <Avatar.Text size={100} label="LO"/>
      <Title style={styles.avatarTitle}>Leo Orpilla III</Title>
      </View>
      <List.Section>
        <List.Item 
          title="Notifications & sounds" 
          left={() => <MaterialIcons name="notifications-active" size={24}/>} 
          style={styles.listItem}
          />
        <List.Item
          title="Receive messages"
          left={() => <MaterialIcons name="wifi-tethering" size={24}/>}
          style={styles.listItem}
        />
        <List.Item title="Mobile number"
          left={() => <MaterialIcons name="smartphone" size={24}/>}
          style={styles.listItem}
        />
        <List.Item title="Privacy"
          left={() => <MaterialCommunityIcons name="shield-check" size={24}/>}
          style={styles.listItem}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>Account and Support</List.Subheader>
        <List.Item 
          title="Switch account" 
          left={() => <MaterialCommunityIcons name="account-multiple" size={24}/>} 
          style={styles.listItem}
        />
        <List.Item
          title="Account Settings"
          left={() => <MaterialIcons name="settings" size={24}/>}
          style={styles.listItem}
        />
        <List.Item
          title="Report a problem"
          left={() => <MaterialIcons name="report-problem" size={24}/>}
          style={styles.listItem}
        />
        <List.Item
          title="Help"
          left={() => <MaterialIcons name="help" size={24}/>}
          style={styles.listItem}
        />
        <List.Item
          title="Legal & Policies"
          left={() => <MaterialIcons name="gavel" size={24}/>}
          style={styles.listItem}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    marginTop: 30,
    marginBottom: 10,
    alignItems: "center",
  },
  avatarTitle: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 24,
  },
  listItem: {
    borderBottomWidth: 0.5,
    borderColor: "#00000022",
    padding: 15,
    paddingLeft: 25,
  },
});
