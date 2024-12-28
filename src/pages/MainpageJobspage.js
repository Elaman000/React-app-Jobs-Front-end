import React, {useContext, useState} from "react";
import {AppContext} from "../AppContext";
import {useNavigate} from "react-router-dom";


const MainpageJobspage = ({data, choicjobs})=>{
    const [saveDataJobs, setSaveDataJobs] = useState(() => {
        // Получаем данные из localStorage при первой загрузке
        const dataSave = localStorage.getItem('Save_Jobe');
        return dataSave ? JSON.parse(dataSave) : [];
    });


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



    const {setdeteilVacancy } = useContext(AppContext);
    const navigate = useNavigate();

    const handleVacancyClick = (vacancy) => {
        setdeteilVacancy(vacancy); // Устанавливаем выбранную вакансию
        localStorage.setItem("selectedVacancy", JSON.stringify(vacancy)); // Сохраняем в LocalStorage
        navigate(`/vakatsi/deteil/${vacancy.id}`); // Переходим на страницу деталей
    };
    return (
        <>

            <h4>Актуальные вакасии</h4>
            <div className="block-main-applicants">
                {data.map((item,index)=>{
                    if (index <= 4){
                        return (
                            <div className="main-card_vakansi" key={index}>
                                <div className="main-card-body">
                                    <h5 className="main-card-title">{item.title}</h5>
                                    <span className="main-card-experience">{item.title_info}</span>

                                    <p className="main-card-text-info">{item.content}</p>
                                    <span className="main-card-wage">{item.wage}сом</span><br/>
                                    <span>
                                    <i className="icon-card-jobs fa-solid fa-circle-user"></i>
                                    <span className="card-text">elaman</span>
                            </span>
                                    <div className="card-jobs-data_add">
                                        {new Date(item.time_create).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <p>
                                        <i className="fa-regular fa-map"></i>
                                        <span className="main-card-text">{item.city_name}, {item.area_name}</span>
                                    </p>
                                    <button onClick={()=>{ handleVacancyClick(item)}}>Посмотреть</button>
                                    <div className="card-jobs-botton-save" onClick={(e) => {
                                        e.stopPropagation(); // Останавливаем всплытие события
                                        saveonClick(item); // Выполняем только сохранение
                                    }}>
                                        {
                                            saveDataJobs.some(items => items.id === item.id) ? (
                                                <i className="fa-solid fa-bookmark fa-lg"
                                                   style={{color: "#5a5a5a"}}></i>
                                            ) : (
                                                <i className="fa-regular fa-bookmark fa-lg"
                                                   style={{color: "#5a5a5a"}}></i>
                                            )
                                        }


                                    </div>
                                </div>
                            </div>
                        )
                    } else return null
                })}

                <div className="block-all-button main-card_vakansi">
                    <span>Смотреть все вакасии</span>
                </div>
            </div>
            <br/>

            <h4>Актуальные соискатели</h4>
            <div className="block-main-applicants">
                <div className="main-card_vakansi">
                    <div className="logo-name-activity">
                        <img className="" src="/media/company_logos/11341.jpg" alt="elaman logo"/>
                        <div>
                            <h6>Эламан Кылычбек уулу</h6>
                            <span style={{color: "orange"}}>Услуги на дому</span>
                        </div>
                    </div>
                    <div className="block-content-users-card">
                        <h5>IT</h5>
                        <p>Рабртает: Одиночку</p>
                        Требоваемая <span className="main-card-wage">52000,00сом</span><br/>

                        <a href="/profile/1/">
                            <button>Посмотреть</button>
                        </a>
                        <div className="card-jobs-data_add">02 Дек 2024</div>
                        <div className="card-jobs-botton-save">
                            <i className="fa-regular fa-bookmark"></i>
                        </div>
                    </div>
                </div>
                <a href="/applicant/">
                    <div className="block-all-button main-card_vakansi">
                        <span>Посмотреть всех соискателей</span>
                    </div>
                </a>
            </div>
        </>
    )
}
export  default MainpageJobspage;