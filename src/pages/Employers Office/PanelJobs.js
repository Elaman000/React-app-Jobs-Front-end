import '../../CSS/EmployersOffice.css'
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../AppContext";
import axios from "axios";
import logo from '../../Media file/image/logo.jpg';


const PanelJobs = () =>{
    const {employersVacancies,setEmployersVacancies} = useContext(AppContext);

    const [errorApplicant, setErrorApplicant] = useState(false); // Обработка ошыбок
    const [loadingApplicant, setLoadingApplicant] = useState(false); // Обработка Загрусков

    const [lablejobsID, setLablejobsID] = useState(employersVacancies[0]?employersVacancies[0].id:null);
    const [profilApplicant, setProfilApplicant] = useState([]);
    const [lableApplicant, setLableApplicant] = useState(null);
    const [userData, setUserData] = useState({});

    const [loadingUserData, setLoadingUserData] = useState(false);


    // Функция, которая будет запускаться при изменении lableApplicant
    const handleLableApplicantChange = () => {
        const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
        let access = JSON.parse(accessToken);
        axios.get('http://localhost:8002/api/v1/vacancy_analyst/title/', {
            headers: {
                'Authorization': `JWT ${access.tokens.access}`,
            }
        })
            .then(response => {
                setEmployersVacancies(response.data.vacancy);
                // console.log(response.data);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
                // setErrors(true);
            });
    };
    // Функция, которая будет запускаться при изменении lableApplicant
    const handProfilApplicant = () => {
        setProfilApplicant([]); // Устанавливаем пустой массив, чтобы отобразить, что данных нет
        setLoadingApplicant(true)
        const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
        let access = JSON.parse(accessToken);
        axios.get(`http://localhost:8001/api/v1/job-applications/${lablejobsID}/`, {
            headers: {
                'Authorization': `JWT ${access.tokens.access}`,
            }
        })
            .then(response => {
                if (response.data.message==='Нет записей') {
                    setErrorApplicant(true)
                } else {
                    // Если данные есть, сохраняем их в состояние
                    setProfilApplicant(response.data.applications);
                }
                setLoadingApplicant(false);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
                setErrorApplicant(true)
                setLoadingApplicant(false);
            });
    };

    const handUser = () => {
        setLoadingUserData(true)
        const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
        let access = JSON.parse(accessToken);
        axios.get(`http://localhost:8001/api/v1/application/user/${lableApplicant}/`, {
            headers: {
                'Authorization': `JWT ${access.tokens.access}`,
            }
        })
            .then(response => {
                // console.log(response.data);
                setUserData(response.data)
                setLoadingUserData(false)
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
                // setErrors(true);
                setLoadingUserData(false)
            });
    }



    const UpdateJobApplicationStatus = async (
        vakancy_id,
        user_id,
        status,
    ) => {
        try {
console.log(vakancy_id,
    user_id,
    status,)
            let tokenTexst = localStorage.getItem("authToken")
            const token = JSON.parse(tokenTexst);
            const response = await fetch("http://127.0.0.1:8001/api/v1/update-applications-status/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `JWT ${token.tokens.access}`,
                },
                body: JSON.stringify({
                    vacancy_id: vakancy_id,
                    user_id: user_id,
                    status: status
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }
            const data = await response.json();
            const datas = profilApplicant.filter(obj => obj.user_id !== data.updated_application.user_id);
            setProfilApplicant([...datas, data.updated_application])
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (!lablejobsID){
            handleLableApplicantChange();
        }
    }, []);

    useEffect(() => {
        if (lablejobsID != null){
            handProfilApplicant();
        }
    }, [lablejobsID]);

    useEffect(() => {
        if (lableApplicant != null){
            handUser()
        }
    }, [lableApplicant]);



    console.log(profilApplicant);
    return (
        <>
            <div className={"block-content"}>
                <div className={"container-panel-jobs"}>
                    <div className={"employers-jud-block"}>
                        {/*<div className={"before-onclik"}></div>*/}
                        {employersVacancies && employersVacancies.map((item, i) => {
                            return (
                                <div key={i} className={lablejobsID===item.id?"before-onclik":"panel-jobs-hover"} onClick={() => {
                                    setLablejobsID(item.id);
                                    setLableApplicant(null);
                                    setUserData({})
                                }}>
                                    {item.title}
                                </div>
                            )
                        })}
                    </div>
                    <div className={"content-employers-jud"}>
                        <div className={"block-applicants"}>
                            <div className={"applican"}>
                                <br/>
                                <button>Поиск</button>
                            </div>
                            {lablejobsID !== null ?
                                Object.keys(profilApplicant).length === 0 ?
                                    <div className={"applican"}>
                                        <b>Нет заявок!</b>
                                    </div> : null
                                : <div className={"applican"}>
                                    <b>Выберите Вакансию</b>
                                </div>
                            }
                            {loadingApplicant?<b>Загруска...</b>: null}
                            {profilApplicant && profilApplicant.map((item, i) => {
                                return (
                                    <div key={i} className={item.user_id === lableApplicant ? "activ-applican applican":"applican"} onClick={()=>{
                                        setLableApplicant(item.user_id)
                                    }}>
                                        <b>{item.first_name} </b>
                                        <code>
                                            status:{item.status === "pending" ? "На расмотрении" : item.status === "accepted" ? "Принят" : "Отклонен"}
                                        </code>
                                        <br/>

                                        <span>{item.description?item.description:<>Компетенция не указан</>}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={"profil-applicants"}>
                            {!loadingUserData?
                                Object.keys(userData).length !== 0?
                                    <>
                                        <button onClick={()=>UpdateJobApplicationStatus(lablejobsID,lableApplicant,'accepted')}>Принять</button>
                                        <button onClick={()=>UpdateJobApplicationStatus(lablejobsID,lableApplicant,'rejected')}>Откланить</button>

                                        <div className="block-resume">
                                            <div className="logo">
                                                {!userData.photo ? <img src={logo} alt="WS Logo"/> :
                                                    <img src={`http://127.0.0.1:8001${userData.photo}`}
                                                         alt={`Image ${userData.last_name}`}/>}
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
                                                    {userData.education.label ? <>
                                                        <li>Образование: <b>{userData.education.label}</b></li>
                                                    </> : null}
                                                    {userData.experience.label ? <>
                                                        <li>Опыт работы: <b>{userData.experience.label}</b></li>
                                                    </> : null}
                                                    {userData.relocation.label ? <>
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
                                    </> :
                                    <center>
                                    <br/>
                                        <h4>
                                            Выберите кондидата
                                        </h4>
                                    </center>:<h3>Загруска...</h3>
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default PanelJobs