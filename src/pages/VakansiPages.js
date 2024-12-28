import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter, Routes, Route, NavLink, useNavigate} from "react-router-dom";

import './index.css';
import {AppContext} from "../AppContext";
import axios from "axios";

const VakansiPages = () => {
    const {vacancies,setVacancies, setdeteilVacancy,page, setPage , settings_site,
        setSettings_site,citiesAndArea} = useContext(AppContext);
    const [filter_selection, serFilter_selection] = useState()
    const [saveDataJobs, setSaveDataJobs] = useState(() => {
        // Получаем данные из localStorage при первой загрузке
        const dataSave = localStorage.getItem('Save_Jobe');
        return dataSave ? JSON.parse(dataSave) : [];
    });

    useEffect(() => {

        const lastRequestTime = localStorage.getItem("Filter_selection");
        if(lastRequestTime){
            let selection = JSON.parse(lastRequestTime);
            serFilter_selection(selection)
        }else {
            console.log("Запрос на сервер")
            axios.get(`http://127.0.0.1:8002/api/v1/choices/jobs/`, {
                // headers: {
                //     'Authorization': `JWT ${Token.tokens.access}`,
                // },
            })
                .then(response => {
                    localStorage.setItem('Filter_selection', JSON.stringify(response.data));
                    serFilter_selection(response.data)
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных:', error);
                });
        }
    }, []);

    const [setimg, serSsetimg] = useState({
        search: '',
        wage: null,
        date: null,
        schedule: 'all', // График работы
        schedule_id: null, // График работы
        experience:'all', // Опыт работы
        experience_id:null, // Опыт работы
    })

    const  data = {                // Параметры для GET запроса
        // new: settings_site.search_filter.new,
        city_id:settings_site.search_filter.city_id,
        area_id:settings_site.search_filter.area_id,
        search: setimg.search,
        // wage: setimg.wage,
        // date: setimg.date,
        // schedule: setimg.schedule,
    }
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nexstVakansi, setNexstVakansi] = useState(true);

    const [loadingNewJobs, setLoadingNewJobs] = useState(true); // Индикатор загрузки

    useEffect(() => {

        // setFilter((prevFilter) => ({
        //     ...prevFilter,
        //     new: false,
        // }));

        if (nexstVakansi) {
            if (loadingNewJobs){
                axios.get(`http://127.0.0.1:8002/api/v1/jobs_list/?page=${page}`, {
                    // headers: {
                    //     'Authorization': `JWT ${Token.tokens.access}`,
                    // },
                    params: data
                })
                    .then(response => {
                        setLoading(false);
                        setVacancies(  [...vacancies, ...response.data.results]);
                        setLoadingNewJobs(false)
                        // console.log(response.data.next);
                        if (!response.data.next) {
                            setNexstVakansi(false)
                        }else {
                            setPage(page + 1)
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка при загрузке данных:', error);
                        setError(true);
                    });
            }
        }
    },[loadingNewJobs])

     const scrollHendlers = (e) => {
        if (e.target.documentElement.scrollHeight -(e.target.documentElement.scrollTop+window.innerHeight)<10){
            setLoadingNewJobs(true)
        }
    }

    useEffect(() => {
        document.addEventListener("scroll", scrollHendlers);
        return () => {
            document.removeEventListener("scroll", scrollHendlers);
        }
    },[])

    // useEffect(() => {
    //     // if (!vacancies[0]){
    //     //     axios.get('http://127.0.0.1:8002/api/v1/jobs_list/', {
    //     //         // headers: {
    //     //         //     'Authorization': `JWT ${Token.tokens.access}`,
    //     //         // }
    //     //     })
    //     //         .then(response => {
    //     //             setLoading(false);
    //     //             setVacancies(response.data.results);
    //     //         })
    //     //         .catch(error => {
    //     //             console.error('Ошибка при загрузке данных:', error);
    //     //             setError(true);
    //     //         });
    //     // }else {
    //     //     setLoading(false);
    //     // }
    // }, [vacancies]);

    const oncklikSeorch = () => {
        setLoadingNewJobs(true)
        setNexstVakansi(true)
        setPage(1)
        setVacancies([])
    }

    const handleVacancyClick = (vacancy) => {
        setdeteilVacancy(vacancy); // Устанавливаем выбранную вакансию
        localStorage.setItem("selectedVacancy", JSON.stringify(vacancy)); // Сохраняем в LocalStorage
        navigate(`/vakatsi/deteil/${vacancy.id}`); // Переходим на страницу деталей
    };

    // Функция для обработки изменения Города
    const handleCityChange = (name,id) => {
        setSettings_site((prevState) => ({
            ...prevState,
            search_filter: {
                ...prevState.search_filter,
                city: name,
                city_id: id,
                area: '',
                area_id: null
            },
        }));
    };

    // Функция для обработки изменения Района
    const handleAreaChange = (name,id) => {
        setSettings_site((prevState) => ({
            ...prevState,
            search_filter: {
                ...prevState.search_filter,
                area: name,
                area_id: id
            },
        }));
    };

    // Функция для обработки изменения значения заработной платы
    const handleWageChange = (event) => {
        const wageValue = event.target.value;
        serSsetimg((prevState) => ({
                ...prevState,
                wage: wageValue ? parseInt(wageValue, 10) : null,

        }));
    };
    // Функция для обработки изменения значения поиска
    const handleSeorchChange = (event) => {
        const searchValie = event.target.value;
        serSsetimg((prevState) => ({
                ...prevState,
                search: searchValie
        }));
    };
    // Функция для изменения режыма новых записей
    const handleNewJobsChange = () => {
        setSettings_site((prevState) => ({
            ...prevState,
            search_filter: {
                ...prevState.search_filter,
                new: !prevState.search_filter.new,
            },
        }));
    }
    // Функция для обработки изменения значения experience
    const handleExperienceChange = (name,id) => {
        if (name === "all"){
            serSsetimg((prevState) => ({
                ...prevState,
                experience: "all",
                experience_id:null
            }));
        }else {
            serSsetimg((prevState) => ({
                ...prevState,
                experience: name,
                experience_id:id
            }));
        }

    };
    // Функция для обработки изменения значения schedule
    const handleScheduleChange = (name,id) => {
        if (name === "all"){
            serSsetimg((prevState) => ({
                ...prevState,
                schedule: "all",
                schedule_id:null
            }));
        }else {
            serSsetimg((prevState) => ({
                ...prevState,
                schedule: name,
                schedule_id:id
            }));
        }

    };



    const saveonClick = (data) => {
        const dataSave = localStorage.getItem('Save_Jobe');
        if (dataSave) {
            const save = JSON.parse(dataSave);

            // Проверяем, существует ли объект с таким id
            const isAlreadySaved = save.some(item => item.id === data.id);

            if (isAlreadySaved) {
                // Если объект уже есть, удаляем его
                const updatedSave = save.filter(item => item.id !== data.id);
                localStorage.setItem('Save_Jobe', JSON.stringify(updatedSave));
                setSaveDataJobs(updatedSave); // Обновляем состояние
            } else {
                // Если объекта нет, добавляем его
                const updatedSave = [...save, data];
                localStorage.setItem('Save_Jobe', JSON.stringify(updatedSave));
                setSaveDataJobs(updatedSave); // Обновляем состояние
            }
        } else {
            // Если данных еще нет, создаем новый массив с текущим объектом
            const newSave = [data];
            localStorage.setItem('Save_Jobe', JSON.stringify(newSave));
            setSaveDataJobs(newSave); // Обновляем состояние
        }
    };




    if (loading){
        return (<>Загруска...</>)
    }
    else if (error){
        return (<>Ошыпка!!!</>)
    }

    return (

            <div className="block_filter_vakansi">
                <div className="blick-search-vakanci" id="id_search_vakanci">
                    {setimg.search ?
                        <div className="div_urls_blick">
                        <div className="clue-search">Удалить фильтр</div>
                        <span>Поиск: <strong>{setimg.search}</strong></span>
                        <i className="fa-solid fa-x"/>
                    </div>:null}

                    {settings_site.search_filter.city ?
                        <div className="div_urls_blick">
                            <div className="clue-search">Удалить фильтр</div>
                            <span>
                                <strong>
                                    {settings_site.search_filter.city}{settings_site.search_filter.area?", "+settings_site.search_filter.area:null}
                                </strong>
                            </span>
                            <i className="fa-solid fa-x"/>
                        </div>:null}

                    {setimg.wage ? <div className="div_urls_blick">
                        <div className="clue-search">Удалить фильтр</div>
                        <span>Плата выше: <strong>{setimg.wage}</strong>сом</span>
                            <i className="fa-solid fa-x"/>
                        </div>:null}
                    {setimg.experience !== "all" ? <div className="div_urls_blick">
                        <div className="clue-search">Удалить фильтр</div>
                        <span>Опыт работы: <strong>{setimg.experience}</strong></span>
                        <i className="fa-solid fa-x"/>
                    </div>:null}
                    {setimg.schedule !== "all" ? <div className="div_urls_blick">
                        <div className="clue-search">Удалить фильтр</div>
                        <span>График работы: <strong>{setimg.schedule}</strong></span>
                        <i className="fa-solid fa-x"/>
                    </div>:null}


                </div>
                <div className="blick-search-vakanci" id="id_search_vakanci"></div>
                <aside className="aside-left">
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                               checked={settings_site.search_filter.new} onChange={handleNewJobsChange} />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            Новые вакансии
                        </label>
                    </div>

                    <br/>
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">

                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="true"
                                        aria-controls="collapseOne">
                                    <h5>Город</h5>
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show"
                                 data-bs-parent="#accordionExample">
                                <div className="accordion-body">

                                    <div className="btn-filter-city">
                                        {/*<input type="radio" className="btn-check" name="cities" value="all"*/}
                                        {/*       id="cities-all" autoComplete="off" checked=""/>*/}
                                        {/*<label className="btn" htmlFor="cities-all">Все города</label>*/}


                                        {/* Вывод городов и районов на фильтре */}
                                        {citiesAndArea.map((item, index) => {
                                            return (
                                                <span key={index}>
                                                    <input type="radio" className="btn-check" name="cities"
                                                           value={item.city}
                                                           id={`cities-${index}`} autoComplete="off"
                                                           checked={settings_site.search_filter.city === item.city}
                                                           onChange={() => {
                                                               handleCityChange(item.city, item.id)
                                                           }}/>
                                                    <label className="btn"
                                                           htmlFor={`cities-${index}`}>{item.city}</label>
                                                    {settings_site.search_filter.city === item.city ? <ul style={{
                                                        background: "rgb(236 236 236)"
                                                    }}>
                                                        {item.areas.map((itemArea, indexArea) => {
                                                            return (
                                                                <li key={indexArea}>
                                                                    <input type="radio" className="btn-check"
                                                                           name="area" value={itemArea.area}
                                                                           id={`area-${itemArea.id}`} autoComplete="off"
                                                                           checked={settings_site.search_filter.area === itemArea.area}
                                                                           onChange={() => {
                                                                               handleAreaChange(itemArea.area, itemArea.id)
                                                                           }}/>
                                                                    <label className="btn"
                                                                           htmlFor={`area-${itemArea.id}`}>{itemArea.area}</label>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul> : null}
                                                </span>
                                            )
                                        })}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                                        aria-controls="panelsStayOpen-collapseTwo">
                                    <h5>Оплата</h5>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                                <div className="accordion-body">
                                    <label htmlFor="search-wage">Будет выводить больше указанной суммы</label><br/>
                                    <input type="number" style={{margin: " 10px 0"}} id="search-wage"
                                           name="search-wage"
                                           placeholder="Укажыте сумму" value={setimg.wage || ''}
                                           onChange={handleWageChange}/>
                                    <button className="btn btn-primary" id="wage-search-btn">Искать</button>
                                    <button className="btn btn-primary" id="wage-clear-btn"
                                            onClick={() => handleWageChange({target: {value: ''}})}>Очистить
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false"
                                        aria-controls="panelsStayOpen-collapseThree">
                                    <h5>Опыт работы</h5>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                                <div className="accordion-body">
                                    <div className="btn-filter-experiences">

                                        <input type="radio" className="btn-check" name="experience" value="all"
                                               id="experience-all" autoComplete="off"
                                               checked={setimg.experience === 'all'} onChange={() => {
                                            handleExperienceChange("all", 0)
                                        }}/>
                                        <label className="btn" htmlFor="experience-all">Все вариянты</label>

                                        {filter_selection.experience.map((item, index) => {
                                            return (<span key={index}>
                                                <input type="radio" className="btn-check" name="experience"
                                                       value={item[1]}
                                                       id={`experience-${index}`} autoComplete="off"
                                                       checked={setimg.experience === item[1]} onChange={() => {
                                                    handleExperienceChange(item[1], item[0])
                                                }}/>
                                                <label className="btn" htmlFor={`experience-${index}`}>{item[1]}</label>
                                            </span>)
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapseThree2" aria-expanded="false"
                                        aria-controls="panelsStayOpen-collapseThree">
                                    <h5>График работы</h5>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseThree2" className="accordion-collapse collapse">
                                <div className="accordion-body">
                                    <div className="btn-filter-schedule">
                                        <input type="radio" className="btn-check" name="schedule" value="all"
                                               id="schedule-all" autoComplete="off" checked={setimg.schedule === "all"} onChange={() => {handleScheduleChange("all", 0)}}/>
                                        <label className="btn" htmlFor="schedule-all">Все вариянты</label>
                                        {filter_selection.schedule.map((item, index) => {
                                            return (<span key={index}>
                                                <input type="radio" className="btn-check" name='schedule'
                                                       value={item[1]} id={`schedule-${item[0]}`} autoComplete="off" checked={setimg.schedule === item[1]}  onChange={()=>{handleScheduleChange(item[1], item[0])}}/>
                                        <label className="btn" htmlFor={`schedule-${item[0]}`}>{item[1]}</label>
                                            </span>)
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<div className="accordion-item">*/}
                        {/*    <h2 className="accordion-header">*/}
                        {/*        <button className="accordion-button collapsed" type="button"*/}
                        {/*                data-bs-toggle="collapse"*/}
                        {/*                data-bs-target="#panelsStayOpen-schedule" aria-expanded="false"*/}
                        {/*                aria-controls="panelsStayOpen-collapseThree">*/}
                        {/*            <h5>Дата</h5>*/}
                        {/*        </button>*/}
                        {/*    </h2>*/}
                        {/*    <div id="panelsStayOpen-schedule" className="accordion-collapse collapse">*/}
                        {/*        <div className="accordion-body">*/}
                        {/*            <div className="btn-filter-schedules">*/}

                        {/*                <input type="radio" className="btn-check" name="schedules" value="all"*/}
                        {/*                       id="schedules-all" autoComplete="off" checked=""/>*/}
                        {/*                <label className="btn" htmlFor="schedules-all">Все вариянты</label>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>
                </aside>
                <main>
                    <div>
                        <div className="input-group mb-3">
                            <input type="search" id="id_input_search" className="form-control" name="search"
                                   placeholder="Что вы ишите?" aria-label="Recipient's username"
                                   onChange={handleSeorchChange}
                                   aria-describedby="button-addon2"/>
                            <button className="btn btn-outline-secondary" type="submit" onClick={oncklikSeorch}>Найти</button>
                        </div>
                    </div>
                    <div className="all-jobs-vakatsi">
                        {vacancies.map((item, index) => {
                            return (
                                <div className="card_vakansi" key={index} onClick={() => {
                                    handleVacancyClick(item)
                                }}>
                                    <div className="card-body">
                                        <h4 className="card-title">{item.title}</h4>
                                        <p className="card-text-info">{item.title_info}</p>
                                        <span className="card-experience">{item.schedule.label}</span>
                                        <p className="card-wage">{item.wage}сом</p>
                                        {item.company ?
                                            <p>
                                                <i className="icon-card-jobs fa-solid fa-briefcase"/>
                                                <span className="card-text"> {item.company.name}</span>
                                            </p>
                                            : null}

                                            <p>
                                                <i className="fa-regular fa-map"/>
                                                <span className="card-text"> {item.city_name}, {item.area_name}</span>
                                            </p>
                                            {item.schedule.label ? <p>
                                                <i className="fa-regular fa-clock"/>
                                                <span> {item.schedule.label} </span>
                                            </p> : null}
                                        </div>
                                    <div className="card-jobs-botton-save" onClick={(e) => {
                                        e.stopPropagation(); // Останавливаем всплытие события
                                        saveonClick(item); // Выполняем только сохранение
                                    }}>
                                        {
                                            saveDataJobs.some(items => items.id === item.id) ? (
                                                <i className="fa-solid fa-bookmark fa-lg" style={{color: "#5a5a5a"}}></i>
                                            ) : (
                                                <i className="fa-regular fa-bookmark fa-lg" style={{color: "#5a5a5a"}}></i>
                                            )
                                        }


                                    </div>
                                    <div className="card-jobs-data_add">
                                            Опубликовано: {new Date(item.time_create).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                        </div>
                                    </div>
                                )
                            })}
                            {!nexstVakansi? <h6>Всё</h6>: loadingNewJobs ?
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                : null}
                        </div>
                    </main>
            </div>

    )
}
export default VakansiPages;