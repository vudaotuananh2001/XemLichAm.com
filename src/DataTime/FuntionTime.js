import { gioXuatHanh,
    gioHoangDao, gioHacDao, detailGioHoangDao, 
    nguHanhChi, nguHanhCan, huongXuatHanh, khongMinhLucDieu
} from "./DataTime";

const dayOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const allCan = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const allChi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

const jdFormDate = (dd, mm, yy) => {
    var a = Math.floor((14 - mm) / 12);
    const y = yy + 4800  - a;
    const m = mm + 12 * a - 3;
    var jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
};

// tính ra can của ngày
const canNgay = (dd, mm, yy) => {
    const jd = jdFormDate(dd, mm, yy);
    return (jd + 9) % 10; 
};

// tính ra chi của ngày
const chiNgay = (dd, mm, yy) => {
    const jd = jdFormDate(dd, mm, yy);
    return (jd + 1) % 12; 
};

// lấy ra thông tin tên của ngày
const getNameDay =(dd, mm, yy)=> {
    const jd = jdFormDate(dd, mm, yy);
    const canDay = (jd + 9) % 10;
    const chiDay = (jd + 1) % 12;
    const nameCanDay = allCan[canDay];
    const nameChiDay  = allChi[chiDay];
    return `${nameCanDay} ${nameChiDay}`
}

// lấy ra thông tin tên của tháng
const getNameMonth =(dd, mm, yy)=> {
    const canNam = (yy + 6) % 10;
    const canMonth = (canNam * 2 + mm) % 10;
    const chiMonth = (mm ) % 12; 
    const canName = allCan[canMonth];
    const chiName = allChi[chiMonth];
    return `${canName} ${chiName}`;
}

// lấy ra thông tin tên của năm
const getNameYear =(yy)=> {
    const canYear = (yy + 6) % 10;
    const chiYear = (yy + 8) % 12;
    const canName = allCan[canYear];
    const chiName = allChi[chiYear];
    return `${canName} ${chiName}`;
}

// lấy ra list giờ hoàng đạo
const layGioHoangDao = (chi) => {
    const chiValue = allChi[chi]; 
    const result = gioHoangDao[chiValue] || []; 
    return result.join(",");
};

// lấy ra chi tiết giờ hoàng đạo
const layGioHoangDaoChiTiet = (chi)=>{
    const chiValue = allChi[chi]; 
    const result = detailGioHoangDao[chiValue] || []; 
    return result.join("; ");
}

// lấy ra danh sách giờ hắc đạo
const layGioHacDao =(chi)=>{
    const chiValue = allChi[chi]; 
    const result = gioHacDao[chiValue] || []; 
    return result.join("; ");
}


// Tính ngày Sóc (ngày bắt đầu của tháng âm lịch)
const getNewMoonDay = (k, timeZone) => {
    const T = k / 1236.85; // Chu kỳ thiên văn học
    const dr = Math.PI / 180;
    let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T * T - 0.000000155 * T * T * T;
    jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T * T) * dr);
    return Math.floor(jd1 + 0.5 + timeZone / 24);
};

// Tính tọa độ của Mặt Trời
const getSunLongitude = (jdn, timeZone) => {
    const T = (jdn - 2451545.0) / 36525;
    const dr = Math.PI / 180;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T * T - 0.00000048 * T * T * T;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T * T;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * dr);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) + 0.000290 * Math.sin(3 * M * dr);
    let L = L0 + DL;
    L = L * dr;
    L = L - Math.PI * 2 * (Math.floor(L / (Math.PI * 2)));
    return Math.floor(L / Math.PI * 6);
};

// Tính tháng âm lịch thứ 11 (gần với Tết âm lịch)
const getLunarMonth11 = (yy, timeZone) => {
    const off = jdFormDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.53058868);
    let monthStart = getNewMoonDay(k, timeZone);
    const sunLong = getSunLongitude(monthStart, timeZone);
    
    if (sunLong >= 9) {
        monthStart = getNewMoonDay(k - 1, timeZone);
    }
    return monthStart;
};

