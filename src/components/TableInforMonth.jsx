import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../styles/tableinformonth/tableinformonth.css';
const TableInforMonth = () => {
    return (
        <>
            <div className="mt-3">
                <div className="is_infor_day d-flex">
                    <span className="good-day">MÀU ĐỎ : NGÀY TỐT</span>,
                    <span className="bad-day">MÀU TÍM : NGÀY XẤU</span>
                </div>
                <div className="title-month d-flex justify-content-around align-items-center">
                    <Link to={"/"}>
                        <span className="triangle-left"></span>
                    </Link>
                    <span>LỊCH ÂM THÁNG 10 NĂM 2024</span>
                    <Link to={"/"}> <span className="triangle-right"></span></Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>THỨ HAI</th>
                            <th>THỨ BA</th>
                            <th>THỨ TƯ</th>
                            <th>THỨ NĂM</th>
                            <th>THỨ SÁU</th>
                            <th>THỨ BẢY</th>
                            <th>CHỦ NHẬT</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        <tr >
                            <td>
                                <Link to={"#"}>
                                    <div className="infors">
                                        <span className="day">1</span>
                                        <span className="circle"></span>
                                    </div>
                                    <h6 className="ngayam">12</h6>
                                    <h6 className="namedayam">Mậu Tuất</h6>
                                </Link>
                            </td>
                            <td>
                                <Link to={"#"}>
                                    <div className="infors">
                                        <span className="day">1</span>
                                        <span className="circle"></span>
                                    </div>
                                    <h6 className="ngayam">12</h6>
                                    <h6 className="namedayam">Mậu Tuất</h6>
                                </Link>
                            </td>
                            <td>
                                <Link to={"#"}>
                                    <div className="infors">
                                        <span className="day">1</span>
                                        <span className="circle"></span>
                                    </div>
                                    <h6 className="ngayam">12</h6>
                                    <h6 className="namedayam">Mậu Tuất</h6>
                                </Link>
                            </td>
                            <td>
                                <Link to={"#"}>
                                    <div className="infors">
                                        <span className="day">1</span>
                                        <span className="circle"></span>
                                    </div>
                                    <h6 className="ngayam">12</h6>
                                    <h6 className="namedayam">Mậu Tuất</h6>
                                </Link>
                            </td>
                            <td>
                                <Link to={"#"}>
                                    <div className="infors">
                                        <span className="day">1</span>
                                        <span className="circle"></span>
                                    </div>
                                    <h6 className="ngayam">12</h6>
                                    <h6 className="namedayam">Mậu Tuất</h6>
                                </Link>
                            </td>
                            <td>
                                <Link to={"#"}>
                                    <div className="infors">
                                        <span className="day">1</span>
                                        <span className="circle"></span>
                                    </div>
                                    <h6 className="ngayam">12</h6>
                                    <h6 className="namedayam">Mậu Tuất</h6>
                                </Link>
                            </td>
                            <td>
                                <Link to={"#"}>
                                    <div className="infors">
                                        <span className="day">1</span>
                                        <span className="circle"></span>
                                    </div>
                                    <h6 className="ngayam">12</h6>
                                    <h6 className="namedayam">Mậu Tuất</h6>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default TableInforMonth;