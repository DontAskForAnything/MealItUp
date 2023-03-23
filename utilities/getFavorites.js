import AsyncStorage from '@react-native-async-storage/async-storage';
export default async function getFavorites () {
  const favoritesArray = await AsyncStorage.getItem('favorites');
  if (favoritesArray !== null) {
    return(JSON.parse(favoritesArray));
  }
  return([])
}