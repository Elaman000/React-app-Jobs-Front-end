import logo from "../Media file/image/Frame 158.png";
import {NavLink, useNavigate} from "react-router-dom";
import { AppContext } from "../AppContext";
import React, {useContext, useState,useEffect} from "react";


const fetchData = async (url, accessToken) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `JWT ${accessToken}`,
            },
        });

        if (response.status === 401) {
            // Токен истек
            throw new Error("TokenExpired");
        }

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const refreshToken = async (refreshUrl) => {
    try {
        let tokenTexst = localStorage.getItem("authToken")
        if (tokenTexst.indexOf('tokens') !== -1) {
            const refreshTokens = JSON.parse(tokenTexst);
            const response = await fetch(refreshUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshTokens.tokens.refresh }),
            });
            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }
            const data = await response.json();
            localStorage.setItem("authToken", JSON.stringify({tokens:data.tokens}));
            return data.tokens.access;
        }else {
            window.location.href = '/user';
        }


    } catch (error) {
        window.location.href = '/login';
        throw error;
    }
};




const HeadPage = () => {
    const {userData,setUserData,vacancies,setVacancies } = useContext(AppContext);
    const navigate = useNavigate();

    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков


    const fetchWithToken = async () => {
        setLoading(true);
        setError(null);

        let tokenText = localStorage.getItem("authToken")
        if (tokenText.indexOf('tokens') !== -1){
            let accessToken = JSON.parse(tokenText);
            const accessUrl = "http://127.0.0.1:8001/api/user/";
            const refreshUrl = "http://127.0.0.1:8001/api/token/refresh/";
            try {
                let data = await fetchData(accessUrl, accessToken.tokens.access);
                setUserData(data); // Успешно получили данные
                localStorage.setItem("userData", JSON.stringify(data));
            } catch (error) {
                if (error) {
                    try {
                        // Обновляем токен
                        const newAccessToken = await refreshToken(refreshUrl);
                        // Повторяем запрос с новым токеном
                        const datas = await fetchData(accessUrl, newAccessToken);
                        localStorage.setItem("userData", JSON.stringify(datas));
                        setUserData(datas); // Успешно получили данные
                        // console.log(datas);
                    } catch (refreshError) {
                        setError(true);
                        console.error("Ошибка обновления токена:", refreshError);
                    }
                } else {
                    setError("Ошибка при получении данных");
                    console.error("Ошибка:", error);
                }
            } finally {
                setLoading(false);
            }
        }else {
            // navigate("/login/");
        }
    };

    useEffect(()=>{
        fetchWithToken()
    },[])



    return (
        <>
            <div className={"heder-block"}>
                <div className={"inline-block"}>
                    <NavLink exact to="/">
                        <div className={"logo-name-company"}>
                            <img src={logo} alt=""/>
                            <span>Работа</span>
                        </div>
                    </NavLink>
                </div>
                <div className={"block-menu-head inline-block"}>
                    <NavLink exact to="/">Главная</NavLink>
                    <NavLink exact to="vakatsi/">Вакансии</NavLink>
                    <NavLink exact to="applicants/">Соискатели</NavLink>
                    <NavLink exact to="">Новости</NavLink>
                </div>
                <div className={"inline-block block-autech-head"}>
                    {/*<a  href="">TEXST2</a><a href="">Выйти</a>*/}
                    {userData ?
                            <NavLink exact to="/user">{userData.last_name?userData.last_name:"Профиль"}
                                {userData.photo ? <img
                                    style={{width: "40px", height: "40px", objectFit: "cover", borderRadius: "2em"}}
                                    src={`http://127.0.0.1:8001${userData.photo}`}/> : null}
                            </NavLink> :
                        <>
                            <NavLink exact activeStyle={{'color': 'red'}} to="/registration">Регистратция</NavLink>
                          <NavLink exact activeStyle={{'color':'red'}} to="/login">Войти</NavLink>
                        </>
                    }
                </div>

            </div>

        </>
    )
}
export default HeadPage