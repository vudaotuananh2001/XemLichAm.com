// Routers.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Positive from "../pages/Positive";
import FinDetailDay from '../pages/FindDetailDay';
import FindDetailMonth from '../pages/FinDetailMonth';
const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doi-ngay-duong-sang-am" element={<Positive />} />
            <Route path="/am-lich/nam/:year/thang/:month/ngay/:day" element={<FinDetailDay />} />
            <Route path='/licham/nam/:year/thang/:month' element={<FindDetailMonth />} />
        </Routes>
    );
}

export default Router;
