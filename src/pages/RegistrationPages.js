import './index.css';
import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";



const RegistrationPages = ()=>{
    const [cities, setCities] = useState([]); // Переменная для данных городов
    const [errors, setErrors] = useState({}); // для ошыбки от сервера
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://127.0.0.1:8001/api/v1/registration_cities/")
            .then((response) => response.json()) // Парсим JSON из ответа
            .then((data) => {
                setCities(data); // Сохраняем данные в переменную
            })
            .catch((error) => console.error("Ошибка:", error)); // Ошибка запроса
    }, []); // Запуск только при первом рендере

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        role: 'true',
        city: "",
        password: "",
        email:"",
        confirmPassword: "",
        agreeToTerms:false,
        SentCode:false,
        code:''
    });
    const data = {
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        role: formData.role === 'true',
        city:Number(formData.city),
        code:  Number(formData.code)
    }
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };


    const sendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8001/api/v1/verification_code_verification/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Успех', data)
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    SentCode: true}));
            } else {
                formData.code = "error";
                const errorData = await response.json();
                setErrors(errorData);
                alert("Ошибка: " + errorData.error  || "Регистрация не удалась");
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка подключения к серверу.");
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return;
        }
        try {
            const response = await fetch("http://localhost:8001/api/v1/registration/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken",JSON.stringify({tokens: data.tokens}));
                alert("Регистрация успешна!");
                navigate("/");
                setFormData({
                    lastName: "",
                    firstName: "",
                    role: "",
                    city: "",
                    email:"",
                    password: "",
                    confirmPassword: "",
                    agreeToTerms:false,
                    code:''
                });
            } else {
                const errorData = await response.json();
                setErrors(errorData);
                console.log("Ошибка: " + errorData.error || "Регистрация не удалась");
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка подключения к серверу.");
        }
    };
    return(
        <>
            {formData.SentCode?
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input type={"text"}
                                   name="code"
                                   value={formData.code} onChange={handleChange}/>
                            <button disabled={!formData.code} type={"submit"}>Отправить</button>
                        </div>
                    </form>
                </div>
            : null}

            <div className={"block-content"}>
                <h1>Регистрация</h1>
                <div className={'blok_registration_form'}>
                    <img
                        src={"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExejgweDNxdmtsbnZuNmNzZXpqNDhidnZwbDA2Y2M2bGVycWgzaGUxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bcKmIWkUMCjVm/giphy.webp"}/>
                    <form className="row g-3" onSubmit={sendVerificationCode}>
                        <div className="col-md-5">
                            <label htmlFor="validationServer01" className="form-label">Фамилия</label>
                            <input
                                type="text"
                                className={formData.lastName? "form-control is-valid" : "form-control is-invalid"}
                                id="lastName validationServer01"
                                name="lastName"
                                placeholder="Мирзаев"
                                value={formData.lastName} onChange={handleChange}
                                required/>

                            <div className="invalid-feedback">
                                Введите вашу фамилию
                            </div>
                        </div>

                        <div className="col-md-5">
                            <label htmlFor="firstName validationServer02" className="form-label">Имя</label>
                            <input
                                type="text"
                                className={formData.firstName ? "form-control is-valid" : "form-control is-invalid"}
                                id="firstName validationServer02"
                                name="firstName"
                                placeholder="Бексултан"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <div className="invalid-feedback">
                                Введите ваше имя
                            </div>
                        </div>


                        <div className="col-md-7">
                            <label htmlFor="email validationServerUsername" className="form-label">Email</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text" id={"inputGroupPrepend3"}>@</span>
                                <input
                                    placeholder={"Mirzaev_beksultan@gmail.com"}
                                    type="email"
                                    className={errors.email ? "form-control is-invalid" : formData.email ? "form-control" : "form-control is-invalid"}
                                    id="email validationServerUsername"
                                    name="email"
                                    aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <div id="validationServerUsernameFeedback" className="invalid-feedback">
                                    {errors.email ? errors.email[0] : "Поле логина не может быть пустым."}
                                </div>

                            </div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="role validationServer04" className="form-label">Кто вы?</label>
                            <select
                                className="form-select is-valid"
                                id="role validationServer04 "
                                aria-describedby="validationServer04Feedback"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="true">Соискатель</option>
                                <option value="false">Работодатель</option>
                            </select>
                            <div id="validationServer04Feedback" className="invalid-feedback">
                                Укажите корректный статус
                            </div>
                        </div>

                        <div className="col-md-7">
                            <label htmlFor="password validationServer05" className="form-label">Введите пароль</label>
                            <input
                                type="password"
                                className={formData.password ? "form-control is-valid" : "form-control is-invalid"}
                                id="password validationServer05"
                                name="password"
                                aria-describedby="validationServer05Feedback"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div id="validationServer05Feedback" className="invalid-feedback">
                                Пароль обязателен для заполнения.
                            </div>
                            <p/>
                            <label htmlFor="confirmPassword validationServer05" className="form-label">Повторите
                                пароль</label>
                            <input
                                type="password"
                                className={formData.confirmPassword !== "" ? formData.confirmPassword === formData.password ? "form-control is-valid" : "form-control is-invalid" : "form-control is-invalid"}
                                aria-describedby="validationServer05Feedback"
                                id="confirmPassword validationServer05"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {formData.confirmPassword !== "" ? formData.confirmPassword === formData.password ?
                                    <div id="validationServer05Feedback"
                                         className="valid-feedback">
                                        Правильно
                                    </div> :
                                    <div id="validationServer05Feedback"
                                         className="invalid-feedback">
                                        Пароли не совпадают!
                                    </div> :
                                ""}
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="city validationServer04" className="form-label">Ваш город</label>
                            <select
                                className={formData.city ? "form-select is-valid" : "form-select is-invalid"}
                                id="city validationServer04"
                                name="city"
                                aria-describedby="validationServer04Feedback"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Город...</option>

                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>{city.city}</option>
                                ))}
                                {cities.length > 1 ? null : <option value="3">Чуй</option>}
                            </select>
                            <div id="validationServer04Feedback" className="invalid-feedback">
                                Пожалуйста, укажите ваш города.
                            </div>
                        </div>

                        <div className="col-10">
                            <div className="form-check">
                                <input
                                    className={formData.agreeToTerms ? "form-check-input is-valid" : "form-check-input is-invalid"}
                                    type="checkbox"
                                    id="agreeToTerms invalidCheck3"
                                    name="agreeToTerms"
                                    aria-describedby="invalidCheck3Feedback"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="form-check-label" htmlFor="agreeToTerms invalidCheck3">
                                    Согласен с условиями
                                </label>
                                <div id="invalidCheck3Feedback" className="invalid-feedback">
                                    Перед отправкой необходимо согласиться.
                                </div>
                            </div>
                        </div>
                        <div className="col-7">
                            <button
                                className="btn btn-primary"
                                disabled={formData.password === "" || formData.password !== formData.confirmPassword || !formData.lastName || !formData.firstName || !formData.email || !formData.city || !formData.agreeToTerms}
                                type="submit">Отправить
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default RegistrationPages