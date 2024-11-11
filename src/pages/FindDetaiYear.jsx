import React, { useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import Footer from "../components/Footer";
import TableInforMonth from "../components/TableInforMonth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlack } from '@fortawesome/free-brands-svg-icons';
import { faMagnifyingGlass  } from '@fortawesome/free-solid-svg-icons';
import {
    getNameYear,
    ngayHoangDaoVaHacDao,
    titleOfYear
  } from "../DataTime/FuntionTime.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/common.css";

const FindDetaiYear =()=> {
    const objUrl = useLocation();
    const url = objUrl.pathname;
    const getInformationUrlDate = url.split('/');
    const year = Number(getInformationUrlDate[3]);
    const nameYears = getNameYear(year);
    const chiYear = nameYears.split(' ');
    
    const [findByYear, setFindByYear] = useState({
        statusDay : [],
        dayGood :[],
        dayBad:[],
        nameYear : '',
        titleYear : '',
        ngayLeDuong : [],
        ngaySuKienLichSu : [],
        khongMinh : [],
        statusMonthOne : [],
        statusMonthTwo : [],
        statusMonthThree : [],
        statusMonthFour   : [],
        statusMonthFive : [],
        statusMonthSix : [],
        statusMonthSeven : [],
        statusMontheEight : [],
        statusMonthNine : [],
        statusMonthTen : [],
        statusMonthEleven : [],
        statusMonthTwelve : [],
    });

    useEffect(() => {
        const titleYear = titleOfYear(chiYear[1]);
        const statusMonthOne = ngayHoangDaoVaHacDao(1, year);
        const statusMonthTwo = ngayHoangDaoVaHacDao(2, year); 
        const statusMonthThree = ngayHoangDaoVaHacDao(3, year);  
        const statusMonthFour = ngayHoangDaoVaHacDao(4, year);  
        const statusMonthFive = ngayHoangDaoVaHacDao(5, year);  
        const statusMonthSix = ngayHoangDaoVaHacDao(6, year);  
        const statusMonthSeven = ngayHoangDaoVaHacDao(7, year);  
        const statusMontheEight = ngayHoangDaoVaHacDao(8, year);  
        const statusMonthNine = ngayHoangDaoVaHacDao(9, year);  
        const statusMonthTen = ngayHoangDaoVaHacDao(10, year);  
        const statusMonthEleven = ngayHoangDaoVaHacDao(11, year);  
        const statusMonthTwelve = ngayHoangDaoVaHacDao(12, year);
        const nameYear = getNameYear(year);
        setFindByYear((prevState) => ({
            ...prevState,
            titleYear : titleYear,
            statusMonthOne : statusMonthOne,
            statusMonthTwo : statusMonthTwo,
            statusMonthThree : statusMonthThree,
            statusMonthFour : statusMonthFour,
            statusMonthFive: statusMonthFive,
            statusMonthSix : statusMonthSix,
            statusMonthSeven : statusMonthSeven,
            statusMontheEight : statusMontheEight,
            statusMonthNine : statusMonthNine,
            statusMonthTen : statusMonthTen,
            statusMonthEleven : statusMonthEleven,
            statusMonthTwelve : statusMonthTwelve,
            nameYear : nameYear
        }));
    }, [year]);
    const details = findByYear.titleYear;
    return (
        <>
            <Header />
            <div className="box-body-home">
                <div className="container body_home_page mx-0">
                <h4 className="doi-ngay-duong">Lịch âm năm {year}</h4>
                    <span className="find-by-month">
                        <Link to={`/#`}><FontAwesomeIcon className="icon" icon={faMagnifyingGlass} /> lịch</Link>
                        vạn niên năm {year}   
                    </span>
                    <h5 className="name-month">
                            Năm {findByYear.nameYear}
                            (Âm <Link to={`/#`}><FontAwesomeIcon className="icon" icon={faMagnifyingGlass} /> Lịch</Link>)
                    </h5>
                    <p className="detail-month">
                        {details.detail}
                    </p>
                    <div className="hashtag-month">
                        <p>
                            <small><FontAwesomeIcon className="icon" icon={faSlack} /></small>
                            <small>lịch năm {year}</small>
                            <small>âm lịch{year}</small>
                            <small>lịch năm {year}</small>
                            <small>lich nghỉ tết {year}</small>
                            <small>tết nguyên đán{year}</small>
                        </p>
                            
                    </div>
                    <div className="menu-iteam_link-year">
                        <ul>
                            <li><Link to={`/#`}>Lịch âm</Link></li>
                            <li><Link to={`/#`}>Năm {year}</Link></li>
                        </ul>
                    </div>
                    <h4 className="doi-ngay-duong mt-2">Chi tiết 12 tháng âm lịch năm {year}</h4>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthOne}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthTwo}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthThree}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthFour}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthFive}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthSix}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthSeven}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMontheEight}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthNine}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthTen}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthEleven}/>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-2">
                            <TableInforMonth  negativeDay = {findByYear.statusMonthTwelve}/>
                        </div>
                    </div>
                    <Footer />
                </div>
                <div className="quang_cao"></div>
            </div>
        </>
    );
}

export default FindDetaiYear;