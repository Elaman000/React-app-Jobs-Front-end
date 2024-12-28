import React, {useContext, useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../AppContext";
import axios from "axios";


const SimilarVacancies = () => {
    const navigate = useNavigate();
    const {deteilVacancy,setdeteilVacancy, // Выбранный вакансия
        vacancies, setVacancies,
    } = useContext(AppContext);
    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков


    const [page, setPage] = useState(1);   // Текущая страница
    const [selectedVacancies, setselectedVacancies] = useState([]); // Список похожых вакансий
    const [nexstVakansi, setNexstVakansi] = useState(true);
    const [loadingNewJobs, setLoadingNewJobs] = useState(true); // Индикатор загрузки

    const data = JSON.parse(localStorage.getItem("selectedVacancy"))
    const datas = {
        id:data.id,
        city_id:data.city_id,
        area_id:data.area,
        // company:items.company,
        title: data.title,
    };
    useEffect(() => {
        if (nexstVakansi) {
            if (loadingNewJobs){
                let tokenText = localStorage.getItem("authToken")
                let token = JSON.parse(tokenText);
                axios.get(`http://127.0.0.1:8002/api/v1/vakatsi/deteil/?page=${page}`, {
                    params: {
                        ...datas // Данные передаются в параметрах запроса
                        // page: page
                    },
                    // headers: {
                    //     'Authorization': `JWT ${token.tokens.access}`,
                    // }
                })
                    .then(response => {
                        setLoading(false);
                        // setVacancies([...vacancies, ...selectedVacancies]); // Загрузить похожие вакансии на общий
                        setselectedVacancies([...selectedVacancies, ...response.data.results]); // Список похожих вакансий

                        setLoadingNewJobs(false);
                        // console.log(response.data.next);
                        if (!response.data.next) {
                            setNexstVakansi(false);
                        } else {
                            setPage(page + 1);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка при загрузке данных:', error);
                        setError(true);
                    });
            }
        }
    },[loadingNewJobs])


    useEffect(() => {
        document.addEventListener("scroll", scrollHendlers)
        return () => {
            document.removeEventListener("scroll", scrollHendlers)
        }
    },[])

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

    const handleVacancyClick = (vacancy) => {
        setdeteilVacancy(vacancy); // Устанавливаем выбранную вакансию
        localStorage.setItem("selectedVacancy", JSON.stringify(vacancy)); // Сохраняем в LocalStorage
        setPage(1)
        setselectedVacancies([])
        setNexstVakansi(true)
        setLoadingNewJobs(true)
        // console.log(vacancy);
        // setDatas({
        //     id:vacancy.id,
        //     city_id:vacancy.city_id,
        //     area_id:vacancy.area_id,
        //     // company:items.company,
        //     title: vacancy.title,
        // })
        navigate(`/vakatsi/deteil/${vacancy.id}`); // Переходим на страницу деталей
    };
    return (
        <>
            <div className="all-jobs-vakatsi">
                {selectedVacancies?
                    selectedVacancies.map((item, index) => {
                        return (
                            <div className="card_vakansi" key={index} onClick={() => {handleVacancyClick(item)}}>
                                <div className="card-body">
                                    <h4 className="card-title">{item.title}</h4>
                                    <p className="card-text-info">{item.title_info}</p>
                                    {item.schedule.label ?
                                        <span className="card-experience">{item.schedule.label}</span> : null}
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
                                    {item.schedule.label ?
                                        <p>
                                            <i className="fa-regular fa-clock"/>
                                            <span> {item.schedule.label} </span>
                                        </p>
                                        : null}
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
                            </div>
                        )
                    })
                :null}
                {!nexstVakansi ? <h6>Всё</h6> : loadingNewJobs ? <h4>Загруска...</h4> : null}
            </div>

        </>
    )
}
export default SimilarVacancies;