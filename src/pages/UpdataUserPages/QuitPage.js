import React, {useState} from "react";
import { Helmet } from 'react-helmet';


const QuitPages = ({data,renderSectionUpdate,newdata} ) => {
    const [formData, setFormData] = useState({
        role:data.role,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: JSON.parse(value),
        });
    }
    const saveChange = async () => {
        if (data.role !== formData.role) {
            let tokenText = localStorage.getItem("authToken")
            let accessToken = JSON.parse(tokenText);
            const response = await fetch("http://localhost:8001/api/user/update/", {
                method: "PUT",
                headers: {
                    "Authorization" : `JWT ${accessToken.tokens.access}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const datas = await response.json();
                // console.log('Успех', datas);
                newdata(datas)
                renderSectionUpdate()
            } else {
                const errorData = await response.json();
                alert("Ошибка: " + errorData.error  || "Регистрация не удалась");
            }
        }else {
            renderSectionUpdate()
        }
    }

    return (
        <>
            <Helmet>
                <title>Аккаунт</title>
            </Helmet>
            <h3>Выйти из аккаунта</h3>
            <br/>
            <b>Изменить роль</b>
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
                    Режым соискателя
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
                    Режым работодателя
                </label>
            </div>
            <br/>
            <button className="btn btn-outline-secondary"
                    // disabled={data.role === formData.role}
                    onClick={saveChange}>Сохранить</button>

        </>
    )
}

export default QuitPages