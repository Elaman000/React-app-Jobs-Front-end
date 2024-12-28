import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import { AppProvider } from "./AppContext"; // Импорт провайдера
import MainPages from "./pages/MainPages";
import logo from "./Media file/image/Frame 158.png";
import RegistrationPages from "./pages/RegistrationPages";
import LoginPage from "./pages/LoginPages";
import UserProfil from "./pages/UserProfil";
import VakansiPages from "./pages/VakansiPages";
import React, {useEffect, useState} from "react";
import axios from "axios";
import HeadPage from "./pages/HeadPage";
import DeteilJobsPage from "./pages/DeteilJobsPage";
import ApplicantsPages from "./pages/ApplicantsPages";
import CreateVacancy from "./pages/UserPages/CreateVacancy";
import EditJobsUser from "./pages/UserPages/EditJobsUser";
import PanelJobs from  './pages/Employers Office/PanelJobs'

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


    // const fetchJobsToken = async () => {
    //     let tokenText = localStorage.getItem("authToken")
    //     let Token = JSON.parse(tokenText);
    //     axios.get('http://127.0.0.1:8002/api/v1/choices/jobs/')
    //         .then((response) => {
    //             setChoicesJobs(response.data)
    //         }).catch((error) => {
    //             console.log(error);
    //         });
    //
    //     axios.get('http://127.0.0.1:8002/api/v1/jobs_list/', {
    //         // headers: {
    //         //     'Authorization': `JWT ${Token.tokens.access}`,
    //         // }
    //     })
    //         .then(response => {
    //             setLoadinJobs(false);
    //             setJobsData(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Ошибка при загрузке данных:', error);
    //             errorjobs(true);
    //         });
    // };

    useEffect(() => {
        // fetchJobsToken()
    }, []);


    if (error) return <p>{error}</p>;
  return (
      <AppProvider>
          <BrowserRouter>
              <div id="jobs-list">
                  {/*Шапка сайта*/}
                  <HeadPage/>

                  <Routes>
                      {/* Страница 404 для всех несуществующих маршрутов */}
                      <Route path="*" element={<div className={"block-content"}>
                          <br/><br/><br/><br/>
                          <center>
                              <h2><code style={{fontSize:"1.5em"}}>404 </code>страница не найдена!</h2>

                          </center>
                      </div>}/>

                      {/*Главная страница*/}
                      <Route exact path="/" element={
                          <MainPages />
                      }/>

                        {/*Страница вакансиий*/}
                      <Route exact path="vakatsi/" element={
                          <VakansiPages />
                      }/>

                      {/*Страница соискателей*/}
                      <Route exact path="applicants/" element={
                          <ApplicantsPages />
                      }/>

                      {/*Детальная страница вакансии*/}
                      <Route exact path="/vakatsi/deteil/:id_jobs" element={
                          <DeteilJobsPage/>} />

                      {/*Детальная страница для изминени вакансии */}
                      <Route exact path="edit_vakatsi/:id_jobs" element={
                          <EditJobsUser/>
                      }/>

                      {/* Cтраница добалении ваканси */}
                      <Route exact path="create_vacancy/" element={
                          <CreateVacancy/>
                      }/>



                      {/* Cтраница работадателя */}
                      <Route exact path="employers_office/" element={
                          <PanelJobs/>
                      }/>




                      {/*Cтраница входа в учотный запись*/}
                      <Route exact path="login/" element={
                          <LoginPage/>
                      }/>

                      {/*Cтраница регистратцы учотный записи*/}
                      <Route exact path="registration/" element={
                          <RegistrationPages/>
                      }/>




                      {/*Профиль пользователя*/}
                      <Route exact path="user/" element={
                          <UserProfil />
                      }/>
                  </Routes>
              </div>
          </BrowserRouter>
      </AppProvider>

  );
}

export default App;
