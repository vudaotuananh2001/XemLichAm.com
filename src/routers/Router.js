// Routers.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Positive from "../pages/Positive";
import FinDetailDay from '../pages/FindDetailDay';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doi-ngay-duong-sang-am" element={<Positive />} />
            <Route path="/am-lich/nam/:year/thang/:month/ngay/:day" element={<FinDetailDay />} />
        </Routes>
    );
}

export default Router;
