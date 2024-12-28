import React, { createContext, useState,useEffect } from "react";
import axios from "axios";

// Создаем контекст
export const AppContext = createContext();

// Провайдер контекста
export const AppProvider = ({ children }) => {



    const [userData, setUserData] = useState(
        // JSON.parse(localStorage.getItem('userData'))
        {}
    ); // Данные пользователя
    const [vacancies, setVacancies] = useState([]); // Список вакансий
    const [employersVacancies, setEmployersVacancies] = useState([]); // Список вакансий работадателя
    const [jobApplication, setJobApplication] = useState([]); // Список вакансий которые пользоватль взаимодействовал
    const [deteilVacancy, setdeteilVacancy] = useState(null); // Выбранная вакансия
    const [page, setPage] = useState(1);   // Текущая страница
    const [citiesAndArea, setCitiesAndArea] = useState([]); // Все города с районами

    const Token = localStorage.getItem('authToken');

    // Инициализация состояния
    const [settings_site, setSettings_site] = useState(() => {
        // Попробуем загрузить данные из localStorage
        const savedData = localStorage.getItem('settings_site');
        return savedData
            ? JSON.parse(savedData) // Если данные есть, преобразуем их в объект
            : {
                search_filter: {
                    new: true,
                    city: userData.city? userData.city.city :'',
                    city_id: userData.city? userData.city.id :'',
                    area: userData.area ? userData.area.area :'',
                    area_id: userData.area ? userData.area.id :'',
                },
                settings: {
                    night_mode: false,
                },
            };
    });
    const request_to_the_server = () => {
        axios.get(`http://127.0.0.1:8001/api/v1/cities/`, {
            // headers: {
            //     'Authorization': `JWT ${Token.tokens.access}`,
            // },
        })
            .then(response => {
                localStorage.setItem('DataCity', JSON.stringify(response.data));
                setCitiesAndArea(response.data)
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }
    useEffect(() => {
        if (Object.keys(jobApplication).length === 0){
            let tokens = JSON.parse(Token);
            axios.get('http://localhost:8001/api/v1/job_application_list/', {
                headers: {
                    'Authorization': `JWT ${tokens.tokens.access}`,
                }
            })
                .then(response => {
                    setJobApplication(response.data);
                    localStorage.setItem('JobApplicationList', JSON.stringify(response.data));

                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных:', error);
                });
        }else {
            const applicationList = localStorage.getItem('JobApplicationList');
            setJobApplication(JSON.parse(applicationList));
        }
    },[]);
    useEffect(()=>{
        const currentTime = new Date().getTime(); // Текущее время в миллисекундах
        const lastRequestTime = localStorage.getItem("Request_time");
        if (lastRequestTime) {
            const timeDifference = currentTime - parseInt(lastRequestTime, 10);
            // Если прошло менее 24 часов (24 * 60 * 60 * 1000 миллисекунд)
            if (timeDifference < 24 * 60 * 60 * 1000) {
                const DataCityAndArea = localStorage.getItem('DataCity');
                if(DataCityAndArea){
                    let cityAndArea = JSON.parse(DataCityAndArea);
                    setCitiesAndArea(cityAndArea)
                }else {
                    localStorage.setItem('DataCity', JSON.stringify(citiesAndArea));
                    request_to_the_server()
                }
            } else {
                request_to_the_server()
                localStorage.setItem("Request_time", currentTime.toString());
            }
        } else {
            request_to_the_server()
            localStorage.setItem("Request_time", currentTime.toString());
        }
    },[])

    // Сохранение состояния в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('settings_site', JSON.stringify(settings_site));
    }, [settings_site]);

    return (
        <AppContext.Provider
            value={{page, setPage, userData, setUserData, vacancies, setVacancies, deteilVacancy, setdeteilVacancy,
                citiesAndArea, setCitiesAndArea,settings_site, setSettings_site,employersVacancies, setEmployersVacancies,jobApplication, setJobApplication}}>
            {children}
        </AppContext.Provider>
    );
};
