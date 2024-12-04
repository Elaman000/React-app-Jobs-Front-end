



import user from '../Media file/image/Group 11.png';
import MainpageJobspage from "./MainpageJobspage";





const MainPages = ({dataJobs}) => {
    return(
        <>
            <div className={"block-content"}>
                {/*Главай контент*/}
                <div className={"body-main-jobs"}>
                    <div className={"block main-jobs-content-block"}>
                        <h1>Краткосрочные и долгосрочные работы!</h1>
                        <p>Найдите подработку на день или месяц. Удобные варианты для одного или команды.</p>
                        <form method="get" action="">
                            <div className={"input-group mb-3"}>
                                <input type="search" className="form-control" name="search"
                                       placeholder="Что вы ишите?"
                                       aria-label="Recipient's username" aria-describedby="button-addon2"/>
                                <button className={"btn btn-outline-secondary"} type="submit">Найти</button>
                            </div>
                        </form>
                        <p>Выберите рубрику, чтобы найти ваше</p>
                        <div className={"heading"}>
                            <form method="get" action="">
                                <button type="submit" name="search" value="">TEXST3</button>
                            </form>
                        </div>
                    </div>
                    <div className={"block main-jobs-img-block"}>
                        <img src={user} alt="dwddw"/>
                    </div>
                </div>
                <br/>
                <br/>
                <br/>

                <MainpageJobspage data={dataJobs}/>

                <br/>
                <br/>
                <br/>


            </div>
        </>
    )
}


export default MainPages