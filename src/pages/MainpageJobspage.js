

const MainpageJobspage = ({data, choicjobs})=>{
    return (
        <>

            <h4>Актуальные вакасии</h4>
            <div className="block-main-applicants">
                {data.map((item,index)=>{
                    return (
                        <>
                            <div className="main-card_vakansi" key={index}>
                                <div className="main-card-body">
                                    <h5 className="main-card-title">{item.title}</h5>
                                    <span className="main-card-experience">{item.title_info}</span>

                                    <p className="main-card-text-info">{item.content}</p>
                                    <span className="main-card-wage">{item.wage}сом</span><br/>
                                    <span>
                                    <i className="icon-card-jobs fa-solid fa-circle-user"></i>
                                    <span className="card-text">elaman</span>
                            </span>
                                    <div className="card-jobs-data_add">
                                        {new Date(item.time_create).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <p>
                                        <i className="fa-regular fa-map"></i>
                                        <span className="main-card-text">{item.city_name}, {item.area_name}</span>
                                    </p>
                                    <a href="/post/3/">
                                        <button>Посмотреть</button>
                                    </a>
                                    <div className="card-jobs-botton-save">
                                        <i className="fa-regular fa-bookmark"></i>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                })}


                <div className="block-all-button main-card_vakansi">
                    <span>Смотреть все вакасии</span>
                </div>
            </div>
            <br/>


            <h4>Актуальные соискатели</h4>
            <div className="block-main-applicants">
                <div className="main-card_vakansi">
                    <div className="logo-name-activity">
                        <img className="" src="/media/company_logos/11341.jpg" alt="elaman logo"/>
                        <div>
                            <h6>Эламан Кылычбек уулу</h6>
                            <span style={{color: "orange"}}>Услуги на дому</span>
                        </div>
                    </div>
                    <div className="block-content-users-card">
                        <h5>IT</h5>
                        <p>Рабртает: Одиночку</p>
                        Требоваемая <span className="main-card-wage">52000,00сом</span><br/>

                        <a href="/profile/1/">
                            <button>Посмотреть</button>
                        </a>
                        <div className="card-jobs-data_add">02 Дек 2024</div>
                        <div className="card-jobs-botton-save">
                            <i className="fa-regular fa-bookmark"></i>
                        </div>
                    </div>
                </div>
                <a href="/applicant/">
                    <div className="block-all-button main-card_vakansi">
                        <span>Посмотреть всех соискателей</span>
                    </div>
                </a>
            </div>
        </>
    )
}
export  default MainpageJobspage;