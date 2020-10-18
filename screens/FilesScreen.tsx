import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { StatusBar } from 'expo-status-bar';
import { queryFiles } from '../firebase';
import { FlatList } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';

import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

export default function FilesScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isRefereshing, setRefreshing] = useState(false)
  const [items, setItems] = useState<firebase.storage.Reference[]>();

  useEffect(() => {
    setLoading(true)
    queryFiles()
      .then(res => {
        setItems(res)
      })
      .finally(() => setLoading(false))
  }, [])

  const onRefresh = () => {

  }

  const download = async (item: firebase.storage.Reference) => {
    const netUri = await item.getDownloadURL()
    const { uri, status } = await FileSystem.downloadAsync(netUri, FileSystem.documentDirectory + item.name)
    console.log(status)
    console.log(uri)
    const fileUri = await FileSystem.getContentUriAsync(uri)
    await Sharing.shareAsync(fileUri)
    console.log(fileUri)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark"/>
      <FlatList
        data={items}
        refreshing={isRefereshing}
        onRefresh={onRefresh}
        contentContainerStyle={{flex: 1}}
        keyExtractor={(i,k) => k.toString()}
        renderItem={item=>
          <List.Item 
            title={item.item.name}
            description={item.item.bucket} 
            left={() => <List.Icon icon="file"/>}
            onPress={() => download(item.item)}
            right={() => <List.Icon icon="close"/>}
          />
        }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
