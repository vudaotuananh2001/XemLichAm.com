import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import InformationDay from "../components/InformationDay";
import TableInfoDay from "../components/TableInforDay";
import TableInforMonth from "../components/TableInforMonth";
import DetailDays from "../components/DetailDay";
import Footer from "../components/Footer";
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
  tinhThapNhiBatTu
} from "../DataTime/FuntionTime.js";
import "../styles/common.css";
const Home = () => {
  const [negativeDay, setNegativeDay] = useState({
    is_check_data: false,
    negative_day: "",
    positive_day: "",
    rank: "",
    zodiac_hour: "",
    nameDay: "",
    nameMonth: "",
    nameYear: "",
    departure_direction: [],
    detailZodiacHour: "",
    blackHour: "",
    departureTime: [],
    giant : {
      name : '',
      detail :''
    },
    tietKhi :'',
    lucdieu :{},
    ngayKy : [],
    thapNhi: {}, 
    startGood : [],
    startBad : [],
    nguHanhDay : {},
    thapNhiBatTus : {}
    
  });

  const day = new Date();
  const dd = day.getDate();
  const mm = day.getMonth() + 1;
  const yy = day.getFullYear();

  useEffect(() => {
    // Tính toán giá trị 'chi' trước
    const chi = chiNgay(dd, mm, yy);

    const nameDay = getNameDay(dd, mm, yy);
    
    const gioHoangDao = layGioHoangDao(chi);
    const departure_Time = departureTime(chi);
    const detailZodiacHour = layGioHoangDaoChiTiet(chi);
    const blackHour = layGioHacDao(chi);
    const datas = departureDirection(nameDay);

    const nameMonth = getNameMonth(dd, mm, yy);
    const nameYear = getNameYear(yy);

    // Chuyển đổi ngày âm
    const ngayam = convertSolar2Lunar(dd, mm, yy, 7);
    
    // Ngày dương lịch
    const ngayduong = `${dd}-${mm}-${yy}`;

    // Tính toán thứ trong tuần của ngày
    const rank = rankOffWeek(dd, mm, yy);
    const getInforNgayAm  = ngayam.split('-');
    const getGiant = getKhongMinh(Number(getInforNgayAm[0]), Number(getInforNgayAm[1]));
    
    const tietKhi = lichTietKhi(day);
     const lucdieu = getKhongMinhLucDieu(chi);
    const ngayKy = cacNgayKy(ngayam, day);
    const thapNhi = thapNhiKienTruc(ngayam, nameDay);
    const  inforStart = startInDay(nameDay, ngayam);
    const startBadDays = startBadDay(nameDay, ngayam);
    const nguHanhs = nguHanh(nameDay);
    const dataThapNhiBatTu = tinhThapNhiBatTu(ngayduong, rank);
    
    setNegativeDay((prevState) => ({
      ...prevState,
      is_check_data: true,
      zodiac_hour: gioHoangDao,
      departureTime: departure_Time,
      detailZodiacHour: detailZodiacHour,
      blackHour: blackHour,
      departure_direction: datas,
      nameDay: nameDay,
      nameMonth: nameMonth,
      nameYear: nameYear,
      negative_day: ngayam,
      positive_day: ngayduong,
      rank: rank,
      giant : getGiant,
      tietKhi : tietKhi,
      lucdieu :lucdieu,
      ngayKy : ngayKy,
      thapNhi : thapNhi,
      startGood : inforStart,
      startBad : startBadDays,
      nguHanhDay : nguHanhs,
      thapNhiBatTus : dataThapNhiBatTu
    }));
  }, [dd, mm, yy]);

  return (
    <>
      <Header />
      <div className=" box-body-home">
        <div className="container">
          {negativeDay.is_check_data ? <InformationDay negativeDay={negativeDay} /> : <></>}
          { negativeDay.is_check_data ?  <TableInfoDay negativeDay={negativeDay}/> : <></> }
          <div className="col-12 col-sm-12 col-md-12 col-lg-12">
            <TableInforMonth />
          </div>
          {negativeDay.is_check_data ? (
            <DetailDays negativeDay={negativeDay} />
          ) : (
            <>...nodata</>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
