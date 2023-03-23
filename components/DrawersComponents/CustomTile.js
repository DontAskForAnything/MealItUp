import { Text, View,TouchableOpacity } from 'react-native'
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import  * as colors from '../../utilities/Colors'
import { useNavigation,CommonActions } from '@react-navigation/native';

export default function CustomTile({icon,title,favorites}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
        style={[{width: favorites? "100%": '30%', backgroundColor: colors.elementsColor, borderRadius: 20}, favorites?{height:50}:{aspectRatio: 1} ]}
        onPress ={() => { favorites?  navigation.dispatch({...(CommonActions.navigate("Favorites",{refresh: true}))}):navigation.dispatch({...(CommonActions.navigate("Home",{category: title}))}); }} >
        <View style={{justifyContent:'center', alignItems:'center', flexDirection: favorites? "row": "column",width:'100%', height:"100%"}}>
            <Icon name={icon} style={{color: colors.iconColor}} size={25}></Icon>
            <Text  style={[{color: colors.iconColor, fontSize:12}, favorites?{ marginLeft: 10}:{ marginTop: 5}]}>{title}</Text>
        </View>
    </TouchableOpacity>
  )
}
