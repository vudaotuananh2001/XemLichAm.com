// Routers.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Positive from "../pages/Positive";
import FinDetailDay from '../pages/FindDetailDay';
import FindDetailMonth from '../pages/FinDetailMonth';
import FindDetaiYear from '../pages/FindDetaiYear';
const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doi-ngay-duong-sang-am" element={<Positive />} />
            <Route path="/am-lich/nam/:year/thang/:month/ngay/:day" element={<FinDetailDay />} />
            <Route path='/licham/nam/:year/thang/:month' element={<FindDetailMonth />} />
            <Route path='/lich-am/nam/:year' element={<FindDetaiYear />} />
            <Route path='/am-lich-thang-:month-nam-:year.html' element={<FindDetailMonth />} />
        </Routes>
    );
}

export default Router;
