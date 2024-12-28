import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Helmet } from 'react-helmet';



const ChangePassword = ({data}) => {
    const [loading, setLoading] = useState(false); // Обработка Загрусков

    const [number, setNumber] = useState();
    const [password, setPassword] = useState({});
    const [password2, setPassword2] = useState({});
    const [code, setCode] = useState(false); // Обработка Загрусков
    const navigate = useNavigate();
    const dataUser = {
        email: data,
        password: password,
        code: number,
    }
    const handleChange = (e) => {
        setPassword(e.target.value)
    };
    const handleChange2 = (e) => {
        setPassword2(e.target.value);
    };
    const NumberCode = (e) => {
        setNumber(e.target.value);
    };
    const sendVerificationCode = async (e) => {
        if (password !== password2) {
            return console.log("Passwords don't match");
        }
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8001/api/v1/verification_code_verification/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email : data,
                    update_password: true,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                alert('Успех', data)
                setLoading(false);
                setCode(true);
            } else {
                setLoading(false);
                const errorData = await response.json();
                alert("Ошибка: " + errorData.error  || "Регистрация не удалась");
            }
        } catch (error) {
            setLoading(false)
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка подключения к серверу.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (number){
            let tokenText = localStorage.getItem("authToken")
            let token = JSON.parse(tokenText);
            try {
                setLoading(true);

                const response = await fetch("http://localhost:8001/api/v1/reset_password/", {
                    method: "PUT",
                    headers: { "Authorization":`JWT ${token.tokens.access}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataUser),
                });
                if (response.ok) {
                    setLoading(false);

                    alert("Успешный сброс пароля!");
                    window.location.href = '/user';
                } else {
                    setLoading(false);

                    const errorData = await response.json();
                    console.log("Ошибка: " + errorData.error || "Регистрация не удалась");
                }
            } catch (error) {
                setLoading(false);
                console.error("Ошибка при отправке данных:", error);
                alert("Ошибка подключения к серверу.");
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>Изменит пароль</title>
            </Helmet>
            <h3>Придумайте новый пароль для входа</h3>
            <b>Пороль подтверждений будет отправить на ваш Email</b>
            {loading?<p>Отправляется...</p>:null}
            <form onSubmit={sendVerificationCode}>
                <br/>
                <label>Пароль</label>
                <br/>

                <input type="text" placeholder={"Придумайте пароль"} name="password" onChange={handleChange}
                       id="password"/>
                <br/>
                <br/>
                <label>Повторите пароль</label>
                <br/>

                <input type="text" placeholder={"Повторите пароль"} name="password" onChange={handleChange2}
                       id="password"/>
                <br/><br/>
                <button className="btn btn-outline-secondary" type="submit">Отправить</button>
            </form>
            <br/>
            {code?<>
                <form onSubmit={handleSubmit}>
                    <input type={"text"} placeholder={"Ведите код из Emal"} value={number} onChange={NumberCode} />
                    <button className="btn btn-outline-secondary" type="submit">Отправить</button>
                </form>
            </>:null}
            <br/>
            {/*<button className="btn btn-outline-secondary" onClick={OnClok}>Отменить</button>*/}
        </div>
    )
};
export default ChangePassword;