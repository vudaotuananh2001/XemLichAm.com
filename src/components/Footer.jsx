import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../styles/footer/footer.css'
const Footer = () => {
    return (
        <>
            <div className="container px-0">
                <footer>
                    <h4>Nguồn gốc lịch âm</h4>
                    <p><b>Lịch âm</b> hay còn gọi là <b>lịch vạn niên</b> là loại lịch dựa
                        trên các chu kỳ của tuần trăng. Loại lịch duy nhất. Trên thực tế lịch âm là lịch của hồi giáo,
                        trong đó mỗi năm chỉ chứa đúng 12 tháng Mặt Trăng. Đặc trưng của lịch âm thuần túy,
                        như trong trường hợp của lịch Hồi giáo, là ở chỗ lịch này là sự liên tục của chu kỳ trăng tròn
                        và hoàn toàn không gắn liền với các mùa. Vì vậy <Link to={"/am-lich/nam/2024"}>năm âm lịch</Link> Hồi giáo ngắn hơn mỗi năm <b>dương lịch</b> khoảng
                        11 hay 12 ngày, và chỉ trở lại vị trí ăn khớp với năm dương lịch sau mỗi 33 hoặc 34 năm Hồi giáo.
                        Lịch Hồi giáo được sử dụng chủ yếu cho các mục đích tín ngưỡng tôn giáo. Tại Ả Rập Saudi lịch cũng
                        được sử dụng cho các mục đích thương mại.
                    </p>
                    <p>
                        Phần lớn các loại lịch khác, dù được gọi là <i>"âm lịch"</i> hay lịch vạn niên, trên thực tế chính
                        là <b>âm dương lịch</b>. Điều này có nghĩa là trong các loại lịch đó, các tháng được duy trì theo
                        chu kỳ của Mặt Trăng, nhưng đôi khi các tháng nhuận lại được thêm vào theo một số quy tắc nhất
                        định để điều chỉnh các chu kỳ trăng cho ăn khớp lại với năm <b>dương lịch</b>. Hiện nay, trong tiếng
                        Việt, khi nói tới âm lịch thì người ta nghĩ tới loại lịch được lập dựa trên các cơ sở và nguyên
                        tắc của lịch Trung Quốc, nhưng có sự chỉnh sửa lại theo UTC+7 thay vì UTC+8. Nó là một loại <b>âm
                            dương lịch</b> theo sát nghĩa chứ không phải âm lịch thuần túy. Do cách tính âm lịch đó khác với
                        Trung Quốc cho nên Tết Nguyên đán của người Việt Nam đôi khi không hoàn toàn trùng với Xuân tiết
                        của người Trung Quốc và các quốc gia chịu ảnh hưởng bởi văn hóa Trung Hoa và vòng Văn hóa chữ Hán khác.
                    </p>
                    <p>Do lịch âm thuần túy chỉ có 12 tháng âm lịch (tháng giao hội) trong mỗi năm, nên chu kỳ này (354,367 ngày) đôi khi cũng được gọi là năm âm lịch.</p>
                    <h4>Âm dương lịch</h4>
                    <p>
                        <b>Âm dương lịch</b> là loại lịch được nhiều nền văn hóa sử dụng, trong đó ngày tháng của lịch chỉ ra cả pha Mặt
                        Trăng (hay tuần trăng) và thời gian của năm Mặt Trời <b>(dương lịch)</b>. Nếu năm Mặt Trời được định nghĩa như
                        là năm chí tuyến thì <b>âm dương lịch</b> sẽ cung cấp chỉ thị về mùa; nếu nó được tính theo năm thiên văn thì
                        lịch sẽ dự báo chòm sao mà gần đó trăng tròn (điểm vọng) có thể xảy ra. Thông thường luôn có yêu cầu bổ
                        sung buộc một năm chỉ chứa một số tự nhiên các tháng, trong phần lớn các năm là 12 tháng nhưng cứ sau
                        mỗi 2 (hay 3) năm lại có một năm với 13 tháng.
                    </p>

                    <div className="row is-infor-company">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                            <h4>LỊCH ÂM</h4>
                            <p><Link to={"/"}>Âm lịch hôm nay</Link></p>
                            <p><Link to={"/doi-ngay-duong-sang-am"}>Đổi ngày dương sang âm</Link></p>
                            <p><Link to={"/am-lich/nam/2024"}>Lịch âm năm 2024</Link></p>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                            <h4>LỊCH VẠN NIÊN</h4>
                            <p><Link to={"/"}>Lịch vạn niên hôm nay</Link></p>
                            <p><Link to={"/am-lich/nam/2024"}>Lịch vạn niên 2024</Link></p>
                            <p><Link to={"/am-lich/nam/2025"}>Lịch vạn niên 2025</Link></p>
                            <p><Link to={"/am-lich/nam/2026"}>Lịch vạn niên 2026</Link></p>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                            <h4>TIỆN ÍCH ONLINE</h4>
                            <p><Link to={"/chuyen-doi-tieng-viet-moi"}>Chuyển đổi tiếng Việt mới</Link></p>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                            <h4>VỀ CHÚNG TÔI</h4>
                            <p><Link to={"/cotact"}>Liên hệ</Link></p>
                            <p><Link to={"/privacy-policy"}>Privacy policy</Link></p>
                            <p><Link to={"/terms-and-conditions"}>Terms and conditions</Link></p>
                            <Link to={""}>
                                <img src="../../public/images/dmca-badge-w150-2x1-02.pmg.png" alt=""></img>
                            </Link>
                        </div>
                    </div>
                </footer >
            </div >

        </>
    );
}
export default Footer;