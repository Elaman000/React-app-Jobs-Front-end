import React, {useState} from "react";
import './index.css';
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [errors, setErrors] = useState({}); // для ошыбки от сервера
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        cPassword: false,
        agreeToTerms:false,
    });
    const data = {
        email: formData.email,
        password: formData.password,
    }
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8001/api/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                const refresh = data.refresh;
                const access = data.access;
                localStorage.setItem("authToken", JSON.stringify({
                    tokens:{
                        refresh:refresh,
                        access:access
                    }
                }));

                alert("Вход успешна!");
                // window.location.href = '/';
                navigate("/");
                setFormData({
                    email: "",
                    password: "",
                    cPassword: false,
                    agreeToTerms:false,
                });
            } else {
                const errorData = await response.json();
                setErrors(errorData);

                console.log("Ошибка: " + errorData.message || "Вход не удалась");
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка подключения к серверу.");
        }
        // }
    };
    return (
        <>
            <div className={"block-content"}>
                <h1>Авторизатция</h1>
                <div className={'blok_registration_form'}>
                    <img
                        src={"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGZiYjBrbXp0aTBpYjdmcnN6ZmRvdWx6MDMxcXY5NmZ4NnYxOWMxeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/82uebUdX9ft0Co9mGe/giphy.webp"}/>
                    <form className="row g-3" onSubmit={handleSubmit}>

                        <div className="col-md-7">
                            <label htmlFor="email validationServerUsername" className="form-label">Email</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text" id={"inputGroupPrepend3"}>@</span>
                                <input
                                    placeholder={"Mirzaev_beksultan@gmail.com"}
                                    type="email"
                                    className={errors.email ? "form-control is-invalid" : formData.email.length >= 4 ? "form-control" : "form-control is-invalid"}
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
                        </div>

                        <div className="col-7">
                            <button
                                className="btn btn-primary" type="submit">Отправить
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </>
    )
}

export default LoginPage