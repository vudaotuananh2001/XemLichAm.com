import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Header from '../components/Header';
import Footer from "../components/Footer";
import TableInfoDay from "../components/TableInforDay";
import TableInforMonth from "../components/TableInforMonth";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    chiNgay,
    layGioHoangDao,
    getNameDay,
    getNameMonth,
    getNameYear,
    convertSolar2Lunar,
    rankOffWeek,
    layGioHoangDaoChiTiet,
    departureTime,
    getKhongMinh,
    lichTietKhi,
    ngayHoangDaoVaHacDao
  } from "../DataTime/FuntionTime.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "../styles/common.css";
const Positive = () => {
    const date = new Date();
    const [day, setDay] = useState(Number(date.getDate()));
    const [month, setMonth] = useState(Number(date.getMonth() + 1));
    const [year, setYear] = useState(Number(date.getFullYear()));

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
        departureTime: [],
        tietKhi :'',
        statusDay : [],
        tenKhongMinh : '',
        motaKhongMinh : '',
        inputValue:''
      });  

      const handleOnChangeInput = (e) => {
        const input = e.target.value;
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

        if (regex.test(input)) {
            const [inputDay, inputMonth, inputYear] = input.split('/').map(Number);
            setDay(inputDay);
            setMonth(inputMonth);
            setYear(inputYear);

            setNegativeDay((prevState) => ({
                ...prevState,
                inputValue: input,
            }));
        } else {
            console.log("Error Input Regex");
        }
      };
        
    useEffect(()=> {
        const chi = chiNgay(day, month, year);
        const nameDay = getNameDay(day, month, year);
        const gioHoangDao = layGioHoangDao(chi);
        const departure_Time = departureTime(chi);
        const detailZodiacHour = layGioHoangDaoChiTiet(chi);
        const ngayam = convertSolar2Lunar(day, month, year, 7);
        // Ngày dương lịch
        const ngayduong = `${day}-${month}-${year}`;
        // Tính toán thứ trong tuần của ngày
        const rank = rankOffWeek(day, month, year);
        const tietKhi = lichTietKhi(ngayduong);
        const nameMonth = getNameMonth(month, year);
        const nameYear = getNameYear(year);
        const statusDays = ngayHoangDaoVaHacDao(Number(month), Number(year));
        const getInforNgayAm  = ngayam.split('-');
        const getGiant = getKhongMinh(Number(getInforNgayAm[0]), Number(getInforNgayAm[1]));
        const tenKhongMinh = getGiant.name;
        const motaKhongMinh = getGiant.detail;
        setNegativeDay((prevState) => ({
            ...prevState,
            is_check_data: true,
            zodiac_hour: gioHoangDao,
            departureTime: departure_Time,
            detailZodiacHour: detailZodiacHour,
            nameDay: nameDay,
            nameMonth: nameMonth,
            nameYear: nameYear,
            negative_day: ngayam,
            positive_day: ngayduong,
            rank: rank,
            tietKhi : tietKhi,
            tenKhongMinh : tenKhongMinh,
            motaKhongMinh :motaKhongMinh,
            statusDay : statusDays
          }));
    },[day, month, year]);
    return (
        <>
            <Header />
            <div className="box-body-home">
                <div className="container container mx-0 body_home_page">
                    <h4 className="doi-ngay-duong">Đổi ngày dương sang âm</h4>
                    <div className="dercription">
                            Công cụ <b>Chuyển đổi ngày dương</b> <Link>
                                <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />  lịch:
                            </Link>
                            <b>sang âm lịch</b> giúp bạn chuyển đổi nhanh <b>ngày dương lịch</b> bất kỳ sang <b>ngày âm lịch </b>
                            tương ứng. Để bắt đầu sử dụng công cụ chuyển đổi bạn vui lòng nhấn ô bên dưới để chọn ngày dương lịch sau
                            đó nhấp vào nút chuyển đổi. Nếu ban không chọn ngày, hệ thống sẽ tự lấy ngày dương lịch hiện tại để chuyển đổi.
                    </div>
                    <div className="sider-bar">
                        <ul className="px-0">
                            <li><Link to={`/`}>Lịch âm</Link></li>
                            <li><Link to={`/doi-ngay-duong-sang-am`}>Đổi ngày dương sang âm</Link></li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-search-date">
                             <h5>Chọn ngày dương lịch bất kỳ:</h5>
                             <form>
                                <input type="text" placeholder="dd/mm/yyyy" onChange={handleOnChangeInput}></input>
                                <button type="submit">Chuyển đổi</button>
                             </form>
                             <h5 className="ket-qua">Kết quả chuyển đổi</h5>
                             <div className="mt-4 information-date">
                                <div className="the-label">
                                    <span className="icon">&#10022;</span>
                                    Ngày <b>Dương</b>
                                    <Link>
                                        <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />  Lịch:
                                    </Link>
                                    <span className="ngayDuong">{negativeDay.positive_day}</span>
                                </div>
                                <div className="the-label mt-3">
                                    <span className="icon">&#10022;</span>
                                    Ngày <b>Âm Lịch</b> :
                                    <span className="ngayAm">{negativeDay.negative_day}</span>
                                </div>
                                <div className="the-label mt-3">
                                    <span className="icon">&#10022;</span>
                                    Ngày trong tuần : <b>{negativeDay.rank}</b>
                                </div>
                                <div className="the-label mt-3">
                                    <span className="icon">&#10022;</span>
                                    Ngày <b>{negativeDay.tenKhongMinh}</b> : {negativeDay.motaKhongMinh}
                                </div>
                                <div className="the-label mt-3">
                                    <span className="icon">&#10022;</span>
                                    Ngày <b>Hoàng Đạo</b> : {negativeDay.zodiac_hour}
                                </div>
                             </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 table_information">
                            { negativeDay.is_check_data ?  <TableInfoDay negativeDay={negativeDay}/> : <>...Loading</> }
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <TableInforMonth  negativeDay = {negativeDay.statusDay}/>
                        </div>
                    </div>
                    <Footer />
                </div>
                <div className="quang_cao"></div>
               
            </div>
        </>

    );
}

export default Positive;