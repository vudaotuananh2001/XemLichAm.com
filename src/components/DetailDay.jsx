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
                lines.push(currentLine.join(' '));
                currentLine = [];
                lineNumber++; // Tăng số dòng
            }
            // Hàng chẵn (8 từ)
            else if (lineNumber % 2 === 0 && currentLine.length === 8) {
                lines.push(currentLine.join(' '));
                currentLine = [];
                lineNumber++; // Tăng số dòng
            }
        }

        // Nếu còn từ trong currentLine, thêm chúng vào hàng cuối
        if (currentLine.length > 0) {
            lines.push(currentLine.join(' '));
        }

        return lines;
    };
    
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

                // Thêm dấu phẩy cuối dòng
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

            // Thêm dấu phẩy cuối dòng
            line += ',';

            lines.push(line);
        }

        return lines;
    };
    const data = negativeDay.departure_direction;
    const dataDepartureTime  = negativeDay.departureTime;
    const nameDay = negativeDay.nameDay;
    const canChiNameDay = nameDay.split(' ')
    const dataCan = getInforDayCan(canChiNameDay[0]);
    const dataChi = getInforDayChi(canChiNameDay[1]);
    const lucdieu = negativeDay.lucdieu;
    const ngayKy = negativeDay.ngayKy;
    const thapNhi = negativeDay.thapNhi;
    console.log('Thâp nhị', thapNhi);
    
    const lines = splitString1(lucdieu.verse);
    return (
        <>
            <div className="mt-3">
                <div className="title-detail-days">
                    XEM NGÀY TỐT XẤU HÔM NAY
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
                                <p>Ngày : <b>Tân Hợi </b>- tức Can sinh Chi (Kim sinh Thủy), ngày này là ngày cát (bảo nhật).</p>
                                <p>- Nạp âm: Ngày Thoa Xuyến Kim, kỵ các tuổi: Ất Tỵ và Kỷ Tỵ.</p>
                                <p>- Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Kỷ Hợi vì Kim khắc mà được lợi.</p>
                                <p>- Ngày Hợi lục hợp với Dần, tam hợp với Mão và Mùi thành Mộc cục. Xung Tỵ, hình Hợi, hại Thân, phá Dần, tuyệt Ngọ.</p>
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Bành Tổ Bách Kỵ Nhật</b></td>
                            <td>
                                <p>-<b> {canChiNameDay[0]}</b> : “{dataCan.names}” - {dataCan.detail}</p>
                                <p>-<b> {canChiNameDay[1]}</b> : “{dataChi.names}” - {dataChi.detail} </p>
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Khổng Minh Lục Diệu</b></td>
                            <td>
                                <p>Ngày: <b> {lucdieu.names} </b>-  {lucdieu.detail}</p>
                                <p>{lucdieu.description}</p>
                                " {lines.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                                "
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Nhị Thập Bát Tú</b></td>
                            <td>
                                <p><b> Tên sao</b>: Sao Trương</p>
                                <p><b> Tên ngày</b>: Trương Nguyệt Lộc - Vạn Tu: Tốt (Kiết Tú) Tướng tinh con nai, chủ trị ngày thứ 2.</p>
                                <p><b>Nên làm</b>: Khởi công tạo tác trăm việc đều tốt. Trong đó, tốt nhất là che mái dựng hiên, xây cất nhà, trổ cửa dựng cửa, cưới gả, chôn cất, hay làm ruộng, nuôi tằm , làm thuỷ lợi, đặt táng kê gác, chặt cỏ phá đất, cắt áo cũng đều rất tốt.</p>
                                <p><b>Kiêng cữ</b>: Sửa hay làm thuyền chèo, hoặc đẩy thuyền mới xuống nước.</p>
                                <p><b>Ngoại lệ </b>:</p>
                                <p>- Tại Mùi, Hợi, Mão đều tốt. Tại Mùi: đăng viên rất tốt nhưng phạm vào Phục Đoạn (Kiêng cữ như trên).Trương: Nguyệt Lộc (con nai): Nguyệt tinh, sao tốt. Việc mai táng và hôn nhân thuận lợi.</p>
                                <p>Buổi sáng tốt, nhưng chiều xấu nên cần làm nhanh. Niềm vui nhanh chóng, nên dùng để mưu đại sự, sẽ thành công mau lẹ hơn. Tốt nhất là tiến hành công việc vào buổi sáng, càng sớm càng tốt.</p>
                                {/* "{result.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                                " */}
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Thập Nhị Kiến Trừ</b></td>
                            {(thapNhi.description1 || thapNhi.description2 || thapNhi.description3 || thapNhi.description4) && (
                                <td>
                                    <p><b>{thapNhi.name}</b></p>
                                    {thapNhi.description1 && <p><b>Nên làm</b> : {thapNhi.description1}</p>}
                                    {thapNhi.description2 && <p><b>Không nên</b> : {thapNhi.description2}</p>}
                                    {thapNhi.description3 && <p><b>Chú ý</b> : {thapNhi.description3}</p>}
                                    {thapNhi.description4 && <p><b>Chú ý</b> : {thapNhi.description4}</p>}
                                </td>
                            )}
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Ngọc Hạp Thông Thư</b></td>
                            <td>
                                <p><b>Sao tốt</b> : </p>
                                <p>- Thiên Đức Hợp: Tốt cho mọi việc.</p>
                                <p>- Nguyệt Đức Hợp: Tốt cho mọi việc, kỵ việc kiện tụng.</p>
                                <p>- Thiên Quý: Tốt cho mọi việc.</p>
                                <p>- Thiên Thành: Tốt cho mọi việc.</p>
                                <p><b>Sao xấu</b> : </p>
                                <p>- Kiếp Sát: Kỵ việc xuất hành, giá thú (cưới hỏi), an táng hay xây dựng. </p>
                                <p>- Hoang Vu: Xấu cho mọi công việc.</p>
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Hướng xuất hành</b></td>
                            <td>
                                <p>{data.good}</p>
                                <p>{data.bad}</p>
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