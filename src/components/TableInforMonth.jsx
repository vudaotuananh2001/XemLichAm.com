import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../styles/tableinformonth/tableinformonth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsTurnRight } from '@fortawesome/free-solid-svg-icons';

const TableInforMonth = ({ negativeDay }) => {
    const listDay = negativeDay.informationDayInMonth || [];
    const dayOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    
    const getFirstDayOfWeek = (year, month) => {
        const date = new Date(year, month - 1, 1);
        return (date.getDay() + 6) % 7; 
    };

    const year = negativeDay.years;
    const month = negativeDay.months;
    const firstDayOfWeek = getFirstDayOfWeek(year, month);
    
    // Create an array to represent the calendar days
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
    
    // Create the calendar grid
    const calendar = Array.from({ length: 6 }, () => Array(7).fill(null)); 

    let dayIndex = 0;
    for (let week = 0; week < calendar.length; week++) {
        for (let day = 0; day < calendar[week].length; day++) {
            if (week === 0 && day < firstDayOfWeek) {
                calendar[week][day] = null;
            } else if (dayIndex < days.length) {
                calendar[week][day] = days[dayIndex];
                dayIndex++;
            } else {
                calendar[week][day] = null;
            }
        }
    }

    // Filter out rows that only contain null values
    const filteredCalendar = calendar.filter(week => week.some(day => day !== null));

    return (
        <div className="mt-3">
            <div className="is_infor_day d-flex">
                <span className="good-day">MÀU ĐỎ: NGÀY TỐT</span>,&nbsp;&nbsp;
                <span className="bad-day">MÀU TÍM: NGÀY XẤU</span>
            </div>
            <div className="title-month d-flex justify-content-around align-items-center">
                <Link to={`/licham/nam/${year}/thang/${month-1}`}>
                    <span className="triangle-left" aria-label="Previous Month"></span>
                </Link>
                <span>LỊCH ÂM {month} NĂM {year}</span>
                <Link to={`/licham/nam/${year}/thang/${month+1}`}>
                    <span className="triangle-right" aria-label="Next Month"></span>
                </Link>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        {dayOfWeek.map((day, index) => (
                            <th key={index}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {filteredCalendar.map((week, weekIndex) => (
                        <tr key={weekIndex}>
                            {week.map((day, dayIndex) => {
                                const currentDayData = listDay.find(d => d.ngayDuong === day);
                                const dayOfWeekIndex = (firstDayOfWeek + day - 1) % 7;
                                const isSaturday = dayOfWeekIndex === 5; 
                                const isSunday = dayOfWeekIndex === 6; 
                                return (
                                    <td key={dayIndex}>
                                        {day ? (
                                            <Link to={`/am-lich/nam/${year}/thang/${month}/ngay/${day}`}>
                                                <div className="infors">
                                                    <span 
                                                        className="day"
                                                        style={{ color: isSunday ? 'red' : isSaturday ? 'green' : 'inherit' }}
                                                    >
                                                        {day}
                                                    </span>
                                                    <span 
                                                        className="circle" 
                                                        style={{
                                                            backgroundColor: currentDayData?.status === 1 
                                                                ? 'red' 
                                                                : currentDayData?.status === 2 
                                                                ? '#95149a' 
                                                                : 'white'
                                                        }}
                                                    ></span>
                                                </div>
                                                <h6 className="ngayam">
                                                    {currentDayData?.amLich || ''}
                                                </h6>
                                                <h6 className="namedayam">
                                                    {currentDayData?.dayCanChi || ''}
                                                </h6>
                                                <div className="h_event_day">
                                                    <FontAwesomeIcon className="icon_hover" icon={faArrowsTurnRight} />
                                                    <p>{currentDayData.sukien || 'Không có sự kiện'}</p>
                                                </div>
                                            </Link>
                                        ) : (
                                            // Ô trống
                                            <span></span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableInforMonth;
