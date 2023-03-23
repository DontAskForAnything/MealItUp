import getFavorites from "./getFavorites"

export default async function checkFavorite(newUrl) {
    return new Promise((resolve) => {
        getFavorites().then(currentFavorite =>{
            if(currentFavorite.find(el=> el.url == newUrl)){resolve(true);}
            resolve(false);
        })
    });
}