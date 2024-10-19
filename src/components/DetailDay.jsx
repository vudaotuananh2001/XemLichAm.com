import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/detaildays/detaildays.css';
const DetailDays = () => {
    const input = "Tốc Hỷ là bạn trùng phùng Gặp trùng gặp bạn vợ chồng sánh đôi Có tài có lộc hẳn hoi Cầu gì cũng được mừng vui thỏa lòng";

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
    const lines = splitString1(input);
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
    const result = splitString2(input);

    return (
        <>
            <div className="container">
                <div className="title-detail-days">
                    XEM NGÀY TỐT XẤU HÔM NAY
                </div>
                <table className="table">
                    <tbody>
                        <tr>
                            <td className="title-row-table"><b>Giờ Hoàng Đạo</b></td>
                            <td>Sửu (1:00-2:59) ; Thìn (7:00-8:59) ; Ngọ (11:00-12:59) ; Mùi (13:00-14:59) ; Tuất (19:00-20:59) ; Hợi (21:00-22:59)</td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Giờ Hắc Đạo</b></td>
                            <td>Tí (23:00-0:59) ; Dần (3:00-4:59) ; Mão (5:00-6:59) ; Tỵ (9:00-10:59) ; Thân (15:00-16:59) ; Dậu (17:00-18:59)</td>
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
                                <p>-<b> Tân</b> : “Bất hợp tương chủ nhân bất thường” - Không nên tiến hành trộn tương, chủ không được nếm qua</p>
                                <p>-<b> Hợi</b> : “Bất giá thú tất chủ phân trương” - Không nên tiến hành các việc liên quan đến cưới hỏi để tránh ly biệt</p>
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Khổng Minh Lục Diệu</b></td>
                            <td>
                                <p>Ngày: <b> Tốc Hỷ </b>-  tức ngày Tốt vừa.</p>
                                <p>Buổi sáng tốt, nhưng chiều xấu nên cần làm nhanh. Niềm vui nhanh chóng, nên dùng để mưu đại sự, sẽ thành công mau lẹ hơn. Tốt nhất là tiến hành công việc vào buổi sáng, càng sớm càng tốt.</p>
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
                                "{result.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                                "
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Thập Nhị Kiến Trừ</b></td>
                            <td>
                                <p><b>Trực Trừ</b></p>
                                <p><b> Nên làm</b> : Động đất, ban nền đắp nền, thờ cúng Táo Thần, cầu thầy chữa bệnh bằng cách mổ xẻ hay châm cứu, bốc thuốc, xả tang, khởi công làm lò nhuộm lò gốm, nữ nhân khởi đầu uống thuốc chữa bệnh.</p>
                                <p><b> Không nên</b> : </p>
                                <p><b>Chú ý</b> : Đẻ con nhằm ngày này khó nuôi, nên làm Âm Đức cho con, nam nhân kỵ khởi đầu uống thuốc.</p>
                            </td>
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
                                <p>Xuất hành hướng Tây Nam để đón 'Hỷ Thần'. Xuất hành hướng Tây Nam để đón 'Tài Thần'.
                                    Tránh xuất hành hướng Đông Bắc gặp Hạc Thần (xấu)</p>
                            </td>
                        </tr>
                        <tr>
                            <td className="title-row-table"><b>Giờ xuất hành Theo Lý Thuần Phong</b></td>
                            <td>
                                <p><b>Từ 11h-13h (Ngọ) và từ 23h-01h (Tý)</b> : Tin vui sắp tới, nếu cầu lộc, cầu tài thì đi hướng Nam. Đi công việc gặp gỡ có nhiều may mắn. Người đi có tin về. Nếu chăn nuôi đều gặp thuận lợi.</p>
                                <p><b>Từ 11h-13h (Ngọ) và từ 23h-01h (Tý)</b> : Tin vui sắp tới, nếu cầu lộc, cầu tài thì đi hướng Nam. Đi công việc gặp gỡ có nhiều may mắn. Người đi có tin về. Nếu chăn nuôi đều gặp thuận lợi.</p>
                                <p><b>Từ 11h-13h (Ngọ) và từ 23h-01h (Tý)</b> : Tin vui sắp tới, nếu cầu lộc, cầu tài thì đi hướng Nam. Đi công việc gặp gỡ có nhiều may mắn. Người đi có tin về. Nếu chăn nuôi đều gặp thuận lợi.</p>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </>
    );
}
export default DetailDays;