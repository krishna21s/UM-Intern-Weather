import userEvent from '@testing-library/user-event';
import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';

const Whether = () => {
    const [whetherData, setWhetherData] = useState({
        city: '',
        humidity: '',
        temperature: '',
        windSpeed: '',
        whetherImg: '',
        weatherCondition: ''
    });
    const [inputData, setInputData] = useState('');
    const [errorHandle, setErrorHandle] = useState('');
    const [storedData, setStoredData] = useState('');
    const [loading, setLoading] = useState(false);
    const themeClass = useRef(null);
    const [bg, setBg] = useState('');
    AOS.init({
        disable: true, // Disable animations on scroll
    });
    function handleInputChange(event) {
        setInputData(event.target.value);
    }
    function handleClick() {
        if (inputData.trim() !== '') {
            setStoredData(inputData);
        } else {
            setErrorHandle('Please enter a city name');
        }
    }
    const search = async (city) => {
        setLoading(true);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_ID}`;
            const response = await fetch(url);

            // Check if the response is ok (status 200-299)
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data);
            setWhetherData({
                city: data.name,
                humidity: data.main.humidity,
                temperature: data.main.temp,
                windSpeed: data.wind.speed,
                whetherImg: data.weather[0].icon,
                weatherCondition: data.weather[0].main,
                weatherRain: data
            });
            setErrorHandle('');
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            setErrorHandle('Error fetching weather data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (storedData !== '') {
            search(storedData);
        }
    }, [storedData]);
    useEffect(() => {
        if (whetherData.weatherCondition == 'Clouds') {
            const div = themeClass.current;
            div.classList.add('bg-clouds')
            setBg('https://vistapointe.net/images/dark-cloud-wallpaper-18.jpg');
            div.style.color = 'white';
        }
        if (whetherData.weatherCondition == 'Clear') {
            const div = themeClass.current;
            div.classList.add('bg-clear')
            setBg('https://images.pexels.com/photos/158827/field-corn-air-frisch-158827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
            div.style.color = 'rgba(44, 30, 30, 0.849)';
        }
        if (whetherData.weatherCondition == 'Drizzle' || whetherData.weatherCondition == 'Rain') {
            const div = themeClass.current;
            div.classList.add('bg-drizzle')
            setBg('https://images.pexels.com/photos/21492/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600');
            div.style.color = 'white';
        }
        // this condition is only for rain (for some exceptions)😊
        if (whetherData.weatherRain == 'Rain') {
            const div = themeClass.current;
            div.classList.add('bg-drizzle')
            setBg('https://images.pexels.com/photos/21492/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600');
            div.style.color = 'white';
        }
        if (whetherData.weatherCondition == 'Haze' || whetherData.weatherCondition == 'Mist') {
            const div = themeClass.current;
            div.classList.add('bg-Haze')
            setBg('https://wallpapercave.com/wp/wp8675529.jpg');
            div.style.color = 'white';
        }
    }, [whetherData.weatherCondition]);
    useEffect(() => {
        AOS.init();
    }, [whetherData]);
    return (
        <div className="main" ref={themeClass} style={{ backgroundImage: `url(${bg})` }} >
            <div className="container h-100 d-flex justify-content-center align-items-center" >
                <div className="row weather border m-2 text-center p-2">
                    <h2 className="whether-text">{whetherData.city}</h2>
                    <div className="input-loc d-flex justify-content-center align-items-center">
                        <input
                            type="search"
                            placeholder="search Location"
                            onChange={handleInputChange}
                        />
                        <button className="btn btn-outline-dark m-1" onClick={handleClick}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>
                    {/* <p className='fs-4'>Thursday, 15th August</p> */}
                    <h2 >{whetherData.weatherCondition}</h2>
                    <div>
                        {loading ? (
                            <div className='d-flex justify-content-center '>
                                <div className="circle1">
                                    <div className="ball ball4 ball4a"></div>
                                    <div className="ball ball4 ball4b"></div>
                                    <div className="ball ball4 ball4c"></div>
                                    <div className="ball ball4 ball4d"></div>
                                    <div className="ball ball4 ball4e"></div>
                                    <div className="ball ball4 ball4f"></div>
                                    <div className="ball ball4 ball4g"></div>
                                    <div className="ball ball4 ball4h"></div>
                                    <div className="ball ball4 ball4i"></div>
                                </div>
                            </div>
                        ) : (
                            <img
                                className="weather-img"
                                src={`https://openweathermap.org/img/wn/${whetherData.whetherImg}@2x.png`}
                                alt="whether image"
                            />
                        )}
                        <p className="error-text fs-2 mt-3">{errorHandle}</p>
                    </div>
                    <h3 className="fs-2">{whetherData.temperature}℃</h3>
                    <div className="air-details row">
                        <div className="col " data-aos="fade-in" data-aos-delay="500">
                            <i className="fa-solid fa-droplet fs-2"></i>
                            <p className="fs-5 " data-aos="fade-in" data-aos-delay="1000">Humidity: {whetherData.humidity}</p>
                        </div>
                        <div className="col">
                            <i className="fa-solid fa-wind fs-2"></i>
                            <p data-aos="fade-up" className="fs-5 ">Wind: {whetherData.windSpeed} km/h</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Whether;