import React, {useState,useEffect} from "react";
import axios from 'axios';
import imgUser  from '../../Media file/image/user.png'
import imgUsermen  from '../../Media file/image/user men.png'
import imgWomen  from '../../Media file/image/user women.png'
import {useNavigate} from "react-router-dom";

const UserInfo = ({data, onClok, newData}) =>{
    // const navigate = useNavigate();
    const [choices, setChoices] = useState({});
    const [loading, setLoading] = useState(true); // Обработка Загрусков
    const [errors, setErrors] = useState(false); // для ошыбки от сервера

    const [formData, setFormData] = useState({
        last_name: "",
        first_name: "",
        role: true,
        city: 1,
        photo:"",

        photoNew:null,
        preview: null,

        gender:"Н",
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

    });    // Данные пользователя из BD
    const [updatedFields, setUpdatedFields] = useState({}); // Только изменённые данные

    useEffect(() => {
        const fetchedSalary = data.desired_salary;
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
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
                setErrors(true);
            });
            setFormData(prevState => ({
            ...prevState,
            ...data, // Подставляем данные из props data
            desired_salary:parseInt(fetchedSalary)
        }));

    }, [data]);
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
        })
    }
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

    };

    const changeData = async (e) => {
        e.preventDefault()
        let tokenText = localStorage.getItem("authToken")
        let accessToken = JSON.parse(tokenText);

        const formData = new FormData();

        Object.entries(updatedFields).forEach(([key, value]) => {
            formData.append(key, value);
        });
        try {
            const response = await fetch("http://localhost:8001/api/user/update/", {
                method: "PUT",
                headers: {
                    "Authorization" : `JWT ${accessToken.tokens.access}`,
                    // "Content-Type": "application/json"
                },
                body: formData,
            });
            if (response.ok) {
                const datas = await response.json();
                alert('Успех', datas);
                newData(datas)
                onClok()
            } else {
                const errorData = await response.json();
                alert("Ошибка: " + errorData.error  || "Регистрация не удалась");
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка подключения к серверу.");
        }
    }

    if (errors) {
        return (<h1>Ошыпка повторите попытку...</h1>)
    }
    if (loading){
        return (<h1>Загруска...</h1>)
    }
    const userGender =  formData.gender === "М" ? imgUsermen : formData.gender === "Э" ? imgWomen : imgUser;
    const  photoURL= formData.preview ? formData.preview : formData.photo ? `http://127.0.0.1:8001${formData.photo}` : userGender

    return (
        <>
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
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="role"
                        value={true}
                        checked={JSON.parse(formData.role) === true}
                        onChange={handleChange}
                        id="flexRadioDefault1"
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Соискатель
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="role"
                        value={false}
                        checked={JSON.parse(formData.role) === false}
                        onChange={handleChange}
                        id="flexRadioDefault2"
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Работодатель
                    </label>
                </div>
                <br/>
                <span>Пол</span>
                <select className="form-select form-select-sm" aria-label="Small select example" name="gender"
                        value={formData.gender} onChange={handleChange}>
                    {choices.gender && choices.gender.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <br/>
                <span>Образование</span>
                <select
                    className="form-select form-select-sm"
                    aria-label="Выберите образование"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}>
                    <option disabled>Образование</option>
                    {choices.education && choices.education.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <br/>
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
                <div className="mb-3">
                    <label htmlFor="FormControlInput1" className="form-label">Email address</label>
                    <input type="text" name="description" className="form-control" id="FormControlInput1"
                           placeholder="" value={formData.description} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                    <textarea className="form-control" name="text" value={formData.text}
                              onChange={handleChange} id="exampleFormControlTextarea1" rows="3"/>
                </div>
                <br/>
                <select className="form-select form-select-sm" aria-label="Small select example" name="relocation"
                        value={formData.relocation} onChange={handleChange}>
                    <option selected>Переезд</option>
                    {choices.relocation && choices.relocation.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <br/>
                <select className="form-select form-select-sm" aria-label="Small select example" name='experience'
                        value={formData.experience} onChange={handleChange}>
                    <option selected>Опыт работы</option>
                    {choices.experience && choices.experience.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <br/>
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
                        <input type="text" className="form-control" id="basic-url" name="web_url" value={formData.web_url} onChange={handleChange} placeholder={"google.com"}
                               aria-describedby="basic-addon3 basic-addon4"/>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="basic-url" className="form-label">Полный номер <code>WhatsApp</code></label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon3">https://wa.me/</span>
                        <input type="text" className="form-control" id="basic-url" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                               aria-describedby="basic-addon3 basic-addon4"/>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="basic-url" className="form-label">Ваш USERNAME или ID <code>Telegram</code></label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon3">@user_name/ID</span>
                        <input type="text" className="form-control" id="basic-url" name="telegram"
                               value={formData.telegram} onChange={handleChange} placeholder={"@ELAMAN_K"}
                               aria-describedby="basic-addon3 basic-addon4"/>
                    </div>
                    <div className="form-text" id="basic-addon4">Данные мы не будем проверять на подленность!</div>
                </div>
                <br/>
                <button className="btn btn-outline-secondary" type="submit">Сохранить изминение</button>
                <button className="btn btn-outline-secondary" type="submit" onClick={onClok}>Отменить</button>
            </form>
            <br/>
        </>
    )
}
export default UserInfo