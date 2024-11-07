import React from "react";
import {getInforDayCan, getInforDayChi} from "../DataTime/FuntionTime.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/detaildays/detaildays.css';
const DetailDays = ({ negativeDay }) => {

    const splitString1 = (input) => {
        const words = input.split(' ').filter(word => word.length > 0);
        const lines = [];
        let currentLine = [];
        let lineNumber = 1; // Đếm số dòng để xác định hàng lẻ và chẵn
    
        for (let i = 0; i < words.length; i++) {
            currentLine.push(words[i]);
    
            // Hàng lẻ (6 từ)
            if (lineNumber % 2 !== 0 && currentLine.length === 6) {
                let line = currentLine.join(' ');
    
                // Nếu đây là dòng đầu tiên, thêm dấu ngoặc kép mở
                if (lines.length === 0) {
                    line = `"${line}`;
                }
    
                lines.push(line);
                currentLine = [];
                lineNumber++; // Tăng số dòng
            }
            // Hàng chẵn (8 từ)
            else if (lineNumber % 2 === 0 && currentLine.length === 8) {
                let line = currentLine.join(' ');
    
                lines.push(line);
                currentLine = [];
                lineNumber++; // Tăng số dòng
            }
        }
    
        // Nếu còn từ trong currentLine, thêm chúng vào hàng cuối
        if (currentLine.length > 0) {
            let line = currentLine.join(' ');
    
            // Thêm dấu ngoặc kép đóng vào dòng cuối cùng
            line += '"';
            lines.push(line);
        } else if (lines.length > 0) {
            // Nếu không còn từ ở dòng cuối và có ít nhất một dòng trước đó,
            // thêm dấu ngoặc kép đóng vào dòng cuối cùng
            lines[lines.length - 1] += '"';
        }
        return lines;
    };
    const ngayDuong= negativeDay.positive_day;
    const thongTinNgayDuong = ngayDuong.split('-');
    const data = negativeDay.departure_direction;
    const dataDepartureTime  = negativeDay.departureTime;
    const nameDay = negativeDay.nameDay;
    const canChiNameDay = nameDay.split(' ')
    const dataCan = getInforDayCan(canChiNameDay[0]);
    const dataChi = getInforDayChi(canChiNameDay[1]);
    const lucdieu = negativeDay.lucdieu;
    const ngayKy = negativeDay.ngayKy;
    const thapNhi = negativeDay.thapNhi;
    const lines = splitString1(lucdieu.verse);
    const startGood = negativeDay.startGood;
    const startBad = negativeDay.startBad;
    const dataNguHanh = negativeDay.nguHanhDay;
    const thapNhiBat =  negativeDay.thapNhiBatTus;
    const splitString2 = (input) => {
        const words = input.split(' ').filter(word => word.length > 0);
        const lines = [];
        let currentLine = [];
    
        for (let i = 0; i < words.length; i++) {
            currentLine.push(words[i]);
    
            // Nếu đã đủ 7 từ, tạo dòng mới
            if (currentLine.length === 7) {
                let line = currentLine.join(' ');
    
                // Viết hoa chữ cái đầu của dòng
                line = line.charAt(0).toUpperCase() + line.slice(1);
    
                // Nếu đây là dòng đầu tiên, thêm dấu ngoặc kép mở
                if (lines.length === 0) {
                    line = `"${line}`;
                }
    
                // Thêm dấu phẩy cuối dòng (sẽ bị loại bỏ ở dòng cuối cùng)
                line += ',';
    
                lines.push(line);
                currentLine = [];
            }
        }
    
        // Xử lý dòng cuối nếu còn từ
        if (currentLine.length > 0) {
            let line = currentLine.join(' ');
    
            // Viết hoa chữ cái đầu của dòng cuối
            line = line.charAt(0).toUpperCase() + line.slice(1);
    
            // Thêm dấu ngoặc kép đóng vào dòng cuối cùng, không thêm dấu phẩy
            line += '"';
    
            lines.push(line);
        } else if (lines.length > 0) {
            // Nếu không còn từ ở dòng cuối và có ít nhất một dòng trước đó,
            // loại bỏ dấu phẩy cuối và thêm dấu ngoặc kép đóng vào dòng cuối cùng
            lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1) + '"';
        }
    
        return lines;
    };
    const result = splitString2(thapNhiBat.verse);
    return (
        <>
            <div className="mt-3">
                <div className="title-detail-days">
                    THÔNG TIN NGÀY {thongTinNgayDuong[0]} THÁNG {thongTinNgayDuong[1]} NĂM {thongTinNgayDuong[2]}
                </div>
                <table className="table">
                    <tbody>
                        <tr>
                            <td className="title-row-table"><b>Giờ Hoàng Đạo</b></td>
                            <td>{negativeDay.detailZodiacHour}</td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Giờ Hắc Đạo</b></td>
                            <td>{negativeDay.blackHour}</td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Các Ngày Kỵ</b></td>
                            {
                                ngayKy.length > 0 ? (
                                    <td>
                                       <p className="mb-0">Phạm phải ngày:</p>
                                        {
                                            ngayKy.map((ngay, index) => (
                                                <p className="mb-0" key={index}><b>{ngay.name}</b>: {ngay.detail}</p>
                                            ))
                                        }
                                    </td>
                                ) : (
                                    <td><p>Không phạm bất kỳ ngày Nguyệt kỵ, Nguyệt tận, Tam Nương, Dương Công Kỵ Nhật nào.</p></td>
                                )
                            }
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Ngũ Hành</b></td>
                            <td>
                                <p>Ngày: <b>{negativeDay.nameDay} </b>- {dataNguHanh.name}</p>
                                <p>- Nạp âm: {dataNguHanh.napAm}</p>
                                <p>- {dataNguHanh.description}</p>
                                <p>- {dataNguHanh.detail}</p>
                                {dataNguHanh.detail2 && <p>- {dataNguHanh.detail2}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Bành Tổ Bách Kỵ Nhật</b></td>
                            <td>
                                <p>-<b> {canChiNameDay[0]}</b>: “{dataCan.names}” - {dataCan.detail}</p>
                                <p>-<b> {canChiNameDay[1]}</b>: “{dataChi.names}” - {dataChi.detail} </p>
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Khổng Minh Lục Diệu</b></td>
                            <td>
                                <p>Ngày: <b> {lucdieu.names} </b>-  {lucdieu.detail}</p>
                                <p>{lucdieu.description}</p>
                                {lines.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                                
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Nhị Thập Bát Tú</b></td>
                            <td>
                                <p><b>Tên sao</b>: {thapNhiBat.name}</p>
                                <p><b>Tên ngày</b>: {thapNhiBat.nameDay}</p>
                                <p><b>Nên làm</b>: {thapNhiBat.shouldDo}</p>
                                <p><b>Kiêng cữ</b>: {thapNhiBat.abstain}</p>
                                <p><b>Ngoại lệ</b>:</p>
                                {thapNhiBat.detail1 && (
                                    <p>- {thapNhiBat.detail1} <b>{thapNhiBat.nameDetail1}</b> {thapNhiBat.description}</p>
                                )}
                                {thapNhiBat.description3 && <p>- {thapNhiBat.description3}</p>}
                                {thapNhiBat.description4 && <p>- {thapNhiBat.description4}</p>}
                                {thapNhiBat.description2 && <p>{thapNhiBat.description2}</p>}
                                {result.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </td>

                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Thập Nhị Kiến Trừ</b></td>
                            {(thapNhi.description1 || thapNhi.description2 || thapNhi.description3) && (
                                <td>
                                    <p><b>{thapNhi.name}</b></p>
                                    {thapNhi.description1 && <p><b>Nên làm</b>: {thapNhi.description1}</p>}
                                    {thapNhi.description2 && <p><b>Không nên</b>: {thapNhi.description2}</p>}
                                    {thapNhi.description3 && <p><b>Chú ý</b>: {thapNhi.description3}</p>}
                                </td>
                            )}
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Ngọc Hạp Thông Thư</b></td>
                            <td>
                                <p><b>Sao tốt</b>:</p>
                                {
                                    startGood.map((iteam, index) => (
                                        <p key ={index}> - {iteam} </p>
                                    ))
                                }
                                <p><b>Sao xấu</b>:</p>
                                {
                                    startBad.map((iteams, indexs) => (
                                        <p key ={indexs}> - {iteams} </p>
                                    ))
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Hướng xuất hành</b></td>
                            <td>
                                <p>Xuất hành {data[0]} để đón 'Hỷ Thần'. Xuất hành {data[1]} để đón 'Tài Thần'.</p>
                                <p>Tránh xuất hành {data[2]} gặp 'Hạc Thần' (xấu).</p>
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Giờ xuất hành Theo Lý Thuần Phong</b></td>
                            <td>
                            {Array.isArray(dataDepartureTime) && dataDepartureTime.map((item, index) => (
                                <p key={index}>
                                    <b>{item.time}</b> : {item.detail}
                                </p>
                            ))}
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </>
    );
}
export default DetailDays;