// Kiểm tra năm có nhuận không trong lịch âm
const getLeapMonthOffset = (a11, timeZone) => {
    const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    let last = 0;
    let arc = getSunLongitude(getNewMoonDay(k + 1, timeZone), timeZone);
    let i = 1;
    do {
        last = arc;
        arc = getSunLongitude(getNewMoonDay(k + i + 1, timeZone), timeZone);
        i++;
    } while (arc !== last && i < 14);
    return i - 1;
};

// Hàm chính để chuyển đổi từ dương lịch sang âm lịch
const convertSolar2Lunar = (dd, mm, yy, timeZone) => {
    const dayNumber = jdFormDate(dd, mm, yy);
    let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);

    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    
    const a11 = getLunarMonth11(yy, timeZone);
    const b11 = getLunarMonth11(yy + 1, timeZone);

    let lunarDay = dayNumber - monthStart + 1;
    let diff = Math.floor((monthStart - a11) / 29);
    let lunarMonth = diff + 11;
    let lunarYear = yy;

    if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
        }
    }

    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear = yy - 1;
    }

    return `${lunarDay}-${lunarMonth+1}-${lunarYear}`;
};

// lấy ra thứ mấy trong tuần 
const rankOffWeek =(dd,mm,yy)=> {
    const jd = jdFormDate(dd,mm,yy);
    const rank = (jd+1) %7;
    return dayOfWeek[rank];
}

// lấy ra hướng xuất hành theo chi 
const departureDirection =(chi)=> {
    const chivalues = allChi[chi];
    const data = huongXuatHanh[chivalues];
    return data;
}

