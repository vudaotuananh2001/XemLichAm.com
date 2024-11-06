import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/tableInforDay/tableinforday.css';

const TableInfoDay = ({negativeDay}) => {
    const positiveDay = negativeDay.positive_day;
    let day =positiveDay.split('-');
    const negatives = negativeDay.negative_day;
    let negative =negatives.split('-');
    
    return (
        <>
            <div className=" mt-3">
                <div className="table-title">
                    ÂM LỊCH NGÀY {day[0]} THÁNG {day[1]} {day[2]}
                </div>
                <div className="table-content">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>DƯƠNG LỊCH</th>
                                <th>ÂM LỊCH</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Tháng {day[1]} Năm {day[2]}</td> 
                                <td>Tháng {negative[1]} Năm {negative[2]} ({negativeDay.nameYear})</td>
                            </tr>
                            <tr>
                                <td>
                                    <h6 className="duonglich">{day[0]}</h6>
                                </td>
                                <td>
                                    <h6 className="amlich">{negative[0]}</h6>
                                    <h6 className="detail-day">Ngày : <b>{negativeDay.nameDay}</b>, Tháng : <b>{negativeDay.nameMonth}</b></h6>
                                    <h6 className="detail-day">Tiết khí :  <b>{negativeDay.tietKhi}</b></h6>
                                </td>

                            </tr>
                            <tr>
                                <td className="color-house" colSpan="2">Giờ Hoàng Đạo (Giờ Tốt)</td>
                            </tr>
                            <tr>
                                <td className="detail-color-house" colSpan="2">{negativeDay.zodiac_hour}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default TableInfoDay;