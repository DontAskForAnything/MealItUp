import { Platform,TextInput, ActivityIndicator,Keyboard ,Text,View, Image, TouchableOpacity} from 'react-native';
import {SharedElement,} from 'react-navigation-shared-element';
import { FlashList } from "@shopify/flash-list";
import { ScreenWidth } from '../utilities/Screen';
import  * as colors from '../utilities/Colors'
import Icon  from 'react-native-vector-icons/FontAwesome5'
import Constants from 'expo-constants'
import { useState,useEffect } from 'react';
import fetchRecipes from '../utilities/ApiFetch';

export default function Home({navigation,route}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const [noMore, setNoMore] = useState(false);
  const [searchError, setSearchError] = useState("");

  const fetchData = async (search,startPosition,endPosition, clean = false) => {
    try {
      const result = await fetchRecipes(search, startPosition, endPosition);
      setSearchError("");
      if(result.length <= 0 ){ setSearchError("No results"); setText(''); setNoMore(true); }
      if(clean){ setData(result); setLoading(false); }else{ setData([...data,...result]); }
    } catch (error) {
      setData([]);
      setSearchError(error);
      setLoading(false); 
      console.log(error);
    }
  };

  useEffect(() => {
    if(route.params?.category){
      if(route.params?.category == "Search"){
        setLoading(false);
        setNoMore(false);
        setData([]);
      }else{
        if(route.params.category != currentSearch){
          initSearch(route.params.category)
        } 
      }
  }
  }, [route.params])

 useEffect(()=>{
  if(page != 0 && !noMore){
    let startPosition = page*50;
    let endPosition = (page+1)*50;
    fetchData(currentSearch,startPosition,endPosition);      
  }
  },[page])

  const [text, setText] = useState('');

  const initSearch = (searchInput) => {
    if(searchInput || searchInput != ""){
      setLoading(true);
      setPage(0);
      setNoMore(false);
      fetchData(searchInput,0,50,true);      
      setCurrentSearch(searchInput);
    }else{
      setSearchError("Input can't be empty");
    }
  };
  
  return (
    <View style={{ backgroundColor:'black', flex: 1 , alignItems:"center",marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight}}>
      <View style={{ width:ScreenWidth *0.9, height:"100%"}}>
        <View style={{ padding: 10, height:50, flexDirection:'row',marginBottom: 20,marginTop:20 }}>
            <TouchableOpacity style={{width:50,marginTop:5}} onPress={()=> {navigation.openDrawer();Keyboard.dismiss(); }}>
              <Icon name="align-left" color={"white"} size={20}/>
            </TouchableOpacity>

            {data.length>0 && 
            <>
              <TextInput
              style={{color:"white",width:"70%", marginTop: -5,height:40,backgroundColor: colors.elementsColor, padding:10,borderRadius:10}}
              placeholder="Search..."
              placeholderTextColor={"white"}
              onChangeText={setText}
              onSubmitEditing={()=>initSearch(text)}
              returnKeyType="done"
            />
            <TouchableOpacity title="Submit" onPress={()=>initSearch(text)}
            style={{color:"white", aspectRatio:1, height:40, marginLeft: 10, justifyContent:'center', alignContent:'center', marginTop: -5,backgroundColor: colors.elementsColor,borderRadius:10}}>
              <Icon name="arrow-right" size={15} color={colors.iconColor} style={{textAlign:'center'}}/>
          </TouchableOpacity>
          </>
            }
    </View>
     {
      loading ?<ActivityIndicator size={50} color={colors.elementsColor}/>
      :
      <>
      {!(data.length>0) ?                
                 <View style={{height:"20%", justifyContent:'center'}}>
                  <View style={{alignItems:'center'}}>
                    <Text style={{color:'red', marginBottom:10, fontWeight:"bold"}}>{searchError}</Text>
                    <TextInput
                      style={{color:"white",width:"90%", height:40,backgroundColor: colors.elementsColor, padding:10,borderRadius:10}}
                      placeholder="Search..."
                      placeholderTextColor={"white"}
                      onChangeText={setText}
                      onSubmitEditing={()=>initSearch(text)}
                      returnKeyType="done"
                    />
                    <TouchableOpacity title="Submit" onPress={()=>initSearch(text)}
                      style={{color:"white", marginTop:20,height:40,backgroundColor: colors.elementsColor, padding:10,borderRadius:10, width:200}}>
                        <Text style={{color:'white', textAlign:'center'}}>🍕   🍔   Search   🐟   🥪</Text>
                    </TouchableOpacity>
                  </View>
               </View>
                :
                <FlashList 
                    data={data}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity  
                          style={[{backgroundColor:colors.elementsColor, width:"95%", minHeight:220,borderRadius:15}, index % 2 === 0? {} : {marginLeft: 10}]}
                          onPress={() => navigation.push('Details', { el : item})}>
                    
                         <SharedElement id={`${item.recipe.uri}.photo`} >
                            <Image resizeMode="cover" style={{aspectRatio:1, width: "100%",borderTopLeftRadius:15, borderTopRightRadius:15}} source={{uri: item.recipe.image}}/>
                        </SharedElement>
                                            
                        <View style={{padding:10, justifyContent:'space-between', minHeight:65}}>
                            <Text style={{color: 'white', fontWeight:"bold",fontSize:16}}>{item.recipe.label}</Text>
                            <Text style={{color: 'white', fontSize:12, opacity:0.6}}>Source: {item.recipe.source}</Text>
                        </View>
                    </TouchableOpacity>   
                    )}
                    numColumns = {2}
                    onEndReachedThreshold={0.3}
                    onEndReached={()=>{setPage(page+1);}}
                    estimatedItemSize={100}
                    ItemSeparatorComponent={()=>{return(<View style={{height: 20}}></View>)}}
                />
            } 
          </>
     }
  </View>
</View>
  );
}
