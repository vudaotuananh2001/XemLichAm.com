import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import InformationDay from '../components/InformationDay';
import TableInfoDay from '../components/TableInforDay'
import TableInforMonth from '../components/TableInforMonth';
import DetailDays from '../components/DetailDay';
import Footer from '../components/Footer';
import '../styles/common.css';
const Home = () => {
    return (
        <>
            <Header />
            <div className="box-body-home">
                <InformationDay />
                <TableInfoDay />
                <TableInforMonth />
                <DetailDays />
                <Footer />
            </div>
        </>
    );
}

export default Home;