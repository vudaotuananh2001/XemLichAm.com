import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSlack } from '@fortawesome/free-brands-svg-icons';
import '../styles/inforday/inforday.css';

const InformationDay = ({ negativeDay }) => {   
    const dataKhongMinh =  negativeDay.giant;
    const ngayDuong = negativeDay.positive_day;
    const detailDate = ngayDuong.split('-');
    const year = detailDate[2];
    
    return (
        <div className="container pt-3 is-inforday">
            {/* <h3>Lịch âm hôm nay</h3> */}
            <span className="banner">xem lịch âm hôm nay</span>
            <div className="row mt-3 detail-day">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 detail-days">
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày <b>Dương</b></p>
                        <Link>
                            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />Lịch :
                        </Link>
                        <span className="day">{negativeDay.positive_day}</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày <b>Âm Lịch:</b></p>
                        <span className="am-lich">{negativeDay.negative_day}</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày trong tuần: &nbsp;</p>
                        <b>{negativeDay.rank}</b>
                    </li>
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày &nbsp;<b>{negativeDay.nameDay}</b> tháng <b>{negativeDay.nameMonth}</b> năm <b>{negativeDay.nameYear}</b></p>
                    </li>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 detail-days mt-2">
                    <li className="d-flex align-items-center">
                        <span>&#10022;</span>
                        <p>Ngày <b>{dataKhongMinh.name}</b>: {dataKhongMinh.detail}</p>
                    </li>
                    <li className="d-flex align-items-center mt-4">
                        <span>&#10022;</span>
                        <p>Giờ:<b>Hoàng Đạo</b>: {negativeDay.zodiac_hour}</p>    
                    </li>
                </div>
            </div>
            {/* <div className="mt-2 hagtag">
                <span className="banners">xem lịch âm</span>
                <span className="banners">ngày lịch âm</span>
                <span className="banners">xem ngày tốt xấu</span>
                <span className="banners">lịch âm 2024 hôm nay</span>
                <span className="banners">âm lich hôm nay là bao nhiêu</span>
            </div> */}
            <div className="mt-2 hashtag-month">
                <p>
                    <small><FontAwesomeIcon className="icon" icon={faSlack} /></small>
                    <small>xem âm lịch</small>
                    <small>ngày lịch âm</small>
                    <small>xem ngày tốt xấu</small>
                    <small>lịch âm {year} hôm nay</small>
                    <small>âm lich hôm nay là bao nhiêu</small>
                </p>   
            </div>
        </div>
    );
}

export default InformationDay;
