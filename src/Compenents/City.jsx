import "./City.css"
import {useEffect, useState} from "react";

const City = ({city = null, addToFavoris, removeFromFavoris}) => {

    // Je déclare mes states qui vont faire bouger ma vue
    const [info, setInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isFavoris, setIsFavoris] = useState(city.favoris)

    // Au chargement je lance mon fetch des data
    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async (force = false) => {
        setIsLoading(true)
        setError(null)
        if (city) {
            // Si mes data dans le localstore date de plus d'une heure ou que je force je reprends les datas
            if (city.dt < Date.now() / 1000 - 3600 || force) {
                try {
                    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&lang=fr&APPID=68a7cb24887d08992214b10d64d3b9b8`)
                    console.log(response)
                    let data = await response.json()
                    setInfo(data)
                    if (isFavoris) {
                        addToFavoris({...data, favoris: true})
                    }
                } catch (e) {
                    setError(e.message)
                }
                // Sinon je garde mes data du localstorage
            } else {
                setInfo(city)
            }
        } else {
            setError('Aucune localisation trouvé.')
        }
        setIsLoading(false)
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const toogleFavoris = () => {
        if (isFavoris) {
            removeFromFavoris(info)
            setIsFavoris(false)
        } else {
            addToFavoris({...info, favoris: true})
            setIsFavoris(true)
        }
    }

    const refresh = async () => {
        await fetchInfo(true)
    }

    let description, temperature, date, time, name
    let image = "https://i.imgur.com/dpqZJV5.jpg"
    if (info) {
        let datetime = new Date(info.dt * 1000)
        name = `${info.name}, ${info.sys.country}`
        description = info.weather && capitalizeFirstLetter(info.weather[0].description)
        temperature = info.main && info.main.temp.toFixed(1)
        date = datetime.toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'})
        time = `${datetime.getHours().toString().padStart(2, '0')}:${datetime.getMinutes().toString().padStart(2, '0')}`
        switch (info.weather[0].main) {
            case 'Clouds':
                image = "https://i.imgur.com/NgB8PnT.jpeg"
                break
            case 'Clear':
                image = 'https://i.imgur.com/tFDOYEf.jpeg'
                break
        }
    }

    return (
        <>
            <div className="row d-flex justify-content-center px-3">
                <div
                    style={{backgroundImage: `url(${image})`}}
                    className={`card ${(isLoading || error) && "d-flex align-items-center justify-content-center"}`}>
                    {isLoading &&
                        <div className="text-center med-font">Loading...</div>
                    }
                    {!isLoading && error &&
                        <div className="text-center med-font">{error}</div>
                    }
                    {!isLoading && !error && info &&
                        <>
                            <div className="float-left ml-2 mt-2">
                                <i onClick={toogleFavoris}
                                   className={`fa ${isFavoris ? "fa-heart" : "fa-heart-o"} cursor-pointer`}
                                   aria-hidden="true"></i>
                                <i onClick={refresh} className="fa fa-refresh ml-2 cursor-pointer"
                                   aria-hidden="true"></i>
                            </div>
                            <h2 className="ml-auto mr-4 mt-3 mb-0">{name}</h2>
                            <p className="ml-auto mr-4 mb-0 med-font">{description}</p>
                            <h1 className="ml-auto mr-4 large-font">{temperature}&#176;</h1>
                            <p className="time-font mb-0 ml-4 mt-auto">{time}</p>
                            <p className="ml-4 mb-4">{date}</p>
                        </>
                    }
                </div>
            </div>
        </>

    )
}

export default City