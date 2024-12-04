



const JobsPage = () => {
    return (
        <>
            <div className="block_post">
                <div className="block-vakanci_post">
                    <div className="block-vakanci">
                        <h3 className="card-title">Мойшик авто машин</h3>
                        <h4 className="card-text" style={{fontWeight: "700", color:" #16a060"}}>От 35000,00 сом</h4>
                        <p style={{color:"#149458"}}>Авто салон</p>
                        <p><b>Машинист</b></p>
                        <hr/>
                        <span className="card-text"><strong>Рабочих мест: </strong>2</span>
                        <hr/>
                        <p className="card-text">Требуется шустрый мойшик авто Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Velit in accusantium quae libero ipsum, quam enim repellat rem
                            necessitatibus nesciunt recusandae commodi labore at perspiciatis sapiente! Perspiciatis
                            perferendis minima quibusdam architecto expedita quia voluptatibus dolore provident,
                            dignissimos incidunt iusto ea cum accusantium voluptas velit et nesciunt doloremque
                            obcaecati nostrum odit.</p>
                        <p className="card-text"><strong>Регион: </strong>Ош обл , Озгон район </p>
                        <span style={{color:" #00000077", fontWeight: "600"}}>Вакансия опубликована: 18 Окт 2024</span>
                        <button style={{float: "right"}} onClick="goBack()" className="btn btn-primary">Назад</button>
                        <button style={{float: "right", marginRight: "5px"}} className="btn btn-primary" id="apply-button"
                                data-applied="false" data-job-id="14">Откликнутся
                        </button>
                    </div>
                    <div className="block-user-vakanci" style={{width: "18rem"}}>

                        <h5 className="card-title">Creezmi LLC</h5>
                        <p className="card-text">Торговля</p>
                        <p className="card-text">Американская суббренд компания</p>
                        <p className="card-text">Ош Масалиева 28</p>
                        <span><i className="fa-brands fa-telegram"></i> 1206557406</span><br/>
                        <span><i
                            className="fa-brands fa-whatsapp"></i> https://api.whatsapp.com/send/?phone=996501212125&amp;text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83+%D0%B8%D0%B7+%D0%BF%D1%80%D0%B8%D0%BB%D</span><br/>
                        <span><i className="fa-solid fa-phone"></i> 0554547766</span><br/>
                        <span><i className="fa-solid fa-globe"></i> google.com</span><br/>
                        <a href="/company/1/">
                            <button style={{marginTop: "15px"}} className="btn btn-primary">Подробне</button>
                        </a>
                    </div>
                </div>
                <br/>
                <hr/>
                <br/>
                <h4>Похожые вакасии</h4>
                <br/>

            </div>
        </>
    )
}
export default JobsPage;