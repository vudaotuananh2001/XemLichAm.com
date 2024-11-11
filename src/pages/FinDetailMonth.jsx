import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import TableInforMonth from "../components/TableInforMonth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlack } from '@fortawesome/free-brands-svg-icons';
import { faMagnifyingGlass  } from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";
import {
    getNameMonth,
    ngayHoangDaoVaHacDao,
    titleOfMonth, 
    ngayLeDuong,
    ngaySuKienLichSu,
    listKhongMinhLucDieuByMonth
  } from "../DataTime/FuntionTime.js";
import "../styles/common.css";

const FindDetailMonth =() => {
    const objUrl = useLocation();
    const url = objUrl.pathname;
    const getInformationUrlDate = url.split('/');
    const year = Number(getInformationUrlDate[3]);
    const month = Number(getInformationUrlDate[5]);
    const [findByMonth, setFindByMonth] = useState({
        statusDay : [],
        dayGood :[],
        dayBad:[],
        nameMonth : '',
        title : '',
        ngayLeDuong : [],
        ngaySuKienLichSu : [],
        khongMinh : []
    });
    
    useEffect(() => {
        const statusDays = ngayHoangDaoVaHacDao(month, year);
        const informationDayOfMonth = statusDays.informationDayInMonth;
        const dayGood = informationDayOfMonth.filter(filterStatusGood);
        function filterStatusGood(day) {
            return day.status === 1;
        }
        const dayBad = informationDayOfMonth.filter(filterStatusBad);
        function filterStatusBad(day) {
            return day.status === 2;
        }
        const nameMonth  = getNameMonth(month, year);
        const titleMonth = titleOfMonth(month);
        const leDuong =  ngayLeDuong(month);
        const suKienLichSu = ngaySuKienLichSu(month);
        const listKhongMinh = listKhongMinhLucDieuByMonth(month, year);
        
        setFindByMonth((prevState) => ({
            ...prevState,
            statusDay : statusDays,
            dayGood : dayGood,
            dayBad : dayBad,
            nameMonth : nameMonth,
            title : titleMonth,
            ngayLeDuong : leDuong,
            ngaySuKienLichSu : suKienLichSu,
            khongMinh : listKhongMinh
        }));
    }, [month, year]);
        const dayGood = findByMonth.dayGood;
        const dayBad = findByMonth.dayBad;
        const titles = findByMonth.title;
        const desription = titles.detail;
        const cacNgayLeDuong = findByMonth.ngayLeDuong;
        const suKienLichSu = findByMonth.ngaySuKienLichSu;
        const listKhongMinhs = findByMonth.khongMinh;
        
    return (
        <>
            <Header />
            <div className="box-body-home">
                <div className="container body_home_page mx-0">
                    <h4 className="doi-ngay-duong">Lịch âm tháng {month} năm {year}</h4>
                    <span className="find-by-month">
                        <Link to={`/#`}><FontAwesomeIcon className="icon" icon={faMagnifyingGlass} /> lịch</Link>
                        vạn niên tháng {month} năm {year}   
                    </span>
                    <h5 className="name-month">
                            Tháng {findByMonth.nameMonth}
                            (Âm <Link to={`/#`}><FontAwesomeIcon className="icon" icon={faMagnifyingGlass} /> Lịch</Link>)
                    </h5>
                    <p className="detail-month">
                        {desription}
                    </p>
                    <div className="hashtag-month">
                        <p>
                            <small><FontAwesomeIcon className="icon" icon={faSlack} /></small>
                            <small>lịch tháng {month} năm {year}</small>
                            <small>lịch âm tháng {month}/{year}</small>
                            <small>lịch dương tháng {month} năm {year}</small>
                            <small>lich thang {month}/{year}</small>
                        </p>
                            
                    </div>
                    <div className="menu-iteam_link-year">
                        <ul>
                            <li><Link to={`/#`}>Lịch âm</Link></li>
                            <li><Link to={`/#`}>Năm {year}</Link></li>
                            <li><Link to={`/#`}>Tháng {month}</Link></li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                            <TableInforMonth  negativeDay = {findByMonth.statusDay}/>
                        </div>
                        <div className="ngay_xau_tot">
                             <span className="ngay_tot">Màu đỏ:  ngày tốt  </span>,
                             <span className="ngay_xau">Màu tím: ngày xấu</span>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 l_day_good">
                            <h4>Ngày tốt tháng {month} (Hàng Đạo)</h4>
                            {
                                dayGood.map((day, index) => (
                                    <div key={index} className="chi_tiet_ngay_tot">
                                        <Link to={`/am-lich/nam/${year}/thang/${month}/ngay/${day.ngayDuong}`}>Ngày {day.ngayDuong} tháng 1 năm 2024</Link>
                                    </div>
                                ))
                            }
                                                        
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 l_day_bad">
                            <h4>Ngày xấu tháng {month} (Hắc Đạo)</h4>
                            {
                                dayBad.map((day, index) => (
                                    <div key={index} className="chi_tiet_ngay_xau">
                                        <Link to={`/am-lich/nam/${year}/thang/${month}/ngay/${day.ngayDuong}`}>Ngày {day.ngayDuong} tháng {month} năm 2024</Link>
                                    </div>
                                ))
                            }
                        </div>
                        <h4 className="event">Ngày lễ dương lịch tháng {month}</h4>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 secction_event_duong">
                            {
                                cacNgayLeDuong.map((value, index) => (
                                    <div key={index} className="l_event_ngay_duong">
                                        <span className="icon_event_duong">&#10022;</span>
                                        {value.day}
                                    </div>
                                ))
                            }
                        </div>
                        <h4 className="event">Sự kiện lịch tháng {month}</h4>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 secction_event_duong">
                            {
                                suKienLichSu.map((value, index) => (
                                    <div key={index} className="l_event_ngay_duong">
                                        <span className="icon_event_duong">&#10022;</span>
                                        {value.day}
                                    </div>
                                ))
                            }
                        </div>
                        <h4 className="event">Ngày xuất hành âm lịch</h4>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 secction_event_duong">
                            {
                                listKhongMinhs.map((value, index) => (
                                    <div key={index} className="l_event_ngay_duong">
                                        <span className="icon_event_duong">&#10022;</span>
                                        {value.day} - Ngày <b> {value.name}</b> : {value.detailKhongMinh}
                                    </div>
                                ))
                            }
                        </div>
                        <h4 className="event">Xem lịch âm các tháng khác</h4>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 menu_month_of_year">
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/1`}>Lịch âm tháng 1 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/3`}>Lịch âm tháng 3 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/5`}>Lịch âm tháng 5 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/7`}>Lịch âm tháng 7 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/9`}>Lịch âm tháng 9 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/11`}>Lịch âm tháng 11 năm {year}</Link>
                                </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 menu_month_of_year">
                        <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/2`}>Lịch âm tháng 2 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/4`}>Lịch âm tháng 4 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/6`}>Lịch âm tháng 6 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/8`}>Lịch âm tháng 8 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/10`}>Lịch âm tháng 10 năm {year}</Link>
                                </div>
                                <div className="s_link">
                                    <Link to={`/licham/nam/${year}/thang/12`}>Lịch âm tháng 12 năm {year}</Link>
                                </div>
                        </div>
                    </div>
                    <Footer />
                </div>
                <div className="quang_cao"></div>
            </div>
        </>
    );
}

export default FindDetailMonth;