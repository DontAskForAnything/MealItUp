import { API_ID, API_KEY } from '@env';
export default function fetchRecipes(searchInput, startPosition, endPosition) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.edamam.com/search?q=${searchInput}&app_id=${API_ID}&app_key=${API_KEY}&from=${startPosition}&to=${endPosition}`)
        .then((resp) => resp.json())
        .then((result) => {
          if (result["hits"]) {
            resolve(result["hits"]);
          }else if(result["message"]) {
            reject(result["message"]);
          }
          else {
            reject("API result was not well-formatted");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }