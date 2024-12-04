
import React, { useState } from "react";
import UserInfo from "./UserInfo";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";


const UpdateUserData = ({data,clok, newdata}) => {
    const [activeSection, setActiveSection] = useState("editInfo"); // Дефолтный раздел — изменение информации пользователя

    const renderSection = () => {
        switch (activeSection) {
            case "editInfo":
                return <UserInfo data={data}  onClok={clok} newData={newdata}/>;
            case "changeEmail":
                return <ChangeEmail data={data.email}   OnClok={clok}/>;
            case "changePassword":
                return <ChangePassword data={data.email}   OnClok={clok} />;
            default:
                return <UserInfo data={data}   OnClok={clok}/>;
        }
    };
    return(
        <>
        <h1>{data.lastname}</h1>
        <div>
            <button onClick={() => setActiveSection("editInfo")}>Edit Info</button>
            <button onClick={() => setActiveSection("changeEmail")}>Change Email</button>
            <button onClick={() => setActiveSection("changePassword")}>Change Password</button>
        </div>
        <div>{renderSection()}</div>
    {/*<button onClick={clok}>Отмена</button>*/}
            <br/>
</>
)
}
export default UpdateUserData