import React, {useState,useEffect} from "react";
import axios from 'axios';
import imgUser  from '../../Media file/image/user.png'
import imgUsermen  from '../../Media file/image/user men.png'
import imgWomen  from '../../Media file/image/user women.png'
import {useNavigate} from "react-router-dom";
import { Helmet } from 'react-helmet';


const UserInfo = ({data, newData, renderSectionUpdate}) =>{
    // const navigate = useNavigate();
    const lokolchoicesUserInfo = JSON.parse(localStorage.getItem('choicesUserInfo'));
    const city_area = JSON.parse(localStorage.getItem('DataCity'));

    const [choices, setChoices] = useState(lokolchoicesUserInfo || {});
    const [loading, setLoading] = useState(true); // Обработка Загрусков
    const [errors, setErrors] = useState(false); // для ошыбки от сервера

    const [formData, setFormData] = useState({
        last_name: "",
        first_name: "",
        role: true,
        city_id: '',
        area_id: '',
        photo:'',

        photoNew:null,
        preview: null,

        gender:'',
        birth_date:"",
        description:"",
        text:"",
        education:"",
        relocation:"",
        experience:"",
        desired_salary:0,

        telegram:"",
        web_url:"",
        whatsapp:""

    });    // Данные пользователя из БД

    const [updatedFields, setUpdatedFields] = useState({}); // Только изменённые данные присваиваются здес и отправляются на сервер

    useEffect(() => {
        const fetchedSalary = data.desired_salary;
        if (!lokolchoicesUserInfo){
            console.log('Запрос')
            const accessToken = localStorage.getItem('authToken'); // Или другой способ хранения токена
            let access = JSON.parse(accessToken);
            axios.get('http://localhost:8001/api/v1/choices/user/', {
                headers: {
                    'Authorization': `JWT ${access.tokens.access}`,
                }
            })
                .then(response => {
                    setLoading(false);
                    setChoices(response.data);
                    localStorage.setItem("choicesUserInfo", JSON.stringify(response.data));
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных:', error);
                    setErrors(true);
                });
        }else {
            setLoading(false);
        }

        setFormData(prevState => ({
            ...prevState,
            ...data, // Подставляем данные из props data
            desired_salary:parseInt(fetchedSalary),
            gender: data.gender.id,
            city_id: data.city? data.city.id:"",
            area_id: data.area? data.area.id :"",
            relocation: data.relocation? data.relocation.id:"",
            experience: data.experience? data.experience.id:"",
            education: data.education? data.education.id:"",
        }));

    }, [data]);                   // Запрос на сервер доя получении вариянтов формы

    const OnClokDeletePhoto =(e)=>{
        e.preventDefault();
        setFormData({
            ...formData,
            photo:"",
            photoNew:null,
            preview: null,
        })
        setUpdatedFields({
            ...updatedFields,
            photoNew:null,
            photo:""
        })
    }                             // Функция удалении фото

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if(e.target.name === 'photoNew') {
            const file = e.target.files && e.target.files[0];
            if(file){
                const previewUrl = URL.createObjectURL(file);
                setFormData({
                    ...formData,
                    [name]: type === "checkbox" ? checked : value,
                    photoNew: file,
                    preview: previewUrl
                });
                setUpdatedFields({
                    ...updatedFields,
                    photo:file
                })
            }else {
                setFormData({
                    ...formData,
                    preview: null,
                    photoNew:null,
                });
            }
        }else if(e.target.name === "city_id"){
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
                area_id: null,
            });
            setUpdatedFields((prev) => ({
                ...prev,
                area_id: null,
            }));
        }else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }


        setUpdatedFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };                             // Функция изминении данных

    const changeData = async (e) => {
        e.preventDefault()
        if (Object.keys(updatedFields).length !== 0) {
            let tokenText = localStorage.getItem("authToken")
            let accessToken = JSON.parse(tokenText);

            const form = new FormData();
            Object.entries(updatedFields).forEach(([key, value]) => {
                form.append(key, value);
            });

            try {
                // for (let [key, value] of form.entries()) {// Что бы посмотреть тело запроса
                    // console.log(key, value);
                    // console.log(updatedFields)
                // }
                const response = await fetch("http://localhost:8001/api/user/update/", {
                    method: "PUT",
                    headers: {
                        "Authorization" : `JWT ${accessToken.tokens.access}`,
                        // "Content-Type": "application/json"
                    },
                    body: form,
                });
                if (response.ok) {
                    const datas = await response.json();
                    // console.log('Успех', datas);
                    newData(datas)
                    renderSectionUpdate()
                    setUpdatedFields({})
                } else {
                    const errorData = await response.json();
                    alert("Ошибка: " + errorData.error  || "Регистрация не удалась");
                }
            } catch (error) {
                console.error("Ошибка при отправке данных:", error);
                alert("Ошибка подключения к серверу.");
            }
        } else {
            renderSectionUpdate()
        }
    }                  // Функция с запросом на сервер для изминении данных


    if (errors) {
        return (<h1>Ошыпка повторите попытку...</h1>)
    }
    if (loading){
        return (<h1>Загруска...</h1>)
    }
    const userGender =  formData.gender === "М" ? imgUsermen : formData.gender === "Э" ? imgWomen : imgUser;
    const  photoURL= formData.preview ? formData.preview : formData.photo ? `http://127.0.0.1:8001${formData.photo}` : userGender

    const area = formData.city_id                              // фильтр по выбранному городу
        ? city_area
            .filter(item => item.id === Number(formData.city_id))
            .flatMap(item => item.areas)
        : [];

    return (
        <>
            <Helmet>
                <title>Изменит данные</title>
            </Helmet>
            <h2>Изменит данные</h2>
            <form onSubmit={changeData}>
                <br/>
                <div className="row">
                    <div className="col">
                        <input type="text" className="form-control"
                               name="first_name"
                               value={formData.first_name} onChange={handleChange}
                               placeholder="First name" aria-label="First name"/>
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Last name"
                               name="last_name"
                               value={formData.last_name} onChange={handleChange}
                               aria-label="Last name"/>
                    </div>
                </div>
                <br/>
                <p>
                    <label htmlFor="date">Дата рождения: </label>
                    <input type="date" id="date"
                           name="birth_date"
                           value={formData.birth_date || ""} onChange={handleChange}/>
                </p>

                <span>Пол</span>
                <select className="form-select form-select-sm" aria-label="Small select example" name="gender"
                        value={formData.gender} onChange={handleChange}>
                    {choices.gender && choices.gender.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <br/>


                <span>Город</span>
                <select className="form-select form-select-sm" aria-label="Small select example" name="city_id"
                        value={formData.city_id} onChange={handleChange}>
                    <option disabled value={""}>Город ...</option>
                    {city_area && city_area.map((value) => (
                        <option key={value.id} value={value.id}>{value.city}</option>
                    ))}
                </select>
                <br/>

                {area ? <>
                    <span>Район</span>
                    <select className="form-select form-select-sm" aria-label="Small select example" name="area_id"
                            value={formData.area_id} onChange={handleChange}>
                        <option disabled value={""}>Район ...</option>
                        {area.map((value) => (
                            <option key={value.id} value={value.id}>{value.area}</option>
                        ))}
                    </select>
                    <br/>
                </> : null}

                <p>Фото профиля</p>
                <img style={{width: "200px", height: "200px", objectFit: "cover"}} src={photoURL}/>
                <button onClick={OnClokDeletePhoto}>Удалить фото</button>
                <div className="input-group mb-3">
                    <input
                        type="file"
                        className="form-control"
                        id="inputGroupFile02"
                        name="photoNew"
                        onChange={handleChange}
                    />
                    <label className="input-group-text" htmlFor="inputGroupFile02">Выбрать</label>
                </div>
                {formData.role? <>
                    <br/>
                    <div className="mb-3">
                        <label htmlFor="FormControlInput1" className="form-label">Ваши компетенции</label>
                        <input type="text" name="description" className="form-control" id="FormControlInput1"
                               placeholder="" value={formData.description} onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Описание</label>
                        <textarea className="form-control" name="text" value={formData.text}
                                  onChange={handleChange} id="exampleFormControlTextarea1" rows="8"/>
                    </div>
                    <span>Образование</span>
                    <select
                        className="form-select form-select-sm"
                        aria-label="Выберите образование"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}>
                        <option value={""}>...</option>
                        {choices.education && choices.education.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <br/>

                    <span>Опыт работы</span>
                    <select className="form-select form-select-sm" aria-label="Small select example" name='experience'
                            value={formData.experience} onChange={handleChange}>
                        <option value={""}>...</option>
                        {choices.experience && choices.experience.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <br/>
                    <span>Переезд</span>
                    <select className="form-select form-select-sm" aria-label="Small select example" name="relocation"
                            value={formData.relocation} onChange={handleChange}>
                        <option value={''}>...</option>
                        {choices.relocation && choices.relocation.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <br/>
                    <span>Желаемая зарплата</span>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            name="desired_salary"
                            value={formData.desired_salary} // Пустое значение, если null или undefined
                            onChange={handleChange}
                            aria-label="Dollar amount (with dot and two decimal places)"
                        />
                        <span className="input-group-text">сом</span>
                    </div>
                    <br/>
                    <div className="mb-3">
                        <label htmlFor="basic-url" className="form-label">Ваше <code>domain.com</code> сайта</label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">https://</span>
                            <input type="text" className="form-control" id="basic-url" name="web_url"
                                   value={formData.web_url} onChange={handleChange} placeholder={"google.com"}
                                   aria-describedby="basic-addon3 basic-addon4"/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="basic-url" className="form-label">Полный номер <code>WhatsApp</code></label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">https://wa.me/</span>
                            <input type="text" className="form-control" id="basic-url" name="whatsapp"
                                   value={formData.whatsapp} onChange={handleChange}
                                   aria-describedby="basic-addon3 basic-addon4"/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="basic-url" className="form-label">Ваш USERNAME или
                            ID <code>Telegram</code></label>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">@user_name/ID</span>
                            <input type="text" className="form-control" id="basic-url" name="telegram"
                                   value={formData.telegram} onChange={handleChange} placeholder={"@ELAMAN_K"}
                                   aria-describedby="basic-addon3 basic-addon4"/>
                        </div>
                        <div className="form-text" id="basic-addon4">Данные мы не будем проверять на подленность!</div>
                    </div>

                </> : null}
                <br/>
                <button className="btn btn-outline-secondary" type="submit">Сохранить изминение</button>
                <button className="btn btn-outline-secondary" onClick={renderSectionUpdate}>Отменить изминение</button>
            </form>
            <br/>
            {/*<div className={"info-block-user-profil"}>*/}

            {/*    /!*<button className="btn btn-outline-secondary" type="submit">Сохранить</button>*!/*/}
            {/*    <button className="btn btn-outline-secondary" type="submit" onClick={onClok}>Закрыть</button>*/}
            {/*</div>*/}
        </>
    )
}
export default UserInfo