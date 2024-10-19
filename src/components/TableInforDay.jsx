import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/tableInforDay/tableinforday.css';
const TableInfoDay = () => {
    return (
        <>
            <div className="container mt-3">
                <div className="table-title">
                    ÂM LỊCH NGÀY 12 THÁNG 10 2024
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
                                <td>Tháng 10 Năm 2024</td>
                                <td>Tháng 9 Năm 2024</td>
                            </tr>
                            <tr>
                                <td className="duonglich">12</td>
                                <td className="amlich">10</td>
                            </tr>
                            <tr>
                                <td className="color-house" colSpan="2">Giờ Hoàng Đạo (Giờ Tốt)</td>
                            </tr>
                            <tr>
                                <td className="detail-color-house" colSpan="2">Tý (23-1), Dần (3-5), Mão (5-7), Ngọ (11-13), Mùi (13-15), Dậu (17-19)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default TableInfoDay;