import City from "./Compenents/City.jsx";
import Search from "./Compenents/Search.jsx";
import {useState} from "react";

const getFavoris = () => {
    let favoris = localStorage.getItem('favoris')
    if (favoris) {
        favoris = JSON.parse(favoris)
    }
    return favoris || []
}

function App() {
    const [cities, setCities] = useState(getFavoris())

    const addToFavoris = (city) => {
        let favoris = getFavoris();
        let indexInFavoris = favoris.findIndex((fav) => fav.id === city.id)
        if (indexInFavoris !== -1) {
            favoris[indexInFavoris] = city
        } else {
            favoris = [city, ...favoris]
        }
        // ca sauve sur le brower
        localStorage.setItem('favoris', JSON.stringify(favoris))
        // met a jours mes cities
        setCities(favoris)
    }

    const removeFromFavoris = (city) => {
        let favoris = getFavoris();
        let indexInFavoris = favoris.findIndex((fav) => fav.id === city.id)
        if (indexInFavoris !== -1) {
            favoris.splice(indexInFavoris, 1);
        }
        localStorage.setItem('favoris', JSON.stringify(favoris))
        setCities(favoris)
    }

    const onSelectedCity = (city) => {
        if (cities.filter((c) => c.id === city.id).length === 0) {
            setCities((oldCities) => [city, ...oldCities])
        }
    }

    return (
        <>
            <div className="container-fluid px-1 px-md-4 py-2 mx-auto">
                <Search onSelectedCity={onSelectedCity}></Search>
                {cities.map((city) =>
                    <City addToFavoris={addToFavoris} removeFromFavoris={removeFromFavoris} key={city.id}
                          city={city} favoris={city.favoris}></City>
                )}
            </div>
        </>
    )
}

export default App
