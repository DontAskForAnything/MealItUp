import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Linking, Platform } from 'react-native';
import getFavorites from '../utilities/getFavorites';
import Constants from 'expo-constants'
import Icon  from 'react-native-vector-icons/FontAwesome5'
import  * as colors from '../utilities/Colors'
import { ScreenWidth } from '../utilities/Screen';
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Favorites({navigation,route}) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setFavorites(await getFavorites());
      } catch (error) {
        console.log(error);
      }
    };
    loadFavorites();
  }, [route.params]);

  const addToFavorites = async (el) => {
    try {
        getFavorites().then((favorites) =>{
          favorites.splice(favorites.indexOf(favorites.find(fav => fav.url == el.url)),1) ;
          AsyncStorage.setItem('favorites', JSON.stringify(favorites));
          setFavorites(favorites); 
        })
    }catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ width:ScreenWidth *0.9, height:"100%"}}>
        <View style={{width: ScreenWidth*0.9,alignItems:'center',paddingBottom:5,flexDirection:'row',marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight}}>

          <View style={{ padding: 10, height:50, flexDirection:'row', marginTop:20 }}>
              <TouchableOpacity style={{width:25,marginTop:5}} onPress={()=> {navigation.openDrawer();Keyboard.dismiss(); }}>
                <Icon name="align-left" color={"white"} size={20}/>
              </TouchableOpacity>
          </View>
              <Text style={{color:"white", textAlign:'center', fontSize:20, fontWeight:"bold"}}>Favorites </Text>
        </View>

        {favorites.length>0 ?
        <FlashList 
          data={favorites}
          renderItem={({ item, index }) => (
              <View style={[{backgroundColor:colors.elementsColor, width:"95%", minHeight:20, borderRadius:15}, index % 2 === 0? {} : {marginLeft: 10}]}>
                <View style={{padding:15, justifyContent:'space-between', minHeight:75}}>
                    <Text style={{color: 'white', fontWeight:"bold",fontSize:16}}>{item.label}</Text>
                    <Text style={{color: 'white', fontSize:12, opacity:0.6}}>Source: {item.source}</Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-around', marginHorizontal:10}}>
                  <TouchableOpacity onPress={ ()=>{ addToFavorites(item)}}
                    style={{ width:"20%", height:30, backgroundColor:colors.colorButton ,marginBottom:15, alignSelf:'center', borderRadius:10, justifyContent:'center',alignItems:'center'}}> 
                      <Icon name="times" color="white"/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={ ()=>{ Linking.openURL(item.url)}}
                    style={{ width:"70%", height:30, backgroundColor:'#38a3a5',marginBottom:15, alignSelf:'center', borderRadius:10, justifyContent:'center',alignItems:'center'}}> 
                      <Text style={{color: "white", fontSize:13}}>Cook!</Text>
                  </TouchableOpacity>
                </View>
          </View>   
          )}
          numColumns = {2}
          estimatedItemSize={50}
          ItemSeparatorComponent={()=>{return(<View style={{height: 20}}></View>)}}
        /> :<Text style={{color: colors.whiteIconColor, textAlign:'center', fontSize:17}}>You don't have any favorite meals!</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
