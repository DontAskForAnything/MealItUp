import { View, Text } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import  * as colors from '../../utilities/Colors'
import CustomTile from './CustomTile';

export default function CustomDrawer() {
  return (
      <DrawerContentScrollView style={{backgroundColor:colors.mainBackground}}>
          <View style={{display:'flex', alignItems:'center',marginTop:20}}>
              <View style={{flexDirection:'column', width:'90%'}}>
                  <Text style={{color:'white', textAlign:'center', fontSize:20, marginBottom:10}}>MealItUp</Text>
                  <View style={{flexDirection:'row', justifyContent:'space-around',marginBottom:10}}>
                          <CustomTile icon={"taco"} title={"Tacos"} />
                          <CustomTile icon={"noodles"} title={"Spaghetti"} />
                          <CustomTile icon={"magnify"} title={"Search"} />
                  </View>

                  <View style={{flexDirection:'row', justifyContent:'space-around',marginBottom:10}}>
                      <CustomTile icon={"fish"} title={"Fish"} />
                      <CustomTile icon={"food-drumstick"} title={"Chicken"} />
                      <CustomTile icon={"bowl"} title={"Salad"} />
                  </View>

                  <View style={{flexDirection:'row', justifyContent:'space-around',marginBottom:10}}>
                      <CustomTile icon={"heart"} title={"Favorite"} favorites={true} />
                  </View>
              </View>        
          </View>
      </DrawerContentScrollView>
  )
}
