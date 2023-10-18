import "./Search.css"
import Select from 'react-select';
import {useState} from "react";

const Search = ({onSelectedCity}) => {

    const [selectedOption, setSelectedOption] = useState("")
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    let timer = null;
    const fetchSuggestions = async (inputValue) => {
        if (inputValue.length < 3)
            return

        clearTimeout(timer);
        timer = setTimeout(async () => {
            setLoading(true);
            try {
                let response = await fetch(
                    `https://api.openweathermap.org/data/2.5/find?q=${inputValue}&type=like&units=metric&lang=fr&limit=5&APPID=68a7cb24887d08992214b10d64d3b9b8`
                );
                response = await response.json();
                if (response.cod === "200") {
                    setSuggestions(response.list.map((suggestion) => ({
                        value: suggestion.id,
                        label: `${suggestion.name}, ${suggestion.sys.country}`,
                        city: suggestion,
                    })).filter((v, i, a) => a.findIndex(v2 => (v2.label === v.label)) === i));
                }
                setLoading(false);
            } catch (error) {
                setSuggestions([])
            }
            setLoading(false);
        }, 250);
    };

    const handleInputChange = (inputValue) => {
        fetchSuggestions(inputValue);
    };

    const handleOptionSelect = ({city}) => {
        onSelectedCity(city)
        setSelectedOption("")
    };

    return (
        <div className="d-flex justify-content-center h-100">
            <div className="search" style={{width: '100vw'}}>
                <Select
                    className="search-select"
                    placeholder="Search..."
                    value={selectedOption}
                    onChange={handleOptionSelect}
                    onInputChange={handleInputChange}
                    options={suggestions}
                    isLoading={loading}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: 'hotpink',
                            primary: 'black',
                        },
                    })}
                />
            </div>
        </div>
    )
}

export default Search