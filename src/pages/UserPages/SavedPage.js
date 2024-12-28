import React, {useState,useContext} from "react";
import {AppContext} from "../../AppContext";
import {useNavigate} from "react-router-dom";
import { Helmet } from 'react-helmet';


const SavedPage = () => {
    const {setdeteilVacancy} = useContext(AppContext);
    const navigate = useNavigate();


    const [saveDataJobs, setSaveDataJobs] = useState(() => {
        // Получаем данные из localStorage при первой загрузке
        const dataSave = localStorage.getItem('Save_Jobe');
        return dataSave ? JSON.parse(dataSave) : [];
    });

    const handleVacancyClick = (vacancy) => {
        setdeteilVacancy(vacancy); // Устанавливаем выбранную вакансию
        localStorage.setItem("selectedVacancy", JSON.stringify(vacancy)); // Сохраняем в LocalStorage
        navigate(`/vakatsi/deteil/${vacancy.id}`); // Переходим на страницу деталей
    };


    const saveonClick = (data) => {
        if (window.confirm("Удалить элемент?")){
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
        }
    };



    return (
        <>
            <Helmet>
                <title>Сохраненные</title>
            </Helmet>
            <h3>Сохраненные</h3>
            <br/>

            {saveDataJobs.map((item, index) => {
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



        </>


    )
}


export default SavedPage