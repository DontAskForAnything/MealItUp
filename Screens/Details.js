import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Linking, Platform, Alert  } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { ScreenHeight, ScreenWidth } from '../utilities/Screen';
import React, {useEffect } from 'react';
import { Animated } from 'react-native';
import * as colors from '../utilities/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkFavorite from '../utilities/checkFavorite';
import getFavorites from '../utilities/getFavorites';

export default function Details({route,navigation}) {
  const { el } = route.params;
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(30);
  
  const addToFavorites = async () => {
    try {
      if(!await checkFavorite(el.recipe.url)){
        getFavorites().then((favorites) =>{
          let newMeal = {};
          newMeal.label = el.recipe.label;
          newMeal.source = el.recipe.source;
          newMeal.url = el.recipe.url;
          favorites.push(newMeal);
          AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        }).then(()=>{
          Alert.alert('Added to favorite!', `${el.recipe.label} was added to your favorite dishes!`, [
            {text: 'OK', onPress: () => {}},
          ]);
        })
      }else{
        getFavorites().then((favorites) =>{
          favorites.splice(favorites.indexOf(favorites.find(fav => fav.url == el.recipe.url)),1) ;
          AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        }).then(()=>{
          Alert.alert('Deleted from favorite!', `${el.recipe.label} was deleted from your favorite dishes!`, [
            {text: 'OK', onPress: () => {}},
          ]);
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  // function to start the animation
  const startAnimation = () => {
    setTimeout(() => {
    Animated.parallel([
      // fade in the text
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // slide up the text
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, 500);
  };
  
  useEffect(() => {
    startAnimation();
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={{ width: ScreenWidth}}>
      <View>
          <SharedElement id={`${el.recipe.uri}.photo`} >
                <ImageBackground resizeMode="cover" style={{justifyContent:'flex-end',  width: "100%",height:250,borderTopLeftRadius:15, borderTopRightRadius:15, }} source={{ uri: el.recipe.image }}></ImageBackground>
          </SharedElement>
          <Animated.View style={{position: 'absolute', justifyContent:'flex-end', height: 250, width: "100%", top:0, transform: [{translateY}]}}>
              <Animated.View style={{padding:10, justifyContent:'center', backgroundColor:'rgba(0,0,0,0.6)', opacity}}>
                  <Text style={{color:'white',fontWeight:"bold",fontSize:25}}>{el.recipe.label}</Text>
              </Animated.View>
        </Animated.View> 
      </View>

    <Animated.View style={{transform: [{translateY}], opacity,position: "absolute", top:10, width:ScreenWidth,  padding: 20,paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight ,justifyContent:'space-between', flexDirection:'row'}}> 
      <TouchableOpacity 
          onPress={ ()=>{ navigation.goBack()}}
          style={{ width:35, height:35, backgroundColor:colors.iconBackground,borderRadius:50, justifyContent:'center',alignItems:'center'}}> 
            <Icon name="arrow-left-thick" style={{color: colors.whiteIconColor}} size={20}></Icon>
      </TouchableOpacity>
      <TouchableOpacity 
          onPress={addToFavorites}
          style={{width:35, height:35, backgroundColor:colors.iconBackground,borderRadius:50, justifyContent:'center',alignItems:'center'}}> 
            <Icon name={"heart"} style={{color:  colors.whiteIconColor}} size={20}></Icon>
      </TouchableOpacity>
    </Animated.View>
</View>

<View style={{width: ScreenWidth, alignItems:'center' }}>
  <View style={{ width: ScreenWidth*0.9, marginTop:15, }}>

    {el?.recipe.dietLabels.length > 0 && 
      <View  style={{width:"100%",height:80}}>
          <Text style={{fontSize:20, fontWeight:"bold",color:'white'}}>Tags: ({el.recipe.dietLabels.length})</Text>
            <ScrollView horizontal={true}>
                {el.recipe.dietLabels.map((ingredient, index)=>{
                  return(
                    <View key={index} style={{height: 30,  justifyContent:'center', alignItems:'center', minWidth:100,
                      backgroundColor: colors.elementsColor ,borderRadius:50, marginHorizontal:5, marginVertical:10 }}>
                      <Text style={{color:'white', fontSize:14, fontWeight:"bold"}}>{ingredient}</Text>
                    </View>
                  )
                })}
            </ScrollView>
        </View>}

    <Text style={{fontSize:20, fontWeight:"bold",color:'white'}}>Ingredients: ({el.recipe.ingredients.length})</Text>
    {el.recipe.ingredients &&
    <View style={{height: el?.recipe.dietLabels.length > 0 ?   ScreenHeight-345 :  ScreenHeight-250}}>
      <ScrollView style={{width: ScreenWidth*0.9, height:"100%",}} >
              {el.recipe.ingredients.map((ingredient, index)=>{
                    return(
                      <View key={index} style={{minHeight: 80, alignItems:'center', flexDirection:'row',backgroundColor: colors.elementsColor ,borderRadius:15,  marginVertical:10 }}>
                        
                        {ingredient.image  ? 
                        <Image resizeMode='cover' style={{width:80, aspectRatio: 1, borderBottomLeftRadius: 15,borderTopLeftRadius:15}} source={{uri: ingredient.image}}/>
                        :
                        <Image style={{width:80, aspectRatio: 1, borderBottomLeftRadius: 15,borderTopLeftRadius:15}} source={require('../assets/noImage.png')}/>
                        }
                        <View style={{padding:20,  width:"75%"}}>

                        <Text style={{color:'white', fontSize:14, fontWeight:"bold"}}>{ingredient.text}</Text>
                        </View>
                      </View>
                    )
              })}
      </ScrollView>
    </View>
    }
    </View> 
</View>
  
  <View style={{position: "absolute", top:250, width:"100%", height:60, padding: 20,alignItems:'flex-end'}}> 
    <TouchableOpacity 
      onPress={ ()=>{ Linking.openURL(el.recipe.url)}}
      style={{ width:60, height:60, backgroundColor:'#38a3a5', borderRadius:15, justifyContent:'center',alignItems:'center'}}> 
          <Icon name="chef-hat" style={{color: "white"}} size={25}></Icon>
          <Text style={{color: "white", fontSize:13}}>Cook!</Text>
    </TouchableOpacity>
  </View>
</View>
    
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});