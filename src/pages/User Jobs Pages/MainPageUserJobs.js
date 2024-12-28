import "../../CSS/UserProfil.css"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../AppContext";
import { Helmet } from 'react-helmet';


const MainPageUserJobs = ({data}) =>{
    const navigate = useNavigate();

    const [dataJobs, setDataJobs] = useState([]);
    const {employersVacancies, setEmployersVacancies } = useContext(AppContext);

    useEffect(()=>{
        if(true){
            let tokenText = localStorage.getItem("authToken")
            let token = JSON.parse(tokenText);
            axios.get(`http://localhost:8002/api/v1/vacancy_analyst/`, {
                headers: {
                    'Authorization': `JWT ${token.tokens.access}`,
                },
                // params: data
            })
                .then(response => {
                    // setLoading(false);
                    // setLoadingNewJobs(false)
                    // console.log(response.data);
                    setEmployersVacancies(response.data.vacancy)
                    // if (!response.data.next) {
                    //     setNexstVakansi(false)
                    // }else {
                    //     setPage(page + 1)
                    // }
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных:', error);
                    // setError(true);
                });
        }
    },[])

    const editJobs = (jobs) => {
      // console.log(jobs);
        navigate(`/edit_vakatsi/${jobs}`)
    }
    const moreJobs = (jobs) => {
        // console.log(jobs);
        navigate(`/employers_office/`)
    }
    console.log(employersVacancies)

    return (
        <>
            <Helmet>
                <title>Аналалитика</title>
            </Helmet>
            <br/>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <span>Вакансии</span>
                <button style={{marginRight:"15px",padding:"0,5px"}} className="btn btn-outline-secondary">Добавить вакансию</button>
            </div>
            <table className="table table-hover table-userJobs">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Название</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Дата создания</th>
                    <th scope="col">Просмотры</th>
                    <th scope="col">НЧ</th>
                    <th scope="col">Отклики</th>
                    <th scope="col">Принятые</th>
                    <th scope="col">На расмотрени</th>
                    <th scope="col">Действия</th>
                </tr>
                </thead>
                <tbody>
                {employersVacancies && employersVacancies.map((job, i) => {
                    return (
                            <tr key={i+1} onClick={()=>{
                                moreJobs(job.id)
                            }}>
                                <th scope="row">{i + 1}</th>
                                <td className={"name"}>{job.title}</td>
                                <td>
                                    {/*<input type="button" value={"dawdaawd"}/> */}
                                    {job.active ? "Активна" : "Не активна"}
                                </td>
                                <td>
                                    {new Date(job.time_create).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td>{job.enlarge_view}</td>
                                <td>{job.number_persons}</td>
                                <td>
                                    {(job.responses.accepted&&job.responses.accepted ? job.responses.accepted : 0) + (job.responses.pending&&job.responses.pending ? job.responses.pending : 0)+(job.responses.rejected&&job.responses.rejected ? job.responses.rejected : 0)}
                                </td>

                                <td>{job.responses.accepted&&job.responses.accepted ? job.responses.accepted : 0}</td>
                                <td>{job.responses.pending&&job.responses.pending?job.responses.pending:0}</td>

                                <td>
                                    <button onClick={(e) => {
                                        e.stopPropagation(); // Останавливаем всплытие события
                                        editJobs(job.id);
                                    }}>Редактировать
                                    </button>
                                </td>
                            </tr>
                    )
                })}

                </tbody>
            </table>
            <br/>
            <br/>
        </>
    )
}


export default MainPageUserJobs;