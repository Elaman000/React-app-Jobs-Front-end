import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";


const EditJobsUser = () => {
    const [dataJobs, setDataJobs] = useState({});
    const navigate = useNavigate();

    // Состояние для данных
    const [formData, setFormData] = useState({
        title: "",
        title_info: "",
        content: "",
        responsibilities: "",
        requirements: "",
        terms: "",
        additional_information: "",
        city_name: "",
        city_id: null,
        area_name: "",
        area_id: null,
        wage: "",
        experience: "",
        schedule: "",
        number_persons: "",
        active: true,
        enlarge_view: 0,
    });
    const [updatedFields, setUpdatedFields] = useState({}); // Только изменённые данные присваиваются здес и отправляются на сервер
    const [choicesJobs, setChoicesJobs] = useState({}); // choices Jobs

    const { id_jobs } = useParams(); // Получение id из URL
    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков


    const changeUser = () => {
        const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
        let access = JSON.parse(accessToken);
        axios.get('http://localhost:8002/api/v1/choices/jobs/', {
            headers: {
                'Authorization': `JWT ${access.tokens.access}`,
            }
        })
            .then(response => {
                localStorage.setItem("choicesJobsInfo", JSON.stringify(response.data));
                setChoicesJobs(response.data);
            })
            .catch(error => {
                console.log('Ошибка при загрузке данных:', error);
            });
    }

    useEffect(()=>{

        const choicesUserInfo = localStorage.getItem('choicesJobsInfo'); // Или другой способ хранения токена
        if (!choicesUserInfo){
            changeUser()
        }else {
            setChoicesJobs(JSON.parse(choicesUserInfo))
        }
        let tokenText = localStorage.getItem("authToken")
        let token = JSON.parse(tokenText);

        axios.get(`http://127.0.0.1:8002/api/v1/jobs_list/${id_jobs}/`, {
            headers: {
                'Authorization': `JWT ${token.tokens.access}`,
            },
            // params: data
        })
            .then(response => {
                // setLoading(false);
                // setLoadingNewJobs(false)
                setFormData(response.data)
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
    },[])

    // useEffect(() => {
    //     if (initialData) {
    //         setFormData(initialData);
    //     }
    // }, [initialData]);

    // Обработчик изменений в форме
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setUpdatedFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const delitVakansi = () =>{
        const result = window.confirm("Вы уверены?")
        if(result){
            const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
            let token = JSON.parse(accessToken);
            axios
                .put(
                    `http://127.0.0.1:8002/api/v1/deactivate_jobs/${id_jobs}/`,
                    {published: false},
                    {
                        headers: {
                            Authorization: `JWT ${token.tokens.access}`, // Передаем JWT токен
                        },
                    }
                )
                .then((response) => {
                    console.log("Данные успешно обновлены:", response.data);
                    navigate("/user/")
                    // Опционально: редирект или уведомление
                })
                .catch((error) => {
                    console.error("Ошибка при обновлении данных:", error.message);
                });
        }
    }

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
        let token = JSON.parse(accessToken);
        axios
            .put(
                `http://127.0.0.1:8002/api/v1/jobs_update/${id_jobs}/`,
                updatedFields,
                {
                    headers: {
                        Authorization: `JWT ${token.tokens.access}`, // Передаем JWT токен
                    },
                }
            )
            .then((response) => {
                // console.log("Данные успешно обновлены:", response.data);
                navigate("/user/")
                // Опционально: редирект или уведомление
            })
            .catch((error) => {
                console.error("Ошибка при обновлении данных:", error.message);
            });
    };

    return (
        <>
            <div className={"block-content"}>
                <h1>{id_jobs}</h1>
                <>
                    <div>
                        <label>Заголовок:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Подзаголовок:</label>
                        <input
                            type="text"
                            name="title_info"
                            value={formData.title_info}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Описание:</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Обязанности:</label>
                        <textarea
                            name="responsibilities"
                            value={formData.responsibilities}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Требования:</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Условия:</label>
                        <textarea
                            name="terms"
                            value={formData.terms}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Город:</label>
                        <input
                            type="text"
                            name="city_name"
                            value={formData.city_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Район:</label>
                        <input
                            type="text"
                            name="area_name"
                            value={formData.area_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Заработная плата:</label>
                        <input
                            type="number"
                            name="wage"
                            value={formData.wage}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Опыт работы:</label>
                        <input
                            type="text"
                            name="experience"
                            value={formData.experience.label}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>График работы:</label>
                        <input
                            type="text"
                            name="schedule"
                            value={formData.schedule.label}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Количество необходимых человек:</label>
                        <input
                            type="number"
                            name="number_persons"
                            value={formData.number_persons}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Активна:</label>
                        <input
                            type="checkbox"
                            value={`${formData.active}`}
                            name="active"
                            checked={formData.active}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    active: e.target.checked,
                                }));
                                setUpdatedFields((prev) => ({
                                    ...prev,
                                    active: formData.active,
                                }));
                            }

                            }
                        />
                    </div>
                    <button onClick={handleSubmit}>Сохранить изменения</button>
                    <button onClick={delitVakansi}>Удалить запись</button>
                </>
            </div>
        </>
    )
}
export default EditJobsUser