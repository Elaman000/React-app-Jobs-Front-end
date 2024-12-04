import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const ChangeEmail = ({data, OnClok}) => {
    const [email, setEmail] = useState();
    const [number, setNumber] = useState();
    const [code, setCode] = useState(false); // Обработка Загрусков
    const navigate = useNavigate();
    const dataEmail ={
        email: email,
        code: number,
    }
    const handleChange = (e) => {
        setEmail(e.target.value);
    };
    const handleChangeNumber = (e) => {
        setNumber(e.target.value);
    };


    const sendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8001/api/v1/verification_code_verification/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });
            if (response.ok) {
                const data = await response.json();
                alert('Успех', data)
                setCode(true);
            } else {
                const errorData = await response.json();
                alert("Ошибка: " + errorData.error  || "Регистрация не удалась");
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка подключения к серверу.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let tokenText = localStorage.getItem("authToken")
        let token = JSON.parse(tokenText);
        try {
            const response = await fetch("http://localhost:8001/api/v1/change_email/", {
                method: "PUT",
                headers: { "Authorization":`JWT ${token.tokens.access}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataEmail),
            });
            if (response.ok) {
                alert("Регистрация успешна!");
                window.location.href = '/user';
                setEmail("")
            } else {
                const errorData = await response.json();
                console.log("Ошибка: " + errorData.error || "Регистрация не удалась");
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка подключения к серверу.");
        }
    };




    return (

        <div>
            <h2>Change Email</h2>
            <h4> Ваш Email <code>{data}</code> </h4>
            <form onSubmit={sendVerificationCode}>
                <div className="mb-3">
                    <label htmlFor="FormControlInput1" className="form-label">Новый Email адрес</label>
                    <input type="text" name="description" className="form-control" id="FormControlInput1"
                           placeholder="" disabled={code} value={email} onChange={handleChange}/>
                </div>
                <button className="btn btn-outline-secondary" type="submit">Отправить</button>
                <button className="btn btn-outline-secondary" type="submit" onClick={OnClok}>Отменить</button>
            </form>
            {code ?
                <form onSubmit={handleSubmit}>
                    <input type="text" value={number} onChange={handleChangeNumber}/>
                    <button type={"submit"}>Отправить</button>
                </form>:null}

        </div>
    )
};
export default ChangeEmail;