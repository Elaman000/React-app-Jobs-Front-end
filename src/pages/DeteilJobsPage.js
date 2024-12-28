import {useContext, useEffect, useState} from "react";
import {AppContext} from "../AppContext";
import {useNavigate,useParams} from "react-router-dom";
import SimilarVacancies from "./SimilarМacanciesPage";
import axios from "axios";


const DeteilJobsPage = () => {
    const { id_jobs } = useParams(); // Получение id из URL

    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков
    const navigate = useNavigate();
    const {deteilVacancy,setdeteilVacancy, jobApplication, setJobApplication ,userData} = useContext(AppContext);
    const Token = localStorage.getItem('authToken'); // Или другой способ хранения токена

    const request_application = async (job) => {
        let token = JSON.parse(Token);
        const response = await fetch("http://localhost:8001/api/v1/job_application_create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${token.tokens.access}`,
            },
            body: JSON.stringify({
                vacancy_id:job.id,
                status:"pending",
                description:userData.description,
                title:job.title,
                title_info:job.title_info
            }),
        });
        if (!response.ok) {
            console.log("Failed to refresh token")
        }
        const data = await response.json();
        setJobApplication([...jobApplication, data]);
        localStorage.setItem('JobApplicationList', JSON.stringify([...jobApplication, data]));

    }

    useEffect(() => {
        // if (!deteilVacancy) {
        //     const savedVacancy = localStorage.getItem("selectedVacancy");
        //     if (savedVacancy) {
        //         setdeteilVacancy(JSON.parse(savedVacancy));
        //     }
        // }
        axios.get(`http://127.0.0.1:8002/api/v1/jobs_list/${id_jobs}/`, {
            // headers: {
            //     'Authorization': `JWT ${Token.tokens.access}`,
            // },
        })
            .then(response => {
                setLoading(false);
                setdeteilVacancy(response.data);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
                setError(true);
            });
    }, [id_jobs]);

    const previous = (id)=>{
        navigate('/vakatsi')
    }
    const items = !deteilVacancy? JSON.parse(localStorage.getItem("selectedVacancy")):deteilVacancy;
    // const dataItems = {
    //     id:items.id,
    //     city_id:items.city_id,
    //     area_id:items.area,
    //     // company:items.company,
    //     title: items.title,
    // }
    if (loading){
        return (<h3>Загруска страницы</h3>)
    }
    if (error){
        return (<h3>Ошыпка на  странице</h3>)
    }
    return (
        <>
        <div className="block_post">
                <div className="block-vakanci_post">
                    <div className="block-vakanci">
                        <h3 className="card-title">{items.title}</h3>
                        <h4 className="card-text" style={{fontWeight: "700", color: " #16a060"}}>От 35000,00 сом</h4>
                        <p style={{color: "#149458"}}>{items.title_info}</p>
                        <hr/>
                        <p className="card-text">{items.content}</p>
                        <hr/>
                        <span className="card-text"><strong>График работы: </strong>{items.schedule.label}</span><br/>
                        <span className="card-text"><strong>Опыт работы: </strong>{items.experience.label}</span><br/>
                        <span className="card-text"><strong>Рабочих мест: </strong>{items.number_persons}</span>
                        <p className="card-text"><strong>Регион: </strong>{items.city_name} обл, {items.area_name} район
                        </p>
                        <span className="card-text"><strong>Посмотрели: </strong>{items.enlarge_view}👁</span><br/>

                        <span style={{color: " #00000077", fontWeight: "600"}}>Вакансия опубликована: 18 Окт 2024</span>
                        <button style={{float: "right"}} onClick={previous} className="btn btn-primary">Назад</button>
                        {
                            // eslint-disable-next-line array-callback-return
                            jobApplication && jobApplication.map((item,i) => {
                                if (item.vacancy_id === items.id) {
                                    if (item.status === 'pending') {
                                        return (
                                            <button key={i} style={{ float: "right", marginRight: "5px" }} className="btn btn-primary" id="apply-button" data-applied="false" disabled={true} data-job-id="14">
                                                На рассмотрении
                                            </button>
                                        );
                                    } else if (item.status === 'accepted') {
                                        return (
                                            <button key={i} style={{ float: "right", marginRight: "5px" }} className="btn btn-primary" id="apply-button" disabled={true} data-applied="false" data-job-id="14">
                                                Вы уже приняты
                                            </button>
                                        );
                                    }else if (item.status === 'rejected') {
                                        return (
                                            <button key={i} style={{float: "right", marginRight: "5px"}} disabled={true} className="btn btn-primary"
                                                    id="apply-button" data-applied="false" data-job-id={items.id}>
                                                Запрос откланен
                                            </button>
                                        )
                                    }
                                }
                            })
                        }
                        {
                            !jobApplication.some(item => item.vacancy_id === items.id) && (
                                <button onClick={() => { request_application(items) }} style={{ float: "right", marginRight: "5px" }} className="btn btn-primary" id="apply-button" data-applied="false" data-job-id={items.id}>
                                    Откликнуться
                                </button>
                            )
                        }


                    </div>
                    {items.company ?
                        <div className="block-user-vakanci" style={{width: "18rem"}}>

                        <h5 className="card-title">{items.company.name}</h5>
                            <p className="card-text">Торговля</p>
                            <p className="card-text">Американская суббренд компания</p>
                            <p className="card-text">{items.company.address}</p>
                            <span><i className="fa-brands fa-telegram"></i> 1206557406</span><br/>
                            <span><i
                                className="fa-brands fa-whatsapp"></i> https://wa.me/+996501212125</span><br/>
                            <span><i className="fa-solid fa-phone"></i> {items.company.phone}</span><br/>
                            <span><i className="fa-solid fa-globe"></i> google.com</span><br/>
                            <a href="/company/1/">
                                <button style={{marginTop: "15px"}} className="btn btn-primary">Подробне</button>
                            </a>
                        </div>:null
                    }
                </div>
                <br/>
                <hr/>
                <br/>
                <h4>Похожые вакасии</h4>
                    <SimilarVacancies />
                <br/>

            </div>
        </>
    )
}
export default DeteilJobsPage;