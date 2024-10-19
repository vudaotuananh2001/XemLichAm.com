import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../styles/inforday/inforday.css';

const InformationDay = () => {
    return (
        <div className="container pt-3 is-inforday">
            <h3>Lịch âm hôm nay</h3>
            <span className="banner">xem lịch âm hôm nay</span>
            <div className="row mt-3 detail-day">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 detail-days">
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày <b>Dương</b></p>
                        <Link>
                            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />Lịch :
                        </Link>
                        <span className="day">12-10-2024</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày <b>Âm Lịch:</b></p>
                        <span className="am-lich">12-10-2024</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày trong tuần: &nbsp;&nbsp;</p>
                        <b>Thứ Bảy</b>
                    </li>
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày &nbsp;<b>Kỷ Dậu</b> tháng <b>Kỷ Dậu</b> năm <b>Kỷ Dậu</b></p>
                    </li>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 detail-days mt-2">
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày <b>Bạch Hổ Đầu</b> : xuất hành, cầu tài đều được, đi đâu đều thông đạt cả</p>
                    </li>
                    <li className="d-flex align-items-center mt-4">
                        <span>&#10022;</span>
                        <p>Giờ:<b>Hoàng Đạo</b> : Tý (23-1), Dần (3-5), Mão (5-7), Ngọ (11-13), Mùi (13-15), Dậu (17-19)</p>
                    </li>
                </div>
            </div>
            <div className="mt-2 hagtag">
                <span className="banners">xem lịch âm</span>
                <span className="banners">ngày lịch âm</span>
                <span className="banners">xem ngày tốt xấu</span>
                <span className="banners">lịch âm 2024 hôm nay</span>
                <span className="banners">âm lich hôm nay là bao nhiêu</span>
            </div>
        </div>
    );
}

export default InformationDay;