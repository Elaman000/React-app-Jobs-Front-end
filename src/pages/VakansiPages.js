import React, {useState} from "react";
import {BrowserRouter, Routes, Route, NavLink, useNavigate} from "react-router-dom";

import './index.css';
import JobsPage from "./JobsPages";


const VakansiPages = ({dataJobs,choices}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [vakansiData, setVakansiData] = useState({});
    const [vakansi, setVakansi] = useState(false);

    const OnclikVakansi = (e) => {
        setVakansi(true)
        setVakansiData(e)
    }
    return (

            <div className="block_filter_vakansi">
                    <div className="blick-search-vakanci" id="id_search_vakanci">
                        <div id="div_urls_blick" className="div_urls_blick" data-query="search">
                            <div className="clue-search">Удалить фильтр</div>

                            <span>Поиск: <strong>daw</strong></span>
                            <i className="fa-solid fa-x"></i>
                        </div>
                    </div>
                    <div className="blick-search-vakanci" id="id_search_vakanci"></div>
                    <aside className="aside-left">
                        <div className="accordion" id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                            aria-controls="panelsStayOpen-collapseOne">
                                        <h5>Город</h5>
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                                    <div className="accordion-body">
                                        <div className="btn-filter-city">
                                            <input type="radio" className="btn-check" name="cities" value="all"
                                                   id="cities-all" autoComplete="off" checked=""
                                                   onChange="sendGetRequest('cities', this.value)"/>
                                            <label className="btn" htmlFor="cities-all">Все города</label>

                                            <input type="radio" className="btn-check" name="cities" value="Ош"
                                                   id="cities-1"
                                                   autoComplete="off" onChange="sendGetRequest('cities', this.value)"/>
                                            <label className="btn" htmlFor="cities-1">Ош</label>

                                            <input type="radio" className="btn-check" name="cities" value="Баткан"
                                                   id="cities-2" autoComplete="off"
                                                   onChange="sendGetRequest('cities', this.value)"/>
                                            <label className="btn" htmlFor="cities-2">Баткан</label>

                                            <input type="radio" className="btn-check" name="cities" value="Чуй"
                                                   id="cities-3" autoComplete="off"
                                                   onChange="sendGetRequest('cities', this.value)"/>
                                            <label className="btn" htmlFor="cities-3">Чуй</label>

                                            <input type="radio" className="btn-check" name="cities" value="Ыссык Кол"
                                                   id="cities-4" autoComplete="off"
                                                   onChange="sendGetRequest('cities', this.value)"/>
                                            <label className="btn" htmlFor="cities-4">Ыссык Кол</label>

                                            <input type="radio" className="btn-check" name="cities" value="Талас"
                                                   id="cities-5" autoComplete="off"
                                                   onChange="sendGetRequest('cities', this.value)"/>
                                            <label className="btn" htmlFor="cities-5">Талас</label>

                                            <input type="radio" className="btn-check" name="cities" value="Наарын"
                                                   id="cities-6" autoComplete="off"
                                                   onChange="sendGetRequest('cities', this.value)"/>
                                            <label className="btn" htmlFor="cities-6">Наарын</label>

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
                                               placeholder="Укажыте сумму"/>

                                        <button className="btn btn-primary" id="wage-search-btn">Искать</button>
                                        <button className="btn btn-primary" id="wage-clear-btn">Очистить</button>
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
                                            <input type="radio" className="btn-check" name="experiences" value="all"
                                                   id="experiences-all" autoComplete="off" checked=""
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-all">Все вариянты</label>

                                            <input type="radio" className="btn-check" name="experiences"
                                                   value="Без опыта"
                                                   id="experiences-1" autoComplete="off"
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-1">Без опыта</label>

                                            <input type="radio" className="btn-check" name="experiences"
                                                   value="От 1 до 3 лет" id="experiences-2" autoComplete="off"
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-2">От 1 до 3 лет</label>

                                            <input type="radio" className="btn-check" name="experiences"
                                                   value="От 3 до 5 лет" id="experiences-3" autoComplete="off"
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-3">От 3 до 5 лет</label>

                                            <input type="radio" className="btn-check" name="experiences"
                                                   value="Более 5 лет"
                                                   id="experiences-4" autoComplete="off"
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-4">Более 5 лет</label>

                                            <input type="radio" className="btn-check" name="experiences"
                                                   value="Стажировка"
                                                   id="experiences-5" autoComplete="off"
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-5">Стажировка</label>

                                            <input type="radio" className="btn-check" name="experiences"
                                                   value="Волонтерский опыт" id="experiences-6" autoComplete="off"
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-6">Волонтерский опыт</label>

                                            <input type="radio" className="btn-check" name="experiences"
                                                   value="Производственная практика" id="experiences-7"
                                                   autoComplete="off"
                                                   onChange="sendGetRequest('experiences', this.value)"/>
                                            <label className="btn" htmlFor="experiences-7">Производственная
                                                практика</label>

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
                                        <div className="btn-filter-schedules">
                                            <input type="radio" className="btn-check" name="schedules" value="all"
                                                   id="schedules-all" autoComplete="off" checked=""
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-all">Все вариянты</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Полный рабочий день" id="schedules-1" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-1">Полный рабочий день</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Неполный рабочий день" id="schedules-2" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-2">Неполный рабочий день</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Частичная занятость" id="schedules-3" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-3">Частичная занятость</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Удаленная работа" id="schedules-4" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-4">Удаленная работа</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Надомная работа" id="schedules-5" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-5">Надомная работа</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Гибкий график"
                                                   id="schedules-6" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-6">Гибкий график</label>

                                            <input type="radio" className="btn-check" name="schedules" value="Посменный"
                                                   id="schedules-7" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-7">Посменный</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Свободный график" id="schedules-8" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-8">Свободный график</label>

                                            <input type="radio" className="btn-check" name="schedules"
                                                   value="Вахтовый метод" id="schedules-9" autoComplete="off"
                                                   onChange="sendGetRequest('schedules', this.value)"/>
                                            <label className="btn" htmlFor="schedules-9">Вахтовый метод</label>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <main>
                        <div>
                            <form method="get" action="/vakatsi/">
                                <div className="input-group mb-3">
                                    <input type="search" id="id_input_search" className="form-control" name="search"
                                           placeholder="Что вы ишите?" aria-label="Recipient's username"
                                           aria-describedby="button-addon2"/>
                                    <button className="btn btn-outline-secondary" type="submit">Найти</button>
                                </div>
                            </form>
                        </div>
                        <div className="all-jobs-vakatsi">
                            {dataJobs.map((item, index) => {
                                return (
                                    <div className="card_vakansi" key={index}>
                                        <div className="card-body">
                                            <h4 className="card-title">{item.title}</h4>
                                            <p className="card-text-info">{item.title_info}</p>
                                            <span className="card-experience">{item.schedule.label}</span>
                                            <p className="card-wage">{item.wage}сом</p>
                                            {item.company ?
                                                <p>
                                                    <i className="icon-card-jobs fa-solid fa-briefcase"></i>
                                                    <span className="card-text"> {item.company.name}</span>
                                                </p>
                                                : null}

                                            <p>
                                                <i className="fa-regular fa-map"></i>
                                                <span className="card-text">{item.city_name}, {item.area_name}</span>
                                            </p>
                                            {item.schedule.label ? <p>
                                                <i className="fa-regular fa-clock"></i>
                                                <span>{item.schedule.label} </span>
                                            </p> : null}
                                        </div>
                                        <div className="card-jobs-botton-save">
                                            <i className="fa-regular fa-bookmark"></i>
                                        </div>
                                        <div className="card-jobs-data_add">
                                            Опубликовано: {new Date(item.time_create).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                        </div>
                                        <button onClick={() => {
                                            OnclikVakansi(item)
                                        }}
                                                className="btn btn-primary" type="submit">Отправить
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </main>
                </div>

    )
}
export default VakansiPages;