import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import "../styles/header/header.css";

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header>
      <div className="container text-white time">
        <nav className="navbar navbar-expand-lg d-flex justify-content-between align-items-center">
          <Link className="navbar-brand text-white" to="/">
            XEM LỊCH ÂM.com
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav">
              <li className="d-flex align-items-center me-auto me-lg-0">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">
                    <FaClock className="me-2" />
                    <span>
                      {time.toLocaleTimeString("es-ES", {
                        hour12: false,
                      })}
                    </span>
                  </Link>
                </li>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  LỊCH ÂM HÔM NAY
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/doi-ngay-duong-sang-am"
                >
                  ĐỔI NGÀY ÂM DƯƠNG
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle text-white"
                  to="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  LỊCH THÁNG
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to={`/licham/nam/${year}/thang/1`}>
                      LỊCH ÂM THÁNG 1
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/2`}
                    >
                      LỊCH ÂM THÁNG 2
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/3`}
                    >
                      LỊCH ÂM THÁNG 3
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/4`}
                    >
                      LỊCH ÂM THÁNG 4
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/5`}
                    >
                      LỊCH ÂM THÁNG 5
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/6`}
                    >
                      LỊCH ÂM THÁNG 6
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/7`}
                    >
                      LỊCH ÂM THÁNG 7
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/8`}
                    >
                      LỊCH ÂM THÁNG 8
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/9`}
                    >
                      LỊCH ÂM THÁNG 9
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/10`}
                    >
                      LỊCH ÂM THÁNG 10
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/11`}
                    >
                      LỊCH ÂM THÁNG 11
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/licham/nam/${year}/thang/12`}
                    >
                      LỊCH ÂM THÁNG 12
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle text-white"
                  to="#"
                  id="navbarDropdownMenuLink2"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  LỊCH NĂM
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2022">
                      LỊCH ÂM NĂM 2022
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2023">
                      LỊCH ÂM NĂM 2023
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2024">
                      LỊCH ÂM NĂM 2024
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2025">
                      LỊCH ÂM NĂM 2025
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2026">
                      LỊCH ÂM NĂM 2026
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2027">
                      LỊCH ÂM NĂM 2027
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2028">
                      LỊCH ÂM NĂM 2028
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2029">
                      LỊCH ÂM NĂM 2029
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2030">
                      LỊCH ÂM NĂM 2030
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2031">
                      LỊCH ÂM NĂM 2031
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2032">
                      LỊCH ÂM NĂM 2032
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/lich-am/nam/2033">
                      LỊCH ÂM NĂM 2033
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Header;
