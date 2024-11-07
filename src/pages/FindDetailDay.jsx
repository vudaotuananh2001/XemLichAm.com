import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import InformationDay from "../components/InformationDay";
import TableInfoDay from "../components/TableInforDay";
import TableInforMonth from "../components/TableInforMonth";
import DetailDays from "../components/DetailDay";
import Footer from "../components/Footer";
import { useLocation } from 'react-router-dom';
import "../styles/common.css";
import {
    chiNgay,
    layGioHoangDao,
    getNameDay,
    getNameMonth,
    getNameYear,
    convertSolar2Lunar,
    rankOffWeek,
    departureDirection,
    layGioHoangDaoChiTiet,
    layGioHacDao,
    departureTime,
    getKhongMinh,
    lichTietKhi,
    getKhongMinhLucDieu,
    cacNgayKy,
    thapNhiKienTruc, 
    startInDay,
    startBadDay, 
    nguHanh,
    tinhThapNhiBatTu,
    ngayHoangDaoVaHacDao
  } from "../DataTime/FuntionTime.js";
const FinDetailDay = () => {
    const objUrl = useLocation();
    const url = objUrl.pathname;
    const getInformationUrlDate = url.split('/');
    const yy = getInformationUrlDate[3];
    const mm = getInformationUrlDate[5];
    const dd = getInformationUrlDate[7]; 
   const fullInformationDate = `${dd}-${mm}-${yy}`;
    
    // Khởi tạo state bằng useState
    const [findByDay, setFindByDay] = useState({
        is_check_data: false,
        positive_day: "",
        negative_day: "",
        nameDay: "",
        nameMonth: "",
        nameYear: "",
        zodiac_hour: "",
        departureTime: [],
        giant : {
            name : '',
            detail :''
          },
        tietKhi :'',
        rank: "",
        lucdieu :{},
        detailZodiacHour: "",
        blackHour: "",
        lucdieu :{},
        ngayKy : [],
        thapNhi: {}, 
        startGood : [],
        startBad : [],
        nguHanhDay : {},
        thapNhiBatTus : {},
        statusDay : []
    });

    useEffect(() => {
        const ngayduong = fullInformationDate;
        const ngayam = convertSolar2Lunar(Number(dd), Number(mm), Number(yy), 7);
        const chi = chiNgay(Number(dd), Number(mm), Number(yy));
        const nameMonth = getNameMonth(Number(dd), Number(mm), Number(yy));
        const nameYear = getNameYear(Number(yy));
        const nameDay = getNameDay(Number(dd), Number(mm), Number(yy));  
        const gioHoangDao = layGioHoangDao(chi);
        const getInforNgayAm  = ngayam.split('-');
        const getGiant = getKhongMinh(Number(getInforNgayAm[0]), Number(getInforNgayAm[1]));
        const departure_Time = departureTime(chi);
        const tietKhi = lichTietKhi(ngayduong);
        const rank = rankOffWeek(Number(dd), Number(mm), Number(yy));
        const lucdieu = getKhongMinhLucDieu(chi);
        const detailZodiacHour = layGioHoangDaoChiTiet(chi);
        const blackHour = layGioHacDao(chi);
        const ngayKy = cacNgayKy(ngayam, ngayduong);
        const thapNhi = thapNhiKienTruc(ngayam, nameDay);
        const  inforStart = startInDay(nameDay, ngayam);
        const startBadDays = startBadDay(nameDay, ngayam);
        const nguHanhs = nguHanh(nameDay);   
        const dataThapNhiBatTu = tinhThapNhiBatTu(ngayduong, rank);
        const statusDays = ngayHoangDaoVaHacDao(Number(mm), Number(yy));
        const datas = departureDirection(nameDay);
        
        setFindByDay((prevState) => ({
            ...prevState,
            is_check_data: true,
            positive_day: ngayduong,
            negative_day : ngayam,
            nameDay : nameDay,
            nameMonth : nameMonth,
            nameYear : nameYear,
            zodiac_hour: gioHoangDao,
            departureTime: departure_Time,
            giant : getGiant,
            tietKhi : tietKhi,
            rank: rank,
            lucdieu : lucdieu,
            detailZodiacHour: detailZodiacHour,
            blackHour: blackHour,
            lucdieu :lucdieu,
            ngayKy : ngayKy,
            thapNhi : thapNhi,
            startGood : inforStart,
            startBad : startBadDays,
            nguHanhDay : nguHanhs,
            thapNhiBatTus : dataThapNhiBatTu,
            statusDay : statusDays,
            departure_direction: datas
        }));
    }, [dd, mm, yy]); // Mảng phụ thuộc để chạy lại khi các giá trị này thay đổi

    return (
        <>
            <Header />
            <div className="box-body-home">
                <div className="container">
                    <h4 className="mt-2 title-find-date">Xem lịch âm ngày {dd} tháng {mm} năm {yy}</h4>
                        <InformationDay  negativeDay={findByDay}/>
                        { findByDay.is_check_data ?  <TableInfoDay negativeDay={findByDay}/> : <>...Loading</> }
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                <TableInforMonth  negativeDay = {findByDay.statusDay}/>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                            {findByDay.is_check_data ? (
                                <DetailDays negativeDay={findByDay} />
                                ) : (
                                <>...Loading</>
                                )}
                            </div>
                        </div>
                        <Footer />
                </div>
            </div>
                
            
        </>
    );
}

export default FinDetailDay;
