import {BrowserRouter, Routes, Route, NavLink, useNavigate} from "react-router-dom";
import MainPages from "./pages/MainPages";
import logo from "./Media file/image/Frame 158.png";
// import logoUser from './Media file/image/user.png';
import RegistrationPages from "./pages/RegistrationPages";
import LoginPage from "./pages/LoginPages";
import UserProfil from "./pages/UserProfil";
import VakansiPages from "./pages/VakansiPages";
import React, {useEffect, useState} from "react";
import axios from "axios";


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



function App() {
    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков
    const [errorjobs, setErrorJobs] = useState(false); // Обработка ошыбок
    const [loadingjobs, setLoadinJobs] = useState(true); // Обработка Загрусков
    const [userData, setUserData] = useState([]); // Переменная для данных
    const [jobsData, setJobsData] = useState([]); // Переменная для данных

    const [choicesJobs, setChoicesJobs] = useState([]);


    const fetchJobsToken = async () => {
        let tokenText = localStorage.getItem("authToken")
        let Token = JSON.parse(tokenText);
        axios.get('http://127.0.0.1:8002/api/v1/choices/jobs/')
            .then((response) => {
                setChoicesJobs(response.data)
            }).catch((error) => {
                console.log(error);
            });

        axios.get('http://127.0.0.1:8002/api/v1/jobs_list/', {
            // headers: {
            //     'Authorization': `JWT ${Token.tokens.access}`,
            // }
        })
            .then(response => {
                setLoadinJobs(false);
                setJobsData(response.data);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
                errorjobs(true);
            });
    };

    useEffect(() => {
        fetchJobsToken()
    }, []);
console.log(choicesJobs)
    console.log(jobsData)
    if (error) return <p>{error}</p>;
  return (
      <BrowserRouter>
          <div id="jobs-list">
              {/*Шапка сайта*/}
              <div className={"heder-block"}>
                  <div className={"inline-block"}>
                      <a href="/">
                          <div className={"logo-name-company"}>
                              <img src={logo} alt=""/>
                              <span>Работа</span>
                          </div>
                      </a>
                  </div>
                  <div className={"block-menu-head inline-block"}>
                      <a href={"/"} style={{textDecoration: "underline"}}
                      >Главная</a>
                      <a hidden={''}
                         href="/vakatsi">Вакансии</a>
                      <a hidden={''}

                         href="">Соискатели</a>
                      <a hidden={''}
                         href="">Новости</a>
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
              <Routes>
                  {/*Главная страница*/}
                  <Route exact path="/" element={
                      <MainPages dataJobs={jobsData}/>
                  }/>
                    {/*Страница вакансиий*/}
                  <Route exact path="/vakatsi/" element={
                      <VakansiPages dataJobs={jobsData} choices={choicesJobs}/>
                  }/>

                  {/*Cтраница входа в учотный запись*/}
                  <Route exact path="/login" element={
                      <LoginPage/>
                  }/>
                  {/*Cтраница регистратцы учотный записи*/}
                  <Route exact path="/registration" element={
                      <RegistrationPages/>
                  }/>
                  {/*Профиль пользователя*/}
                  <Route exact path="/user/" element={
                      <UserProfil data={userData} />
                  }/>
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;
