
import user from '../Media file/image/Group 11.png';
import MainpageJobspage from "./MainpageJobspage";
import {AppContext} from "../AppContext";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";


const MainPages = () => {
    const {userData,vacancies,setVacancies, setUserData ,setPage,page} = useContext(AppContext);

    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков

    useEffect(() => {
        if (!vacancies[0]){
            const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
            let token = JSON.parse(accessToken);
            axios.get(`http://127.0.0.1:8002/api/v1/jobs_list/?page=${page}`, {
                        headers: {
                            'Authorization': `JWT ${token.tokens.access}`,
                        }
                })
                .then(response => {
                    setLoading(false);
                    setVacancies(response.data.results);
                    setPage(page+1)
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных:', error);
                    setError(true);
                });
        }
    }, [vacancies]);
    return(
        <>
            <div className={"block-content"}>
                {/*Главай контент*/}
                <div className={"body-main-jobs"}>
                    <div className={"block main-jobs-content-block"}>
                        <h1>Краткосрочные и долгосрочные работы!</h1>
                        <p>Найдите подработку на день или месяц. Удобные варианты для одного или команды.</p>
                        <form method="get" action="">
                            <div className={"input-group mb-3"}>
                                <input type="search" className="form-control" name="search"
                                       placeholder="Что вы ишите?"
                                       aria-label="Recipient's username" aria-describedby="button-addon2"/>
                                <button className={"btn btn-outline-secondary"} type="submit">Найти</button>
                            </div>
                        </form>
                        <p>Выберите рубрику, чтобы найти ваше</p>
                        <div className={"heading"}>
                            <form method="get" action="">
                                <button type="submit" name="search" value="">TEXST3</button>
                            </form>
                        </div>
                    </div>
                    <div className={"block main-jobs-img-block"}>
                        <img src={user} alt="dwddw"/>
                    </div>
                </div>
                <br/>
                <br/>
                <br/>

                <MainpageJobspage data={vacancies}/>

                <br/>
                <br/>
                <br/>


            </div>
        </>
    )
}


export default MainPages