import logo from '../Media file/image/logo.jpg';
import './index.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import UpdateUserData from "./UpdataUserPages/UpdateUserData";



const fetchData = async (url, accessToken) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `JWT ${accessToken}`,
            },
        });

        if (response.status === 401) {
            // Токен истек
            throw new Error("TokenExpired");
        }

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const refreshToken = async (refreshUrl) => {
    try {
        let tokenTexst = localStorage.getItem("authToken")
        if (tokenTexst.indexOf('tokens') !== -1) {
            const refreshTokens = JSON.parse(tokenTexst);
            const response = await fetch(refreshUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshTokens.tokens.refresh }),
            });
            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }
            const data = await response.json();
            localStorage.setItem("authToken", JSON.stringify({tokens:data.tokens}));
            return data.tokens.access;
        }else {
            window.location.href = '/user';
        }


    } catch (error) {
        window.location.href = '/login';
        throw error;
    }
};



const UserProfil = ({data}) => {
    const [error, setError] = useState(false); // Обработка ошыбок
    const [loading, setLoading] = useState(true); // Обработка Загрусков
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]); // Переменная для данных
    const [editMode, setEditMode] = useState(false); // Режим редактирования
    const handleEditClick = () => {
        setEditMode(!editMode); // Включить режим редактирования
    }


    const fetchWithToken = async () => {
        setLoading(true);
        setError(null);

        let tokenText = localStorage.getItem("authToken")
        if (tokenText.indexOf('tokens') !== -1){
            let accessToken = JSON.parse(tokenText);
            const accessUrl = "http://127.0.0.1:8001/api/user/";
            const refreshUrl = "http://127.0.0.1:8001/api/token/refresh/";
            try {
                let data = await fetchData(accessUrl, accessToken.tokens.access);
                setUserData(data); // Успешно получили данные
            } catch (error) {
                if (error.message === "TokenExpired") {
                    try {
                        // Обновляем токен
                        const newAccessToken = await refreshToken(refreshUrl);
                        // Повторяем запрос с новым токеном
                        const datas = await fetchData(accessUrl, newAccessToken);
                        setUserData(datas); // Успешно получили данные
                        navigate("/user/");
                    } catch (refreshError) {
                        setError("Не удалось обновить токен");
                        console.error("Ошибка обновления токена:", refreshError);
                    }
                } else {
                    setError("Ошибка при получении данных");
                    console.error("Ошибка:", error);
                }
            } finally {
                setLoading(false);
            }
        }else {
            // navigate("/login/");
        }
    };

    useEffect(() => {
        fetchWithToken()
        setUserData(data)
    }, [data]);
    return (
        <>
            <div className={"block-content"}>
                {editMode?<>
                    <UpdateUserData data={userData} clok={handleEditClick} newdata={(datas) => setUserData(datas)} />
                </>:
                <>
                    <div className="body">
                        <div className="container">
                            <div className="content">
                            <span className="designer">
                            </span>
                                <h1>{userData.first_name} {userData.last_name}</h1>
                                <a href=""
                                    // style="cursor: pointer;"
                                >ddd</a>
                                <div className="skills">
                                <span>
                                {userData.description}
                                </span>
                                </div>
                                <p>
                                    {userData.text}
                                </p>
                                <a className="btn" onClick={handleEditClick}>Изменить</a>
                            </div>
                            <div className="logo">
                                {!userData.photo ? <img src={logo} alt="WS Logo"/> :
                                    <img  src={`http://127.0.0.1:8001${userData.photo}`} alt={`Image ${userData.last_name}`}/>
                                }
                                <a>
                                    <div className="icon_settings">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                             fill="currentColor"
                                             className="bi bi-gear" viewBox="0 0 16 16">
                                            <path
                                                d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                                            <path
                                                d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </>}
            </div>
        </>
    )
}
export default UserProfil;