// lấy ra giờ xuất hành theo chi
 const departureTime =(chi)=> {
    const chiValue = allChi[chi];
    const result = gioXuatHanh[chiValue];
    return result;
 }

 // get infor off day name can
 const getInforDayCan = (can) => {
    const data = nguHanhCan[can];
    return data;
 }

 // get infor off day name chi
 const getInforDayChi =(chi)=> {
    const result = nguHanhChi[chi];
    return result;
 }

 const getKhongMinh =(dd, mm)=> {
        
    if(mm === 1 || mm === 4 || mm===7 || mm === 10){
        if(dd ===6 || dd===12 || dd ===18 || dd ===24 || dd === 30){
            return {
                name :"Hảo Thương",
                detail :"Xuất hành thuận lợi, gặp người lớn vừa lòng, làm việc việc như ý muốn, áo phẩm vinh quy. "
            }
        }
       else if(dd === 5 || dd === 11 || dd === 17 || dd === 23 || dd === 29){
            return {
                name :" Đạo Tặc",
                detail :"Rất xấu. Xuất hành bị hại, mất của. "
            }
        }
        else if(dd === 4 || dd === 10 || dd === 16 || dd === 22 || dd === 28){
            return {
                name :"Thuần Dương",
                detail :"Xuất hành tốt, lúc về cũng tốt, nhiều thuận lợi, được người tốt giúp đỡ, cầu tài được như ý muốn, tranh luận thường thắng lợi.  "
            }
        }
       else if(dd ===3 || dd === 9 || dd === 15 || dd === 21 || dd === 27){
            return {
                name :"Kim Dương",
                detail :"Xuất hành tốt, có quý nhân phù trợ, tài lộc thông suốt, thưa kiện có nhiều lý phải. "
            }
        }
        else if(dd === 2 || dd === 8 || dd === 14 || dd === 20 || dd === 26){
            return {
                name :"Kim Thổ",
                detail :"Ra đi nhỡ tàu, nhỡ xe, cầu tài không được, trên đường đi mất của, bất lợi. "
            }
        }
        else {
            return {
                name :"Đường Phong",
                detail :"Rất tốt, xuất hành thuận lợi, cầu tài được như ý muốn, gặp quý nhân phù trợ."
            }
        }
    }else if(mm ===2 || mm===5 || mm ===8 || mm === 11){
        if(dd === 1 || dd === 9 || dd === 17 || dd === 25){
            return {
                name : "Thiên Đạo",
                detail : "Xuất hành cầu tài nên tránh, dù được cũng rất tốn kém, thất lý mà thua. "
            }
        }
        else if(dd === 8 || dd === 16 || dd === 24 || dd === 30){
            return {
                name : "Thiên Thương",
                detail : "Xuất hành để gặp cấp trên thì tuyệt vời, cầu tài thì được tài. Mọi việc đều thuận lợi. "
            }
        }
        else if(dd === 7 || dd === 15 || dd === 23){
            return {
                name : "Thiên Hầu",
                detail : "Xuất hành dầu ít hay nhiều cũng cãi cọ, phải tránh xẩy ra tai nạn chảy máu, máu sẽ khó cầm. "
            }
        }
        else if(dd === 6 || dd === 14 || dd === 22){
            return {
                name : "Thiên Dương",
                detail : "Xuất hành tốt, cầu tài được tài. Hỏi vợ được vợ. Mọi việc đều như ý muốn. "
            }
        }
        else if(dd === 2 || dd === 10 || dd === 18 || dd === 26){
            return {
                name : "Thiên Môn",
                detail : "Xuất hành làm mọi việc đều vừa ý, cầu được ước thấy mọi việc đều thành đạt.  "
            }
        }
        else if(dd === 3 || dd === 11 || dd === 19 || dd === 27){
            return {
                name : "Thiên Đường",
                detail : "Xuất hành tốt, quý nhân phù trợ, buôn bán may mắn, mọi việc đều như ý.  "
            }
        }
        else if(dd === 4 || dd === 12 || dd === 20 || dd === 28){
            return {
                name : "Thiên Tài",
                detail : "Nên xuất hành, cầu tài thắng lợi. Được người tốt giúp đỡ. Mọi việc đều thuận. "
            }
        }else {
            return {
                name : "Thiên Tặc",
                detail : "Xuất hành xấu, cầu tài không được. Đi đường dễ mất cắp. Mọi việc đều rất xấu. "
            }
        }
    }
    else {
        if(dd === 2 || dd === 10 || dd === 18 || dd === 26){
            return {
                name :"Bạch Hổ Đầu",
                detail :"Xuất hành, cầu tài đều được. Đi đâu đều thông đạt cả."
            }
        }
         if(dd === 3 || dd===11 || dd === 19 || dd === 27){
            return {
                name :"Bạch Hổ Kiếp",
                detail :"Xuất hành, cầu tài được như ý muốn, đi hướng Nam và Bắc rất thuận lợi."
            }
        }
         if(dd === 4 || dd === 12 || dd === 20 || dd === 28){
            return {
                name :"Bạch Hổ Túc",
                detail :"Cấm đi xa, làm việc gì cũng không thành công. Rất xấu trong mọi việc."
            }
        }
         if(dd === 5 || dd === 13 || dd === 21 || dd === 29){
            return {
                name :"Huyền Vũ",
                detail :"Xuất hành thường gặp cãi cọ, gặp việc xấu, không nên đi. "
            }
        }
         if(dd === 2 || dd === 9 || dd === 17){
            return {
                name :" Chu Tước",
                detail :"Xuất hành, cầu tài đều xấu. Hay mất của, kiện cáo thua vì đuối lý. "
            }
        }
         if(dd === 8 || dd === 16 || dd === 26 || dd ===30){
            return {
                name :"Thanh Long Túc",
                detail :"Đi xa không nên, xuất hành xấu, tài lộc không có. Kiện cáo cũng đuối lý. "
            }
        }
         if(dd === 7 || dd === 15 || dd === 25 || dd === 23){
            return {
                name :"Thanh Long Kiếp",
                detail :"Xuất hành 4 phương, 8 hướng đều tốt, trăm sự được như ý.  "
            }
        }
        if(dd === 6 || dd === 14 || dd === 22){
            return {
                name :"Thanh Long Đâu",
                detail :"Xuất hành nên đi vào sáng sớm. Cỗu tài thắng lợi. Mọi việc như ý. "
            } 
        }
    }
 }


 const lichTietKhi = (dd) => {
    let tietKhi  ='';
    const day = Number(dd.getDate());
    const month = Number(dd.getMonth() + 1);
    console.log(day, month);
    
    if(day >= 4 && day < 18 && month === 2){
        tietKhi = 'Lập Xuân';
    }else if((month === 2 && day >= 18) || (month === 3 && day < 5)) {
        tietKhi ='Vũ Thủy';
    }else if(month === 3 && day >= 5 && day < 20){
        tietKhi ='Kinh Trâm';
    }else if((day >= 20 && month === 3) || (day < 4 && month === 4)){
        tietKhi ='Xuân Phân';
    }else if(day >= 4 && day < 20  && month === 4){
        tietKhi = 'Thanh Minh';
    }else if((day >= 20 && month === 4) || (day < 5 && month === 5)){
        tietKhi = 'Cố Vũ' 
    }else if(day >= 5 && day < 21 && month === 5){
        tietKhi = 'Lập Hạ';
    }else if((day >= 21 && month === 5) || (day < 5 && month === 6 )){
        tietKhi ='Tiểu mãn';
    }else if(day >= 5 && day < 21 && month === 6){
        tietKhi = 'Mang chủng';
    }else if((day >=21  && month === 6) || (day < 7 && month === 7)){
        tietKhi = 'Hạ Chí';
    }else if(day >= 7 && day < 22 && month === 7){
        tietKhi = 'Tiểu Thử'
    }else if((day >= 22 && month === 7) || (day < 7 && month === 8 )){
        tietKhi = 'Đại Thử';
    }else if(day >= 7 && day < 23 & month === 8){
        tietKhi = 'Lập Thu';
    }else if((day >= 23 && month === 8) || (day < 7 && month === 9)){
        tietKhi ='Xử Thử';
    }else if(day >= 7 && day < 23 && month === 9){
        tietKhi = 'Bạch Lộ';
    }else if ((day >= 23 && month === 9) || (day < 8 && month === 10)){
        tietKhi = 'Thu Phân';
    }else if(day >= 8 && day < 23 && month === 10){
        tietKhi = 'Hán Lộ';
    }else if((day >= 23 && month === 10) || (day < 7 && month === 11)){
        tietKhi = 'Sương Giáng';
    }else if(day >= 7 && day < 22 && month === 11){
        tietKhi = 'Lập Đông';
    }else if((day > 22 && month === 11 ) || (day < 7 && month === 12)){
        tietKhi = 'Tiểu tuyết';
    }else if(day >= 7 && day <21 && month === 12 ){
        tietKhi ='Đại Tuyết';
    }else if((day >= 21 && month === 12) || (day < 5 && month === 1)){
        tietKhi = 'Đông Chí';
    }else if(day >= 5 && day < 20 && month === 1){
        tietKhi = 'Tiểu Hàn';
    }else {
        tietKhi = 'Đại Hàn';
    }
    return tietKhi;
 }

 const getKhongMinhLucDieu =(chi)=> {
    const valueChi = allChi[chi];
    console.log(valueChi);
    return khongMinhLucDieu[valueChi];
 }


export { canNgay, chiNgay, 
    jdFormDate, layGioHoangDao ,getNameDay,
    getNameMonth, getNameYear, convertSolar2Lunar,rankOffWeek,
    departureDirection, layGioHoangDaoChiTiet, layGioHacDao, departureTime,
    getInforDayCan, getInforDayChi, getKhongMinh, lichTietKhi, getKhongMinhLucDieu
};
