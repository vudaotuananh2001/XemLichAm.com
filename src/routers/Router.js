// Routers.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Positive from "../pages/Positive"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doi-ngay-duong-sang-am" element={<Positive />} />
        </Routes>
    );
}

export default Router;
