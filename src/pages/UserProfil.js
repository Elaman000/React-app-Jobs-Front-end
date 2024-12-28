import logo from '../Media file/image/logo.jpg';
import './index.css'
import '../CSS/UserProfil.css'
import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../AppContext";
import UserInfo from "./UpdataUserPages/UserInfo";
import ChangeEmail from "./UpdataUserPages/ChangeEmail";
import ChangePassword from "./UpdataUserPages/ChangePassword";
import QuitPages from "./UpdataUserPages/QuitPage";
import SavedPage from "./UserPages/SavedPage";
import MainPageUserJobs from "./User Jobs Pages/MainPageUserJobs";
import { Helmet } from 'react-helmet';

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

const UserProfil = ({data}) => {

    const {userData, setUserData } = useContext(AppContext);

    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков
    const navigate = useNavigate();

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
            } catch (error) {
                if (error.message === "TokenExpired") {
                    try {
                        // Обновляем токен
                        const newAccessToken = await refreshToken(refreshUrl);
                        // Повторяем запрос с новым токеном
                        const datas = await fetchData(accessUrl, newAccessToken);
                        setUserData(datas); // Успешно получили данные
                        // localStorage.setItem('userData', JSON.stringify(datas));
                        navigate("/user/");
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

    const UserPage = () =>{
        return(
            <>
                <div className="block-resume">
                    <Helmet>
                        <title>Профиль пользователя {userData.first_name?userData.first_name:null}</title>
                    </Helmet>
                    <div className="logo">
                        {!userData.photo ? <img src={logo} alt="WS Logo"/> :
                            <img src={`http://127.0.0.1:8001${userData.photo}`} alt={`Image ${userData.last_name}`}/>}
                        <br/>
                    </div>
                    <div className="info-user-resume">
                        <h3>{userData.last_name} {userData.first_name}</h3>
                        {userData.gender ? <>Пол: <b>{userData.gender.label}</b></> : null}
                        <p>Дата рождения: <b>{userData.birth_date}</b></p>
                        {userData.city ? <p>Город: <b>{userData.city.city}
                            {userData.area && `, ${userData.area.area}`}
                        </b></p> : null}
                        <hr/>
                        <b>{userData.description}</b>
                        <p>{userData.text}</p>

                        <ul style={{paddingLeft: '0', listStyleType: 'none'}}>
                            {userData.education.label? <>
                                <li>Образование: <b>{userData.education.label}</b></li>
                            </>:null}
                            {userData.experience.label? <>
                                <li>Опыт работы: <b>{userData.experience.label}</b></li>
                            </> : null}
                            {userData.relocation.label? <>
                                <li>Переезд: <b>{userData.relocation.label}</b></li>
                            </> : null}
                            {userData.desired_salary ? (
                                <li>Желаемая плата: <b>{userData.desired_salary}</b> сом</li>
                            ) : null}
                        </ul>

                        <hr/>
                        Контакты
                        <ul style={{paddingLeft: '0', listStyleType: 'none'}}>
                            <li><b>Telegram:</b> <a href={''}> {userData.telegram}</a></li>
                            <li><b>Whatsapp: </b> <a href={''}> {userData.whatsapp}</a></li>
                            <li><b>URL Сайта: </b> <a href={''}> {userData.web_url}</a></li>
                        </ul>
                    </div>
                </div>

            </>
        )

    }



    const [activeSection, setActiveSection] = useState(
        userData.role ? "profil":"user-vakansi"
    );// Дефолтный раздел — изменение информации пользователя

    useEffect(() => {
        if (userData.role !== undefined) {
            setActiveSection(userData.role ? "profil" : "user-vakansi");
        }
    }, [userData]);



    const renderSection = () => {
        switch (activeSection) {
            case "profil":
                return <UserPage/>;
            case "editInfo":
                return <UserInfo data={userData} renderSectionUpdate={() => setActiveSection("profil")}  newData={(datas) => setUserData(datas)}/>;
            case "changeEmail":
                return <ChangeEmail data={userData.email}  />;
            case "changePassword":
                return <ChangePassword data={userData.email} />;
            case "quit":
                return <QuitPages data={userData} renderSectionUpdate={() => setActiveSection("profil")} newdata={(datas) => setUserData(datas)}/>;
            case "saved":
                return <SavedPage/>;
            case "user-vakansi":
                if (!userData || Object.keys(userData).length === 0) {
                    return null; // Альтернативный контент
                }else {
                    if (!userData.role){
                        return <MainPageUserJobs data={userData} />
                    }
                    return null;
                }
            default:
                return <UserPage />;
        }
    };

    useEffect(() => {
        if (!userData){
            fetchWithToken()
        }
    }, [userData]);
    return (
        <>

            <div className={"block-content"}>
                    <>
                        <div className={"block-updata-user"}>
                            <div className="menu_user-profil">
                                {/*<span>*/}
                                {/*    Управление акаунтом*/}
                                {/*</span>*/}
                                <ul>
                                    {!userData.role? <>
                                        <div className={activeSection === "user-vakansi" ? "onclok-menu" : ''}
                                             onClick={() => setActiveSection("user-vakansi")}>
                                            <li>Мои вакансии</li>
                                        </div>
                                        <hr/>
                                    </> : null}
                                    <div className={activeSection === "profil" ? "onclok-menu" : ''}
                                         onClick={() => setActiveSection("profil")}>
                                        <li>Профиль</li>
                                    </div>
                                    <div className={activeSection === "editInfo" ? "onclok-menu" : ''}
                                         onClick={() => setActiveSection("editInfo")}>
                                        <li>Редактировать профиль</li>
                                    </div>
                                    <div className={activeSection === "changeEmail" ? "onclok-menu" : ''}
                                         onClick={() => setActiveSection("changeEmail")}>
                                        <li>Изменить @Email</li>
                                    </div>
                                    <div className={activeSection === "changePassword" ? "onclok-menu" : ''}
                                         onClick={() => setActiveSection("changePassword")}>
                                        <li>Изменить пароль</li>
                                    </div>
                                    <div className={activeSection === "quit" ? "onclok-menu" : ''}
                                         onClick={() => setActiveSection("quit")}>
                                        <li>Выйти</li>
                                    </div>
                                    <hr/>

                                    <div className={activeSection === "saved" ? "onclok-menu" : ''}
                                         onClick={() => setActiveSection("saved")}>
                                        <li>Сохраненные</li>
                                    </div>
                                </ul>
                            </div>

                            <div className="content-updata-user">
                                {renderSection()}
                            </div>
                        </div>
                    </>
            </div>
        </>
    )
}
export default UserProfil;


