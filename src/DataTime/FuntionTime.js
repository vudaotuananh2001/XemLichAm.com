import { gioXuatHanh,
    gioHoangDao, gioHacDao, detailGioHoangDao, 
    nguHanhChi, nguHanhCan, khongMinhLucDieu, thapNhiBatTu, ngayHoangDaovaHacDao
} from "./DataTime";

const dayOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const allCan = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const allChi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function INT(d) {
    return Math.floor(d);
}

// Hàm tính ngày Julian từ ngày, tháng, năm
const jdFormDate = (dd, mm, yy) => {
    let a = INT((14 - mm) / 12);
    let y = yy + 4800 - a;
    let m = mm + 12 * a - 3;
    let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    }
    return jd;
};

// Tính ngày Sóc (ngày bắt đầu của tháng âm lịch)
const getNewMoonDay = (k, timeZone) => {
    let T = k / 1236.85;
    let T2 = T * T;
    let T3 = T2 * T;
    let dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * M * dr);
    C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * Mpr * dr);
    C1 -= 0.0004 * Math.sin(3 * Mpr * dr);
    C1 += 0.0104 * Math.sin(2 * F * dr) - 0.0051 * Math.sin((M + Mpr) * dr);
    C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
    C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
    C1 += 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);

    let deltat;
    if (T < -11) {
        deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    let JdNew = Jd1 + C1 - deltat;
    return INT(JdNew + 0.5 + timeZone / 24);
};

// Tính tọa độ của Mặt Trời
const getSunLongitude = (jdn, timeZone) => {
    let T = (jdn - 2451545.5 - timeZone / 24) / 36525;
    let T2 = T * T;
    let dr = Math.PI / 180;
    let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(2 * dr * M) + 0.000290 * Math.sin(3 * dr * M);
    let L = L0 + DL;
    let omega = 125.04 - 1934.136 * T;
    L -= 0.00569 + 0.00478 * Math.sin(omega * dr);
    L = L * dr;
    L -= Math.PI * 2 * INT(L / (Math.PI * 2));
    return INT(L / Math.PI * 6);
};

// Tính tháng âm lịch thứ 11 (gần với Tết âm lịch)
const getLunarMonth11 = (yy, timeZone) => {
    let off = jdFormDate(31, 12, yy) - 2415021;
    let k = INT(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    let sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
};

// Kiểm tra năm có nhuận không trong lịch âm
const getLeapMonthOffset = (a11, timeZone) => {
    let k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
};

const convertSolar2Lunar = (dd, mm, yy, timeZone) => {
    let dayNumber = jdFormDate(Number(dd), Number(mm), Number(yy));
    let k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;

    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
    }

    let lunarDay = dayNumber - monthStart + 1;
    let diff = INT((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;

    if (b11 - a11 > 365) {
        let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }

    if (lunarMonth > 12) {
        lunarMonth -= 12;
    }

    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }

    return `${lunarDay}-${lunarMonth}-${lunarYear}`;
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
    const year = Number(yy); 
    const canYear = (year + 6) % 10;
    const chiYear = (year + 8) % 12;
    const canName = allCan[canYear];
    const chiName = allChi[chiYear];
    return `${canName} ${chiName}`;
}

// lấy ra list giờ hoàng đạo
const layGioHoangDao = (chi) => {
    const chiValue = allChi[chi]; 
    const result = gioHoangDao[chiValue] || []; 
    return result.join(", ");
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

// lấy ra thứ mấy trong tuần 
const rankOffWeek =(dd,mm,yy)=> {
    const jd = jdFormDate(dd,mm,yy);
    const rank = (jd+1) %7;
    return dayOfWeek[rank];
}

// lấy ra hướng xuất hành theo chi 
const departureDirection =(name)=> {
    const nameDay = name.split(' ');
    const chivalues = nameDay[0];

    let dataHuongXuatHanh = [];
    // Hỷ Thần
    if(chivalues === 'Giáp' || chivalues === 'Kỷ'){
        dataHuongXuatHanh.push('Hướng Đông Bắc');
    }else if(chivalues === 'Ất' || chivalues === 'Canh'){
        dataHuongXuatHanh.push('Hướng Tây Bắc');
    }else if(chivalues === 'Bính' || chivalues === 'Tân'){
        dataHuongXuatHanh.push('Hướng Tây Nam');
    }
    else if(chivalues === 'Mậu' || chivalues === 'Quý'){
        dataHuongXuatHanh.push('Hướng Đông Nam');
    }else{
        dataHuongXuatHanh.push('Hướng chính Nam');
    }

    // Thần Tài
    if(chivalues === 'Giáp' || chivalues === 'Kỷ'){
        dataHuongXuatHanh.push('Hướng Đông Nam');
    }else if(chivalues === 'Bính' || chivalues === 'Đinh'){
        dataHuongXuatHanh.push('Hướng Đông');
    }else if(chivalues === 'Mậu'){
        dataHuongXuatHanh.push('Hướng Bắc');
    }
    else if(chivalues === 'Kỷ'){
        dataHuongXuatHanh.push('Hướng Nam');
    }else if(chivalues === 'Canh' || chivalues === 'Tân'){
        dataHuongXuatHanh.push('Hướng Tây Nam');
    }else if(chivalues === 'Nhâm'){
        dataHuongXuatHanh.push('Hướng Tây');
    }else {
        dataHuongXuatHanh.push('Hướng Tây Bắc'); 
    }

    // Hạc Thần
   if(name === 'Kỷ Dậu' || name === 'Canh Tuất' || name === 'Tân Hợi' || name === 'Nhâm Tý' || name === 'Quý Sửu' || name === 'Giáp Dần'){
        dataHuongXuatHanh.push('Hướng Đông Bắc');
    } else if(name === 'Ất Mão' || name === 'Bính Thìn' || name === 'Đinh Tỵ' || name === 'Mậu Ngọ' || name === 'Kỷ Mùi'){
        dataHuongXuatHanh.push('Hướng Đông');
    } else if(name === 'Canh Thân' || name === 'Tân Dậu' || name === 'Nhâm Tuất' || name === 'Quý Hợi' || name === 'Giáp Tý' || name === 'Ất Sửu'){
        dataHuongXuatHanh.push('Hướng Đông Nam');
    } else if(name === 'Bính Dần' || name === 'Đinh Mão' || name === 'Mậu Thìn' || name === 'Kỷ Tỵ' || name === 'Canh Ngọ'){
        dataHuongXuatHanh.push('Hướng Nam');
    }else if(name === 'Tân Mùi' || name === 'Nhâm Thân' || name === 'Quý Dậu' || name === 'Giáp Tuất' || name === 'Ất Hợi' || name === 'Bính Tý'){
        dataHuongXuatHanh.push('Hướng Tây Nam');
    }else if(name === 'Đinh Sửu' || name === 'Mậu Dần' || name === 'Kỷ Mão' || name === 'Canh Thìn' || name === 'Tân Tỵ'){
        dataHuongXuatHanh.push('Hướng Tây');
    }else if(name === 'Nhâm Ngọ' || name === 'Quý Mùi' || name === 'Giáp Thân' || name === 'Ất Dậu' || name === 'Bính Tuất' || name === 'Đinh Hợi'){
        dataHuongXuatHanh.push('Hướng Tây Bắc');
    }else if(name === 'Mậu Tý' || name === 'Kỷ Sửu' || name === 'Canh Dần' || name === 'Tân Mão' || name === 'Nhâm Thìn'){
        dataHuongXuatHanh.push('Hướng Tây');
    }
    return dataHuongXuatHanh;
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

// lấy thông tin ngày khổng minh
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
         if(dd === 1 || dd === 9 || dd === 17){
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

// lấy thông tin các lịch tiết khí
 const lichTietKhi = (dd) => {
    let tietKhi  ='';
    const ngayDuong = dd.split('-');
    const day = Number(ngayDuong[0]);
    const month = Number(ngayDuong[1]);
    
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

 // Lấy thông tin ngày khổng minh lục diệu
 const getKhongMinhLucDieu =(chi)=> {
    const valueChi = allChi[chi];
    return khongMinhLucDieu[valueChi];
 }

// lấy thông tin các ngày kỵ
 const cacNgayKy = (dd, valueday) => { 
    const ngayAm = dd.split('-');
    const day = Number(ngayAm[0]);
    const month = Number(ngayAm[1]);
    const years = Number(ngayAm[2]);
    const ngayDuong = valueday.split('-');
    const nameDay = getNameDay(ngayDuong[0], ngayDuong[1], ngayDuong[2]);
    const canNameDay = nameDay.split(' ');
    const chiNameDay = nameDay.split(' ');

    const nameYear = getNameYear(years);
    const nameCanYear = nameYear.split(' ');
    let ngayKy = [];

    // Ngày Tam Nương
    if ([3, 18, 22, 27].includes(day)) {
        ngayKy.push({
            name: 'Ngày Tam Nương',
            detail: 'Là ngày xấu, ngày này kỵ tiến hành các việc trọng đại như khai trương, xuất hành, cưới hỏi, động thổ, sửa chữa hay cất nhà,...'
        });
    }

    // Ngày Nguyệt Kỵ
    if ([5, 14, 23].includes(day)) {
        ngayKy.push({
            name: 'Ngày Nguyệt Kỵ',
            detail: '“Mùng năm, mười bốn, hai ba - Đi chơi còn thiệt, nữa là đi buôn ...”'
        });
    }

    // Ngày Dương Công Kỵ Nhật
    const dcknDays = [
        { day: 13, month: 1 }, { day: 11, month: 2 }, { day: 9, month: 3 }, 
        { day: 7, month: 4 }, { day: 5, month: 5 }, { day: 3, month: 6 }, 
        { day: 8, month: 7 }, { day: 27, month: 7 }, { day: 27, month: 8 },
        { day: 25, month: 9 }, { day: 23, month: 10 }, { day: 22, month: 11 }, 
        { day: 19, month: 12 }
    ];

    if (dcknDays.some(d => d.day === day && d.month === month)) {
        ngayKy.push({
            name: 'Ngày Dương Công Kỵ Nhật',
            detail: 'Là ngày xấu, trăm sự đều không nên làm. Đặc biệt rất xấu cho: động thổ, tôn tạo tu sửa, khởi công, cất nóc, xây mộ phần, an táng...'
        });
    }

    // Ngày Sát Chủ Dương
    const satChuDươngMonths = {
        'Tý': [2],
        'Sửu': [2, 3, 7, 9],
        'Tuất': [4],
        'Thìn': [5, 6, 8, 10, 12],
        'Mùi': [11]
    };

    if (satChuDươngMonths[chiNameDay[1]]?.includes(month)) {
        ngayKy.push({
            name: 'Ngày Sát Chủ Dương',
            detail: 'Ngày này kỵ tiến hành các việc liên quan đến xây dựng, cưới hỏi, buôn bán, mua bán nhà, nhận việc, đầu tư.'
        });
    }

    //  ngày sát chủ dương
    const satChuAmMonth = {
        'Tý' : [1],
        'Tỵ' : [2],
        'Mùi' : [3],
        'Mão' : [4],
        'Thân' : [5],
        'Tuất' : [6],
        'Hợi': [7],
        'Sửu' : [8],
        'Ngọ' : [9],
        'Dậu' : [10],
        'Dần' : [11],
        'Thìn' : [12]
    }
    if (satChuAmMonth[chiNameDay[1]]?.includes(month)) {
        ngayKy.push({
            name: 'Ngày Sát Chủ Âm',
            detail: 'Ngày Sát Chủ Âm là ngày kỵ các việc về mai táng, tu sửa mộ phần.'
        });
    }

    // Ngày thụ tử
    const thuTu = {
        'Tuất' : [1],
        'Thìn' : [2],
        'Hợi' : [3],
        'Tỵ' : [4],
        'Tí' : [5],
        'Ngọ' : [6],
        'Sửu': [7],
        'Mùi' : [8],
        'Dần' : [9],
        'Thân' : [10],
        'Mão' : [11],
        'Dậu' : [12]
    }

    if (thuTu[chiNameDay[1]]?.includes(month)) {
        ngayKy.push({
            name: 'Ngày Thụ Tử',
            detail: 'Ngày này trăm sự đều kỵ không nên tiến hành bất cứ việc gì.'
        });
    }

    // ngày Thần Thất
    if (
    (nameCanYear[0] === 'Giáp' && (canNameDay[0] === 'Ngọ' || canNameDay[0] === 'Mùi')) ||
    (nameCanYear[0] === 'Ất' && (canNameDay[0] === 'Thìn' || canNameDay[0] === 'Tỵ')) ||
    (nameCanYear[0] === 'Bính' && (canNameDay[0] === 'Tí' || canNameDay[0] === 'Sửu' || canNameDay[0] === 'Dần' || canNameDay[0] === 'Mão')) ||
    (nameCanYear[0] === 'Đinh' && (canNameDay[0] === 'Tuất' || canNameDay[0] === 'Hợi')) ||
    (nameCanYear[0] === 'Mậu' && (canNameDay[0] === 'Thân' || canNameDay[0] === 'Dậu'))
) {
    ngayKy.push({
        name: 'Kim Thần Thất',
        detail: 'Tránh làm những công việc quan trọng, đi xa, ký kết hợp đồng, hay bắt đầu dự án lớn...'
    });
}
    return ngayKy;
};

// funtion lấy ra thông tin các trực theo ngày tháng
const thapNhiKienTruc = (ngayAmLich, nameDay) => {
    const day = ngayAmLich.split('-');
    const month = Number(day[1]); 
    const name = nameDay.split(' ');
    const chiDay = name[1]; 
    const kienTruData = {
        1: {
            name: 'Trực Kiến',
            description1 : "Khai trương, nhậm chức, cưới hỏi, trồng cây, đền ơn đáp nghĩa. Xuất hành đặng lợi, sinh con rất tốt.",
            description2 : "Động thổ, chôn cất, đào giếng, lợp nhà."
        },
        2: {
            name: 'Trực Trừ',
            description1 : " Động đất, ban nền đắp nền, thờ cúng Táo Thần, cầu thầy chữa bệnh bằng cách mổ xẻ hay châm cứu, bốc thuốc, xả tang, khởi công làm lò nhuộm lò gốm, nữ nhân khởi đầu uống thuốc chữa bệnh.",
            description3 : "Đẻ con nhằm ngày này khó nuôi, nên làm Âm Đức cho con, nam nhân kỵ khởi đầu uống thuốc."
        },
        3: {
            name: 'Trực Mãn',
            description1 : "Xuất hành, đi đường thủy, cho vay, thu nợ, mua hàng, bán hàng, nhập kho, đặt táng, kê gác, sửa chữa, lắp đặt máy, thuê thêm người, vào học kỹ nghệ, làm chuồng gà ngỗng vịt.",
            description2 : "Lên quan lãnh chức, uống thuốc, vào làm hành chính, dâng nộp đơn từ."
        },
        4: {
            name: 'Trực Bình',
            description1 : "Nhập vào kho, đặt táng, gắn cửa, kê gác, đặt yên chỗ máy, sửa chữa làm tàu, khai trương tàu thuyền, các việc bồi đắp thêm ( như bồi bùn, đắp đất, lót đá, xây bờ kè.) Lót giường đóng giường, thừa kế tước phong hay thừa kế sự nghiệp, các vụ làm cho khuyết thủng ( như đào mương, móc giếng, xả nước.)"
        },
        5: {
            name: 'Trực Định',
            description1 : "Động thổ, san nền, đắp nền, làm hay sửa phòng bếp, lắp đặt máy móc, nhập học, làm lễ cầu thân, nộp đơn dâng sớ, sửa hay làm tàu thuyền, khai trương tàu thuyền, khởi công làm lò. Mua nuôi thêm súc vật.",
            description2 : "Thưa kiện, xuất hành đi xa"
        },
        6: {
            name: 'Trực Chấp',
            description1 : " Lập khế ước, giao dịch, động thổ san nền, cầu thầy chữa bệnh, đi săn thú cá, tìm bắt trộm cướp. Xây đắp nền-tường.",
            description2 : "Dời nhà, đi chơi xa, mở cửa hiệu buôn bán, xuất tiền của."
        },
        7: {
            name: 'Trực Phá',
            description1 : "Là ngày Nhật Nguyệt tương xung. Ngày có trực Phá muôn việc làm vào ngày này đều bất lợi, chỉ nên phá dỡ nhà cửa."
        },
        8: {
            name: 'Trực Nguy',
            description1 : "Nói đến Trực Nguy là nói đến sự Nguy hiểm, suy thoái. Chính vì thế ngày có trực Nguy là ngày xấu, tiến hành muôn việc đều hung."
        },
        9: {
            name: 'Trực Thành',
            description1 : "Lập khế ước, giao dịch, cho vay, thu nợ, mua hàng, bán hàng, xuất hành, đi tàu thuyền, khởi tạo, động thổ, san nền đắp nền, gắn cửa, đặt táng, kê gác, dựng xây kho vựa, làm hay sửa chữa phòng bếp, thờ phụng Táo Thần, lắp đặt máy móc ( hay các loại máy ), gặt lúa, đào ao giếng, tháo nước, cầu thầy chữa bệnh, mua gia súc, các việc trong vụ chăn nuôi, nhập học, làm lễ cầu thân, cưới gả, kết hôn, thuê người, nộp đơn dâng sớ, học kỹ nghệ, làm hoặc sửa tàu thuyền, khai trương tàu thuyền, vẽ tranh, tu sửa cây cối.",
            description2 : "Kiện tụng, tranh chấp."
        },
       10: {
        name: 'Trực Thâu',
        description1 : "Cấy lúa, gặt lúa, mua trâu, nuôi tằm, đi săn thú cá, tu sửa cây cối. Động thổ, san nền đắp nền, nữ nhân khởi ngày uống thuốc chưa bệnh, lên quan lãnh chức, thừa kế chức tước hay sự nghiệp, vào làm hành chính, nộp đơn dâng sớ.",
        description2 : "Bắt đầu công việc mới, kỵ đi du  lịch, kỵ tang lễ."
        },
       11: {
        name: 'Trực Khai',
        description1 : "  Xuất hành, đi tàu thuyền, khởi tạo, động thổ, san nền đắp nền, dựng xây kho vựa, làm hay sửa phòng bếp, thờ cúng Táo Thần, đóng giường lót giường, may áo, lắp đặt cỗ máy dệt hay các loại máy, cấy lúa gặt lúa, đào ao giếng, tháo nước, các việc trong vụ chăn nuôi, mở thông hào rãnh, cầu thầy chữa bệnh, bốc thuốc, uống thuốc, mua trâu, làm rượu, nhập học, học kỹ nghệ, vẽ tranh, tu sửa cây cối.",
        description2 : " Chôn cất"
        },
       12: {
           name: 'Trực Bế',
           description1 : " Xây đắp tường, đặt táng, gắn cửa, kê gác, làm cầu. Khởi công lò nhuộm lò gốm, uống thuốc, trị bệnh (nhưng chớ trị bệnh mắt), tu sửa cây cối.",
           description2 : "Lên quan nhậm chức, thừa kế chức tước hay sự nghiệp, nhập học, chữa bệnh mắt."
        }
    };
    let indexThapNhiKienTruc = 0;
    // tý sử dần mão thìn tỵ ngọ mùi thân dậu tuất hợi
    debugger
    if(month === 1){
        if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    } else if(month === 2){
        if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    } else if(month === 3){
        if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    } else if(month === 4){
        if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    } else if(month === 5){
        if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    } else if(month === 6){
        if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    }else if(month === 7){
        if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    } else if(month === 8){
        if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    } else if(month === 9){
        if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Thâm'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    }else if(month === 10){
        if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Nhân'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    }else if(month === 11){
        if(chiDay === 'Tý'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    }else{
        if(chiDay === 'Sửu'){
            indexThapNhiKienTruc = 1;
        }else  if(chiDay === 'Dần'){
            indexThapNhiKienTruc = 2;
        }else if(chiDay === 'Mão'){
            indexThapNhiKienTruc = 3;
        }else if(chiDay === 'Thìn'){
            indexThapNhiKienTruc = 4;
        }else if(chiDay === 'Tỵ'){
            indexThapNhiKienTruc = 5;
        }else if(chiDay === 'Ngọ'){
            indexThapNhiKienTruc = 6;
        }else if(chiDay === 'Mùi'){
            indexThapNhiKienTruc = 7;
        }else if(chiDay === 'Thân'){
            indexThapNhiKienTruc = 8;
        }else if(chiDay === 'Dậu'){
            indexThapNhiKienTruc = 9;
        }else if(chiDay === 'Tuất'){
            indexThapNhiKienTruc = 10;
        }else if(chiDay === 'Hợi'){
            indexThapNhiKienTruc = 11;
        }else{
            indexThapNhiKienTruc = 12;
        }
    }
    const index = (indexThapNhiKienTruc + 1) % 12;
    return kienTruData[index];
};

// lấy thông tin ngày tốt 
const startInDay =(nameDay, ngayAm)=> {
    const day = nameDay.split(' ');
    const name = day[1];
    const monthOfDay = ngayAm.split('-');
    const month = Number(monthOfDay[1]);
    let startGood = [];
    if ((month === 1 && name === 'Đinh') || 
    (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Nhâm') || 
    (month === 4 && name === 'Tân') || 
    (month === 5 && name === 'Hợi') || 
    (month === 6 && name === 'Giáp') ||
    (month === 7 && name === 'Quý') || 
    (month === 8 && name === 'Dần') || 
    (month === 9 && name === 'Bính') || 
    (month === 10 && name === 'Ất') ||
    (month === 11 && name === 'Tỵ') || 
    (month === 12 && name === 'Canh')
    ) {
    startGood.push('Sao Thiên Đức: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Nhâm') || 
    (month === 2 && name === 'Tý') ||
    (month === 3 && name === 'Đinh') || 
    (month === 4 && name === 'Bính') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Kỷ') ||
    (month === 7 && name === 'Mậu') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Tân') || 
    (month === 10 && name === 'Canh') ||
    (month === 11 && name === 'Thân') || 
    (month === 12 && name === 'Ất')
    ) {
        startGood.push('Thiên Đức Hợp: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Bính') || 
    (month === 2 && name === 'Giáp') ||
    (month === 3 && name === 'Nhâm') || 
    (month === 4 && name === 'Canh') || 
    (month === 5 && name === 'Bính') || 
    (month === 6 && name === 'Giáp') ||
    (month === 7 && name === 'Nhâm') || 
    (month === 8 && name === 'Canh') || 
    (month === 9 && name === 'Bính') || 
    (month === 10 && name === 'Giáp') ||
    (month === 11 && name === 'Nhâm') || 
    (month === 12 && name === 'Canh')
    ) {
        startGood.push('Nguyệt Đức: Tốt mọi việc');
    }


    if ((month === 1 && name === 'Tân') || 
    (month === 2 && name === 'Kỷ') ||
    (month === 3 && name === 'Đinh') || 
    (month === 4 && name === 'Ất') || 
    (month === 5 && name === 'Tân') || 
    (month === 6 && name === 'Kỷ') ||
    (month === 7 && name === 'Đinh') || 
    (month === 8 && name === 'Ất') || 
    (month === 9 && name === 'Tân') || 
    (month === 10 && name === 'Kỷ') ||
    (month === 11 && name === 'Đinh') || 
    (month === 12 && name === 'Ất')
    ) {
        startGood.push('Nguyệt Đức Hợp : Tốt mọi việc, kỵ tố tụng');
    }

    if ((month === 1 && name === 'Tuất') || 
    (month === 2 && name === 'Hợi') ||
    (month === 3 && name === 'Tý') || 
    (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Thìn') || 
    (month === 8 && name === 'Tỵ') || 
    (month === 9 && name === 'Ngọ') || 
    (month === 10 && name === 'Mùi') ||
    (month === 11 && name === 'Thân') || 
    (month === 12 && name === 'Dậu')
    ) {
        startGood.push('Sao Thiên Hỷ(trực thành): Tốt mọi việc, nhất là hôn thú');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Tỵ') ||
    (month === 3 && name === 'Ngọ') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Tuất') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Mão')
    ) {
        startGood.push('Sao Thiên Phú(trực mãn): Tốt mọi việc, nhất là xây dựng nhà cửa, khai trương và an táng');
    }

    if ((month === 1 && name === 'Tý') || 
    (month === 2 && name === 'Sửu') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Thìn') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Ngọ') || 
    (month === 8 && name === 'Mùi') || 
    (month === 9 && name === 'Thân') || 
    (month === 10 && name === 'Dậu') ||
    (month === 11 && name === 'Tuất') || 
    (month === 12 && name === 'Hợi')
    ) {
        startGood.push('Sao Sinh Khí(trực khai): Tốt mọi việc, nhất là làm nhà, sửa nhà, động thổ, trồng cây');
    }

    if ((month === 1 && name === 'Kỷ') || 
    (month === 2 && name === 'Mậu') ||
    (month === 4 && (name === 'Tân' || name === 'Quý')) || 
    (month === 5 &&  (name === 'Tân'|| name === 'Nhâm')) || 
    (month === 7 && name === 'Ất') || 
    (month === 8 && name === 'Giáp') || 
    (month === 10 && name === 'Đinh') ||
    (month === 11 && name === 'Bính')
    ) {
        startGood.push('Sao Thiên Phúc: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Mùi') || 
    (month === 2 && name === 'Dậu') ||
    (month === 3 && name === 'Hợi') || 
    (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Mùi') || 
    (month === 8 && name === 'Dậu') || 
    (month === 9 && name === 'Hợi') || 
    (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Tỵ')
    ) {
        startGood.push('Sao Thiên thành (Ngọc đường Hoàng Đạo): Tốt mọi việc');
    }

    if ((month === 1 && name === 'Tuất') || 
    (month === 2 && name === 'Tý') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Thìn') || 
    (month === 5 && name === 'Ngọ') || 
    (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Tuất') || 
    (month === 8 && name === 'Tý') || 
    (month === 9 && name === 'Dần') || 
    (month === 10 && name === 'Thìn') ||
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Thân')
    ) {
        startGood.push('Sao Thiên Quan trùng với Tư mệnh Hoàng Đạo: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Tuất') || 
    (month === 4 && name === 'Tý') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Thìn') ||
    (month === 7 && name === 'Ngọ') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Tuất') || 
    (month === 10 && name === 'Tý') ||
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Thìn')
    ) {
        startGood.push(' Sao Thiên Mã (Lộc mã) trùng với Bạch hổ - xấu: Tốt cho việc xuất hành, giao dịch, cầu tài lộc');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Ngọ') ||
    (month === 3 && name === 'Thân') || 
    (month === 4 && name === 'Tuất') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Dần') ||
    (month === 7 && name === 'Thìn') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Thân') || 
    (month === 10 && name === 'Tuất') ||
    (month === 11 && name === 'Tý') || 
    (month === 12 && name === 'Dần')
    ) {
        startGood.push('Sao Thiên Tài trùng ngày Kim Quỹ Hoàng Đạo: Tốt cho việc cầu tài lộc, khai trương');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Dậu') || 
    (month === 4 && name === 'Hợi') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Mùi') || 
    (month === 9 && name === 'Dậu') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Sửu') || 
    (month === 12 && name === 'Mão')
    ) {
        startGood.push('Sao Địa Tài trùng ngày Bảo quang Hoàng đạo: Tốt cho việc cầu tài lộc, khai trương');
    }


    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Tỵ') ||
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Hợi') ||
    (month === 7 && name === 'Ngọ') || 
    (month === 8 && name === 'Tỵ') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Mùi') ||
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Hợi')
    ) {
        startGood.push('Sao Nguyệt Tài: Tốt cho việc cầu tài lộc, khai trương, xuất hành, di chuyển, giao dịch');
    }

    if ((month === 1 && name === 'Bính') || 
    (month === 2 && name === 'Đinh') ||
    (month === 3 && name === 'Canh') || 
    (month === 4 && name === 'Kỷ') || 
    (month === 5 && name === 'Mậu') || 
    (month === 6 && name === 'Tân') ||
    (month === 7 && name === 'Nhâm') || 
    (month === 8 && name === 'Quý') || 
    (month === 9 && name === 'Canh') || 
    (month === 10 && name === 'Ất') ||
    (month === 11 && name === 'Giáp') || 
    (month === 12 && name === 'Tân')
    ) {
        startGood.push('Sao Nguyệt Ân: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Nhâm') || 
    (month === 2 && name === 'Canh') ||
    (month === 3 && name === 'Bính') || 
    (month === 4 && name === 'Giáp') || 
    (month === 5 && name === 'Nhâm') || 
    (month === 6 && name === 'Canh') ||
    (month === 7 && name === 'Bính') || 
    (month === 8 && name === 'Giáp') || 
    (month === 9 && name === 'Nhâm') || 
    (month === 10 && name === 'Canh') ||
    (month === 11 && name === 'Bính') || 
    (month === 12 && name === 'Giáp')
    ) {
        startGood.push('Sao Nguyệt Không: Tốt cho việc làm nhà');
    }

    if ((month === 1 && name === 'Thân') || 
    (month === 2 && name === 'Tuất') ||
    (month === 3 && name === 'Tý') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Thìn') || 
    (month === 6 && name === 'Ngọ') ||
    (month === 7 && name === 'Thân') || 
    (month === 8 && name === 'Tuất') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Dần') ||
    (month === 11 && name === 'Thìn') || 
    (month === 12 && name === 'Ngọ')
    ) {
        startGood.push('Sao Minh Tinh: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Tỵ') ||
    (month === 3 && name === 'Tý') || 
    (month === 4 && name === 'Ngọ') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Mùi') ||
    (month === 7 && name === 'Dần') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Mão') || 
    (month === 10 && name === 'Dậu') ||
    (month === 11 && name === 'Thìn') || 
    (month === 12 && name === 'Tuất')
    ) {
        startGood.push('Sao Thánh Tâm: Tốt mọi việc, nhất là cầu phúc, tế tự');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Dần') ||
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Hợi') || 
    (month === 6 && name === 'Dần') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Hợi') || 
    (month === 10 && name === 'Dần') ||
    (month === 11 && name === 'Tỵ') || 
    (month === 12 && name === 'Thân')
    ) {
        startGood.push('Sao Ngũ Phú: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Tỵ') ||
    (month === 3 && name === 'Ngọ') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Tuất') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Mão')
    ) {
        startGood.push('Sao Lộc Khố: Tốt cho việc cầu tài, khai trương, giao dịch');
    }

    if ((month === 1 && name === 'Dậu') || 
    (month === 2 && name === 'Mão') ||
    (month === 3 && name === 'Tuất') || 
    (month === 4 && name === 'Thìn') || 
    (month === 5 && name === 'Hợi') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Tý') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Sửu') || 
    (month === 10 && name === 'Mùi') ||
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Thân')
    ) {
        startGood.push('Sao Phúc Sinh: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Dậu') || 
    (month === 2 && name === 'Dần') ||
    (month === 3 && name === 'Hợi') || 
    (month === 4 && name === 'Thìn') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Ngọ') ||
    (month === 7 && name === 'Mão') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Tuất') ||
    (month === 11 && name === 'Mùi') || 
    (month === 12 && name === 'Tý')
    ) {
        startGood.push('Sao Cát Khánh: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Dậu') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Hợi') ||
    (month === 7 && name === 'Dậu') || 
    (month === 8 && name === 'Mùi') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Sửu') || 
    (month === 12 && name === 'Hợi')
    ) {
        startGood.push('Sao Âm Đức: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Thìn') ||
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Ngọ') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Tuất') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Tý') ||
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Dần')
    ) {
        startGood.push('Sao U Vi Tinh: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Dần') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Thìn') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Ngọ') || 
    (month === 6 && name === 'Hợi') ||
    (month === 7 && name === 'Thân') || 
    (month === 8 && name === 'Sửu') || 
    (month === 9 && name === 'Tuất') || 
    (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Tý') || 
    (month === 12 && name === 'Tỵ')
    ) {
        startGood.push('Sao Mãn Đức Tinh: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Mùi') || 
    (month === 2 && name === 'Sửu') ||
    (month === 3 && name === 'Thân') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Tuất') || 
    (month === 8 && name === 'Thìn') || 
    (month === 9 && name === 'Hợi') || 
    (month === 10 && name === 'Tỵ') ||
    (month === 11 && name === 'Tý') || 
    (month === 12 && name === 'Ngọ')
    ) {
        startGood.push('Sao Kính Tâm: Tốt đối với tang lễ');
    }

    if ((month === 1 && name === 'Sửu') || 
    (month === 2 && name === 'Tý') ||
    (month === 3 && name === 'Hợi') || 
    (month === 4 && name === 'Tuất') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Mùi') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Thìn') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Dần')
    ) {
        startGood.push('Sao Tuế Hợp: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Thân') || 
    (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Dậu') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Tuất') || 
    (month === 6 && name === 'Tuất') ||
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Ngọ') || 
    (month === 10 && name === 'Ngọ') ||
    (month === 11 && name === 'Mùi') || 
    (month === 12 && name === 'Mùi')
    ) {
        startGood.push('Sao Nguyệt Giải: Tốt mọi việc');
    }
    
    if ((month === 2 && name === 'Mão') || 
    (month === 5 && name === 'Ngọ') ||
    (month === 11 && name === 'Tý') ||
    (month === 8 && name === 'Dậu')){
        startGood.push('Sao Quan Nhật: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Tuất') ||
    (month === 3 && name === 'Mùi') || 
    (month === 4 && name === 'Tý') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Dần') ||
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Thìn') || 
    (month === 9 && name === 'Sửu') || 
    (month === 10 && name === 'Ngọ') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Thân')
    ) {
        startGood.push('Sao Hoạt Điệu: Tốt, nhưng gặp thụ tử thì xấu');
    }

    if ((month === 1 && name === 'Thân') || 
    (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Tuất') || 
    (month === 4 && name === 'Tuất') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Tý') ||
    (month === 7 && name === 'Dần') || 
    (month === 8 && name === 'Dần') || 
    (month === 9 && name === 'Thìn') || 
    (month === 10 && name === 'Thìn') ||
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Ngọ')
    ) {
        startGood.push('Sao Giải Thần: Tốt cho việc tế tự, tố tụng, giải oan (trừ được các sao xấu)');
    }

    if ((month === 1 && name === 'Thân') || 
    (month === 2 && name === 'Dần') ||
    (month === 3 && name === 'Dậu') || 
    (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Tuất') || 
    (month === 6 && name === 'Thìn') ||
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Tỵ') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Ngọ') ||
    (month === 11 && name === 'Sửu') || 
    (month === 12 && name === 'Mùi')
    ) {
        startGood.push('Sao Phổ Hộ: Tốt mọi việc, làm phúc, giá thú, xuất hành');
    }

    if ((month === 1 && name === 'Tý') || 
    (month === 2 && name === 'Ngọ') ||
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Mão') || 
    (month === 8 && name === 'Dậu') || 
    (month === 9 && name === 'Thìn') || 
    (month === 10 && name === 'Tuất') ||
    (month === 11 && name === 'Tỵ') || 
    (month === 12 && name === 'Hợi')
    ) {
        startGood.push('Sao Ích Hậu: Tốt mọi việc, nhất là giá thú');
    }

    if ((month === 1 && name === 'Sửu') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Thìn') || 
    (month === 8 && name === 'Tuất') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Tý')
    ) {
        startGood.push('Sao Tục Thế: Tốt mọi việc, nhất là giá thú');
    }

    if ((month === 1 && name === 'Dần') || 
    (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Mão') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Thìn') || 
    (month === 6 && name === 'Tuất') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Ngọ') || 
    (month === 10 && name === 'Tý') ||
    (month === 11 && name === 'Mùi') || 
    (month === 12 && name === 'Sửu')
    ) {
        startGood.push('Sao Yếu Yên (Thiên Quý): Tốt mọi việc, nhất là giá thú');
    }

    if ((month === 1 && name === 'Thân') || 
    (month === 2 && name === 'Tỵ') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Hợi') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Dần') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Thân') || 
    (month === 10 && name === 'Tỵ') ||
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Hợi')
    ) {
        startGood.push('Sao Dịch Mã: Tốt mọi việc, nhất là xuất hành');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Tuất') ||
    (month === 3 && name === 'Dậu') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Mùi') || 
    (month === 6 && name === 'Ngọ') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Thìn') || 
    (month === 9 && name === 'Mão') || 
    (month === 10 && name === 'Dần') ||
    (month === 11 && name === 'Sửu') || 
    (month === 12 && name === 'Tý')
    ) {
        startGood.push('Sao Lục Hợp: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Dần') || 
    (month === 2 && name === 'Dần') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Tỵ') || 
    (month === 5 && name === 'Tỵ') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Thân') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Thân') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Hợi') || 
    (month === 12 && name === 'Hợi')
    ) {
        startGood.push('Sao Phúc Hậu: Tốt về cầu tài lộc, khai trương');
    }

    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Ngọ') ||
    (month === 3 && name === 'Ngọ') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Tý') || 
    (month === 8 && name === 'Tý') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Mão')
    ) {
        startGood.push('Sao Dân Nhật, Thời Đức: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Tuất') || 
    (month === 2 && name === 'Sửu') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Tỵ') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Tý') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Hợi') || 
    (month === 10 && name === 'Thìn') ||
    (month === 11 && name === 'Thân') || 
    (month === 12 && name === 'Mùi')
    ) {
        startGood.push('Sao Hoàng Ân: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Tý') || 
    (month === 2 && name === 'Dần') ||
    (month === 3 && name === 'Thìn') || 
    (month === 4 && name === 'Ngọ') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Tuất') ||
    (month === 7 && name === 'Tý') || 
    (month === 8 && name === 'Dần') || 
    (month === 9 && name === 'Thìn') || 
    (month === 10 && name === 'Ngọ') ||
    (month === 11 && name === 'Thân') || 
    (month === 12 && name === 'Tuất')
    ) {
        startGood.push('Sao Thanh Long Hoàng Đạo: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Sửu') || 
    (month === 2 && name === 'Mão') ||
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Hợi') ||
    (month === 7 && name === 'Sửu') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Mùi') ||
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Hợi')
    ) {
        startGood.push('Sao Minh Đường Hoàng Đạo: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Dậu') || 
    (month === 4 && name === 'Hợi') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Mùi') || 
    (month === 9 && name === 'Dậu') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Sửu') || 
    (month === 12 && name === 'Mão')
    ) {
        startGood.push('Sao Kim Đường Hoàng Đạo: Tốt mọi việc');
    }

    if ((month === 1 && name === 'Mùi') || 
    (month === 2 && name === 'Dậu') ||
    (month === 3 && name === 'Hợi') || 
    (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Mùi') || 
    (month === 8 && name === 'Dậu') || 
    (month === 9 && name === 'Hợi') || 
    (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Tỵ')
    ) {
        startGood.push('Sao Ngọc Đường Hoàng Đạo: Tốt mọi việc');
    }

    if(((month === 1|| month === 2 || month === 3) && (name === 'Hợi' || name === "Tý"))||
    ((month === 4|| month === 5 || month === 6) && (name === 'Dần' || name === "Mão"))  ||
    ((month === 7|| month === 8 || month === 9) && (name === 'Thìn' || name === "Sửu")) ||
    ((month === 10|| month === 11 || month === 12) && (name === 'Thân' || name === "Dậu"))){
        startGood.push('Sao Mẫu Thương: Tốt về cầu tài lộc, khai trương');    
    }

    if ((((month === 1 || month === 2 || month === 3) && (name === 'Tý' || name === "Sửu"))) ||
    (((month === 4 || month === 5 || month === 6) && (name === 'Thìn' || name === "Tỵ"))) ||
    (((month === 7 || month === 8 || month === 9) && (name === 'Ngọ' || name === "Mùi"))) ||
    (((month === 10 || month === 11 || month === 12) && (name === 'Thân' || name === "Tuất")))) {
        startGood.push('Đại Hồng Sa: Tốt mọi việc');    
}


    if(((month === 1|| month === 2 || month === 3) && nameDay === 'Mậu Dần')||
    ((month === 4 || month === 6) && nameDay === 'Giáp Ngọ')  ||
    ((month === 7|| month === 8 || month === 9) && nameDay === 'Mậu Thân') ||
    ((month === 10 || month === 12) && nameDay === 'Giáp Tý')){
        startGood.push('Thiên Xá: Tốt cho tế tự, giải oan, trừ được các sao xấu, chỉ kiêng kỵ động thổ. Nếu gặp trực khai thì rất tốt tức là ngày thiên xá gặp sinh khí');    
    }

    if ((((month === 1 || month === 2 || month === 3) && (name === 'Giáp' || name === "Ất"))) ||
    (((month === 4 || month === 5 || month === 6) && (name === 'Bính' || name === "Đinh"))) ||
    (((month === 7 || month === 8 || month === 9) && (name === 'Canh' || name === "Tân"))) ||
    (((month === 10 || month === 11 || month === 12) && (name === 'Nhâm' || name === "Quý")))) {
        startGood.push('Đại Hồng Sa: Tốt mọi việc');    
    }

    return startGood;
}

// lấy thông tin ngày xấu
const startBadDay =(nameDay, ngayAm)=> {
    const day = nameDay.split(' ');
    const name = day[1];
    const monthOfDay = ngayAm.split('-');
    const month = Number(monthOfDay[1]);
    let startBad = [];

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Tý') ||
    (month === 3 && name === 'Mùi') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Thìn') ||
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Sửu') || 
    (month === 10 && name === 'Thân') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Tuất')
    ) {
        startBad.push('Sao Thiên Cương (hay Diệt Môn): Xấu mọi việc');
    }

    if ((month === 1 && name === 'Dậu') || 
    (month === 2 && name === 'Ngọ') ||
    (month === 3 && name === 'Mão') || 
    (month === 4 && name === 'Tý') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Ngọ') ||
    (month === 7 && name === 'Mão') || 
    (month === 8 && name === 'Tý') || 
    (month === 9 && name === 'Dậu') || 
    (month === 10 && name === 'Ngọ') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Tý')
    ) {
        startBad.push('Sao Thiên Lại: Xấu mọi việc');
    }

    if ((month === 1 && name === 'Tý') || 
    (month === 2 && name === 'Mão') ||
    (month === 3 && name === 'Ngọ') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Ngọ') || 
    (month === 8 && name === 'Dậu') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Dậu')
    ) {
        startBad.push('Sao Thiên Ngục và Thiên Hoả: Xấu mọi việc và xấu về lợp nhà');
    }
    
    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Dậu') ||
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Tỵ') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Sửu') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Dậu') || 
    (month === 9 && name === 'Sửu') || 
    (month === 10 && name === 'Tỵ') ||
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Sửu')
    ) {
        startBad.push('Sao Tiểu Hồng Sa: Xấu mọi việc');
    }

    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Thân') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Tuất') || 
    (month === 6 && name === 'Hợi') ||
    (month === 7 && name === 'Tý') || 
    (month === 8 && name === 'Sửu') || 
    (month === 9 && name === 'Dần') || 
    (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Thìn') || 
    (month === 12 && name === 'Tỵ')
    ) {
        startBad.push('Sao Đại Hao (Tử khí, quan phú): Xấu mọi việc');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Ngọ') ||
    (month === 3 && name === 'Mùi') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Tuất') ||
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Tý') || 
    (month === 9 && name === 'Sửu') || 
    (month === 10 && name === 'Dần') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Thìn')
    ) {
        startBad.push('Sao Tiểu Hao: Xấu về kinh doanh, cầu tài');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Hợi') || 
    (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Dần') || 
    (month === 9 && name === 'Hợi') || 
    (month === 10 && name === 'Thân') ||
    (month === 11 && name === 'Tỵ') || 
    (month === 12 && name === 'Dần')
    ) {
        startBad.push('Sao Kiếp sát: Kỵ xuất hành, giá thú, an táng, xây dựng');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Tý') ||
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Thìn') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Thân') ||
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Tuất')
    ) {
        startBad.push('Sao Địa phá: Kỵ xây dựng');
    }

    if ((month === 1 && name === 'Dần') || 
    (month === 2 && name === 'Mão') ||
    (month === 3 && name === 'Thìn') || 
    (month === 4 && name === 'Tỵ') || 
    (month === 5 && name === 'Ngọ') || 
    (month === 6 && name === 'Mùi') ||
    (month === 7 && name === 'Thân') || 
    (month === 8 && name === 'Dậu') || 
    (month === 9 && name === 'Tuất') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Tý') || 
    (month === 12 && name === 'Sửu')
    ) {
        startBad.push('Sao Thổ phủ: Kỵ xây dựng, động thổ');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Tỵ') ||
    (month === 3 && name === 'Ngọ') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Tuất') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Mão')
    ) {
        startBad.push('Sao Thổ ôn (thiên cẩu): Kỵ xây dựng, đào ao, đào giếng, xấu về tế tự');
    }

    if ((month === 1 && name === 'Mùi') || 
    (month === 2 && name === 'Tuất') ||
    (month === 3 && name === 'Thìn') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Ngọ') || 
    (month === 6 && name === 'Tý') ||
    (month === 7 && name === 'Dậu') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Tý') || 
    (month === 12 && name === 'Mão')
    ) {
        startBad.push('Sao Thiên ôn: Kỵ xây dựng');
    }

    if ((month === 1 && name === 'Tuất') || 
    (month === 2 && name === 'Thìn') ||
    (month === 3 && name === 'Hợi') || 
    (month === 4 && name === 'Tỵ') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Ngọ') ||
    (month === 7 && name === 'Sửu') || 
    (month === 8 && name === 'Mùi') || 
    (month === 9 && name === 'Dần') || 
    (month === 10 && name === 'Thân') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Dậu')
    ) {
        startBad.push('Sao Thụ Tử: Xấu mọi việc (trừ săn bắn tốt)');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Dậu') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Tuất') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Thân') || 
    (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Hợi')
    ) {
        startBad.push('Sao Thiên Tặc: Xấu đối với khởi tạo, động thổ, nhập trạch, khai trương');
    }

    if ((month === 1 && name === 'Sửu') || 
    (month === 2 && name === 'Tý') ||
    (month === 3 && name === 'Hợi') || 
    (month === 4 && name === 'Tuất') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Mùi') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Thìn') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Dần')
    ) {
        startBad.push('Sao Địa Tặc: Xấu đối với khởi tạo, an táng, động thổ, xuất hành');
    }

    if ((month === 1 && name === 'Sửu') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Dần') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Thìn') || 
    (month === 8 && name === 'Tuất') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Tý')
    ) {
        startBad.push('Sao Hoả tai: Xấu đối với làm nhà, lợp nhà');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Thìn') ||
    (month === 3 && name === 'Mão') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Tý') ||
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Tuất') || 
    (month === 9 && name === 'Dậu') || 
    (month === 10 && name === 'Thân') ||
    (month === 11 && name === 'Mùi') || 
    (month === 12 && name === 'Ngọ')
    ) {
        startBad.push('Sao Nguyệt Hoả và Độc Hoả: Xấu đối với lợp nhà, làm bếp');
    }

    if ((month === 1 && name === 'Tuất') || 
    (month === 2 && name === 'Dậu') ||
    (month === 3 && name === 'Thân') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Ngọ') || 
    (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Thìn') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Dần') || 
    (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Tý') || 
    (month === 12 && name === 'Hợi')
    ) {
        startBad.push('Sao Nguyệt Yếm đại hoạ: Xấu đối với xuất hành, giá thú');
    }

    if ((month === 1 && name === 'Sửu') || 
    (month === 2 && name === 'Tuất') ||
    (month === 3 && name === 'Mùi') || 
    (month === 4 && name === 'Thìn') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Tuất') ||
    (month === 7 && name === 'Mùi') || 
    (month === 8 && name === 'Thìn') || 
    (month === 9 && name === 'Sửu') || 
    (month === 10 && name === 'Tuất') ||
    (month === 11 && name === 'Mùi') || 
    (month === 12 && name === 'Thìn')
    ) {
        startBad.push('Sao Nguyệt Hư (Nguyệt Sát): Xấu đối với việc giá thú, mở cửa, mở hàng');
    }

    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Dần') ||
    (month === 3 && name === 'Tý') || 
    (month === 4 && name === 'Ngọ') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Tý') ||
    (month === 7 && name === 'Ngọ') || 
    (month === 8 && name === 'Dần') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Ngọ') ||
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Tý')
    ) {
        startBad.push('Sao Hoàng Sa: Xấu đối với xuất hành');
    }

    if ((month === 1 && name === 'Dần') || 
    (month === 2 && name === 'Ngọ') ||
    (month === 3 && name === 'Tuất') || 
    (month === 4 && name === 'Tỵ') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Sửu') ||
    (month === 7 && name === 'Thân') || 
    (month === 8 && name === 'Tý') || 
    (month === 9 && name === 'Thìn') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Mùi')
    ) {
        startBad.push('Sao Lục Bất Thành: Xấu đối với xây dựng');
    }

    if ((month === 1 && name === 'Dậu') || 
    (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Hợi') ||
    (month === 7 && name === 'Dậu') || 
    (month === 8 && name === 'Mùi') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Sửu') || 
    (month === 12 && name === 'Hợi')
    ) {
        startBad.push('Sao Nhân Cách: Xấu đối với giá thú, khởi tạo');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Mão') ||
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Hợi') || 
    (month === 5 && name === 'Dậu') || 
    (month === 6 && name === 'Mùi') ||
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Sửu') || 
    (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Mùi')
    ) {
        startBad.push('Sao Thần Cách: Kỵ tế tự');
    }

    if ((month === 1 && name === 'Tý') || 
    (month === 2 && name === 'Dậu') ||
    (month === 3 && name === 'Ngọ') || 
    (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Ngọ') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Dậu') ||
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Mão')
    ) {
        startBad.push('Sao Phi Ma Sát: Kỵ giá thú nhập trạch');
    }

    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Dần') || 
    (month === 3 && name === 'Thìn') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Thân') || 
    (month === 7 && name === 'Sửu') || 
    (month === 8 && name === 'Tỵ') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Hợi') || 
    (month === 11 && name === 'Mùi') || 
    (month === 12 && name === 'Tuất')
    ) {
        startBad.push('Sao Ngũ Quỹ: Kỵ xuất hành');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Tý') || 
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Tuất') || 
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Thân') || 
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Thìn')
    ) {
        startBad.push('Sao Băng Tiêu Ngọ Hãm: Xấu mọi việc');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Ngọ') || 
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Tuất') || 
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Tý') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Dần') || 
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Thìn')
    ) {
        startBad.push('Sao Hà Khôi Cẩu Giảo: Kỵ khởi công xây nhà cửa, xấu mọi việc');
    }

    if ((month === 1 && name === 'Dần') || 
    (month === 2 && name === 'Tỵ') || 
    (month === 3 && name === 'Thân') || 
    (month === 4 && name === 'Hợi') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Ngọ') || 
    (month === 7 && name === 'Dậu') || 
    (month === 8 && name === 'Tý') || 
    (month === 9 && name === 'Thìn') || 
    (month === 10 && name === 'Mùi') || 
    (month === 11 && name === 'Tuất') || 
    (month === 12 && name === 'Sửu')
    ) {
        startBad.push('Sao Vãng Vong (Thổ kỵ): Kỵ xuất hành, giá thú, cầu tài lộc, động thổ');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Sửu') || 
    (month === 3 && name === 'Tuất') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Mão') || 
    (month === 6 && name === 'Tý') || 
    (month === 7 && name === 'Dậu') || 
    (month === 8 && name === 'Ngọ') || 
    (month === 9 && name === 'Dần') || 
    (month === 10 && name === 'Hợi') || 
    (month === 11 && name === 'Thân') || 
    (month === 12 && name === 'Tỵ')
    ) {
        startBad.push('Sao Cửu Không: Kỵ xuất hành, cầu tài, khai trương');
    }

    if ((month === 1 && name === 'Mão') || 
    (month === 2 && name === 'Tỵ') || 
    (month === 3 && name === 'Mùi') || 
    (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Hợi') || 
    (month === 6 && name === 'Sửu') || 
    (month === 7 && name === 'Mão') || 
    (month === 8 && name === 'Tỵ') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Dậu') || 
    (month === 11 && name === 'Hợi') || 
    (month === 12 && name === 'Sửu')
    ) {
        startBad.push('Sao Chu Tước Hắc Đạo: Kỵ nhập trạch, khai trương');
    }

    if ((month === 1 && name === 'Giáp') || 
    (month === 2 && name === 'Ất') || 
    (month === 3 && name === 'Kỷ') || 
    (month === 4 && name === 'Bính') || 
    (month === 5 && name === 'Đinh') || 
    (month === 6 && name === 'Kỷ') || 
    (month === 7 && name === 'Canh') || 
    (month === 8 && name === 'Tân') || 
    (month === 9 && name === 'Kỷ') || 
    (month === 10 && name === 'Nhâm') || 
    (month === 11 && name === 'Quý') || 
    (month === 12 && name === 'Kỷ')
    ) {
        startBad.push('Sao Trùng Tang : Kỵ giá thú, an táng, khởi công xây nhà');
    }

    if ((month === 1 && name === 'Canh') || 
    (month === 2 && name === 'Tân') || 
    (month === 3 && name === 'Kỷ') || 
    (month === 4 && name === 'Nhâm') || 
    (month === 5 && name === 'Quý') || 
    (month === 6 && name === 'Mậu') || 
    (month === 7 && name === 'Giáp') || 
    (month === 8 && name === 'Ất') || 
    (month === 9 && name === 'Kỷ') || 
    (month === 10 && name === 'Nhâm') || 
    (month === 11 && name === 'Quý') || 
    (month === 12 && name === 'Kỷ')
    ) {
        startBad.push('Sao Trùng Phục: Kỵ giá thú, an táng');
    }

    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Thân') || 
    (month === 3 && name === 'Tuất') || 
    (month === 4 && name === 'Tý') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Thìn') || 
    (month === 7 && name === 'Ngọ') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Tuất') || 
    (month === 10 && name === 'Tý') || 
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Thìn')
    ) {
        startBad.push('Sao Bạch Hổ: Kỵ mai táng');
    }

    if ((month === 1 && name === 'Dậu') || 
    (month === 2 && name === 'Hợi') || 
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Sửu') || 
    (month === 6 && name === 'Mùi') || 
    (month === 7 && name === 'Dậu') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Tỵ') || 
    (month === 10 && name === 'Mão') || 
    (month === 11 && name === 'Sửu') || 
    (month === 12 && name === 'Mùi')
    ) {
        startBad.push('Sao Huyền Vũ: Kỵ mai táng');
    }

    if ((month === 1 && name === 'Hợi') || 
    (month === 2 && name === 'Tỵ') || 
    (month === 3 && name === 'Mão') || 
    (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Mùi') || 
    (month === 6 && name === 'Dậu') || 
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Tỵ') || 
    (month === 9 && name === 'Mão') || 
    (month === 10 && name === 'Sửu') || 
    (month === 11 && name === 'Mùi') || 
    (month === 12 && name === 'Dậu')
    ) {
        startBad.push('Sao Câu Trận: Kỵ mai táng');
    }

    if ((month === 1 && name === 'Dần') || 
    (month === 2 && name === 'Hợi') || 
    (month === 3 && name === 'Tỵ') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Hợi') || 
    (month === 7 && name === 'Tỵ') || 
    (month === 8 && name === 'Thân') || 
    (month === 9 && name === 'Dần') || 
    (month === 10 && name === 'Hợi') || 
    (month === 11 && name === 'Tỵ') || 
    (month === 12 && name === 'Thân')
    ) {
        startBad.push('Sao Lôi Công: Xấu với xây dựng nhà cửa');
    }

    if ((month === 1 && name === 'Tuất') || 
    (month === 2 && name === 'Hợi') || 
    (month === 3 && name === 'Tý') || 
    (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Dần') || 
    (month === 6 && name === 'Mão') || 
    (month === 7 && name === 'Thìn') || 
    (month === 8 && name === 'Tỵ') || 
    (month === 9 && name === 'Ngọ') || 
    (month === 10 && name === 'Mùi') || 
    (month === 11 && name === 'Thân') || 
    (month === 12 && name === 'Dậu')
    ) {
        startBad.push('Sao Cô Thần: Xấu với giá thú');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Tỵ') || 
    (month === 3 && name === 'Ngọ') || 
    (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Dậu') || 
    (month === 7 && name === 'Tuất') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Tý') || 
    (month === 10 && name === 'Sửu') || 
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Mão')
    ) {
        startBad.push('Sao Quả Tú: Xấu với giá thú');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Tý') || 
    (month === 3 && name === 'Mùi') || 
    (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Tuất') || 
    (month === 7 && name === 'Sửu') || 
    (month === 8 && name === 'Hợi') || 
    (month === 9 && name === 'Ngọ') || 
    (month === 10 && name === 'Dậu') || 
    (month === 11 && name === 'Dần') || 
    (month === 12 && name === 'Thìn')
    ) {
        startBad.push('Sao Sát Chủ: Xấu mọi việc');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Tý') || 
    (month === 3 && name === 'Thìn') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Ngọ') || 
    (month === 6 && name === 'Sửu') || 
    (month === 7 && name === 'Dần') || 
    (month === 8 && name === 'Dậu') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Hợi') || 
    (month === 11 && name === 'Mão') || 
    (month === 12 && name === 'Tuất')
    ) {
        startBad.push(' SaoNguyệt Hình: Xấu mọi việc');
    }

    if ((month === 1 && name === 'Ngọ') || 
    (month === 2 && name === 'Tý') || 
    (month === 3 && name === 'Mùi') || 
    (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Thân') || 
    (month === 6 && name === 'Dần') || 
    (month === 7 && name === 'Dậu') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Tuất') || 
    (month === 10 && name === 'Thìn') || 
    (month === 11 && name === 'Hợi') || 
    (month === 12 && name === 'Tỵ')
    ) {
        startBad.push('Sao Tội chỉ: Xấu với tế tự, kiện cáo');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Dậu') || 
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Thìn') || 
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Dần') || 
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Tuất')
    ) {
        startBad.push('Sao Ngũ hư: Kỵ khởi tạo, giá thú, an táng');
    }

    if ((month === 1 && name === 'Thìn') || 
    (month === 2 && name === 'Tỵ') || 
    (month === 3 && name === 'Tý') || 
    (month === 4 && name === 'Tuất') || 
    (month === 5 && name === 'Hợi') || 
    (month === 6 && name === 'Mùi') || 
    (month === 7 && name === 'Dần') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Ngọ') || 
    (month === 10 && name === 'Thân') || 
    (month === 11 && name === 'Dậu') || 
    (month === 12 && name === 'Sửu')
    ) {
        startBad.push('Sao Không phòng: Kỵ giá thú');
    }

    if ((month === 1 && name === 'Tỵ') || 
    (month === 2 && name === 'Dậu') || 
    (month === 3 && name === 'Sửu') || 
    (month === 4 && name === 'Thân') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Thìn') || 
    (month === 7 && name === 'Hợi') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Mùi') || 
    (month === 10 && name === 'Dần') || 
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Tuất')
    ) {
        startBad.push('Sao Ngũ hư: Kỵ khởi tạo, giá thú, an táng');
    }

    if ((month === 1 && name === 'Thân') || 
    (month === 2 && name === 'Dậu') || 
    (month === 3 && name === 'Tuất') || 
    (month === 4 && name === 'Hợi') || 
    (month === 5 && name === 'Tý') || 
    (month === 6 && name === 'Sửu') || 
    (month === 7 && name === 'Dần') || 
    (month === 8 && name === 'Mão') || 
    (month === 9 && name === 'Thìn') || 
    (month === 10 && name === 'Tỵ') || 
    (month === 11 && name === 'Ngọ') || 
    (month === 12 && name === 'Mùi')
    ) {
        startBad.push('Sao Nguyệt phá: Xấu về xây dựng nhà cửa');
    }

    if ((((month === 1 || month === 2 || month === 3) && (name === 'Tý' || name === 'Dậu' || name === 'Sửu')) ||
     ((month === 4 || month === 5 || month === 6) && (name === 'Thân' || name === 'Tý' || name === 'Thìn')) ||
     ((month === 7 || month === 8 || month === 9) && (name === 'Hợi' || name === 'Mão' || name === 'Mùi')) ||
     ((month === 10 || month === 11 || month === 12) && (name === 'Dần' || name === 'Ngọ' || name === 'Tuất')))) {
        startBad.push('Sao Hoang vu: Xấu mọi việc');
    }

    if (((month === 1 || month === 2 || month === 3) && name === 'Mão') ||
    ((month === 4 || month === 5 || month === 6) && name === 'Ngọ') || 
    ((month === 7 || month === 8 || month === 9) && name === 'Dậu') ||
    ((month === 10 || month === 11 || month === 12) && name === 'Tý')) {
    startBad.push('Sao Nguyệt Kiến chuyển sát: Kỵ động thổ');
    }

    if ((((month === 1 || month === 2 || month === 3) && name === 'Tý') ||
     ((month === 4 || month === 5 || month === 6) && name === 'Mão') || 
     ((month === 7 || month === 8 || month === 9) && name === 'Ngọ') ||
     ((month === 10 || month === 11 || month === 12) && name === 'Dậu'))) {
        startBad.push('Sao Lỗ ban sát: Kỵ khởi tạo');
    }

    if(((month === 1 || month === 2 || month === 3) && name === 'Thìn') ||
    ((month === 4 || month === 5 || month === 6) && name === 'Mùi') || 
    ((month === 7 || month === 8 || month === 9) && name === 'Dậu')||
    ((month === 1 || month === 11 || month === 12) && name === 'Tý')){
        startBad.push('Sao  Phủ đầu dát: Kỵ khởi tạo');
    }

    if(((month === 1 || month === 2 || month === 3) && name === 'Thìn') ||
    ((month === 4 || month === 5 || month === 6) && name === 'Mùi') || 
    ((month === 7 || month === 8 || month === 9) && name === 'Tuất')||
    ((month === 1 || month === 11 || month === 12) && name === 'Sửu')
    ){
        startBad.push('Sao Tam tang: Kỵ khởi tạo, giá thú, an táng');
    }

    if(((month === 1 || month === 2 || month === 3) && name === 'Hợi') ||
    ((month === 4 || month === 5 || month === 6) && name === 'Dần') || 
    ((month === 7 || month === 8 || month === 9) && name === 'Tỵ') ||
    ((month === 1 || month === 11 || month === 12) && name === 'Thân')
    ){
        startBad.push('Sao Thổ cẩm: Kỵ xây dựng, an táng');
    }

    if(((month === 1 || month === 2 || month === 3 )&& name === 'Sửu') ||
    ((month === 4 || month === 5 || month === 6) && name === 'Thìn') || 
    ((month === 7 || month === 8 || month === 9) && name === 'Mùi') ||
    ((month === 1 || month === 11 || month === 12) && name === 'Tuất')
    ){
        startBad.push('Sao Tứ thời cô quả: Kỵ giá thú');
    }

     if(((month === 1 || month === 2 || month === 3) && nameDay === 'Ất Mùi') ||
    ((month === 4 || month === 5 || month === 6) && nameDay === 'Bính Tuất') || 
    ((month === 7 || month === 8 || month === 9) && nameDay === 'Tân Sửu')||
    ((month === 1 || month === 11 || month === 12) && nameDay === 'Nhâm Thìn')
    ){
        startBad.push('Sao Tứ thời đại mộ: Kỵ an táng');
    }

    if(((month === 1 || month === 2 || month === 3) && name === 'Dậu') ||
    ((month === 4 || month === 5 || month === 6 )&& (name === 'Dần'  || name === 'Ngọ')) || 
    ((month === 7 || month === 8 || month === 9) && name === 'Tuất') ||
    ((month === 1 || month === 11 || month === 12) && name === 'Tỵ')
    ){
        startBad.push('Sao Ly sàng: Kỵ giá thú');
    }

    if(((month === 1 || month === 2 || month === 3) && nameDay === 'Quý Mão') ||
    ((month === 4 || month === 5 || month === 6) && nameDay === 'Bính Ngọ') || 
    ((month === 7 || month === 8 || month === 9) && nameDay === 'Đinh Dậu')||
    ((month === 1 || month === 11 || month === 12) && nameDay === 'Canh Tý')
    ){
        startBad.push('Sao Thiên địa  chính chuyển: Kỵ động thổ');
    }

    if(((month === 1 || month === 2 || month === 3 )&& nameDay === 'Ất Mão') ||
    ((month === 4 || month === 5 || month === 6) && nameDay === 'Bính Ngọ') || 
    ((month === 7 || month === 8 || month === 9) && nameDay === 'Tân Dậu')||
    ((month === 1 || month === 11 || month === 12) && nameDay === 'Nhâm Tý')
    ){
        startBad.push('Sao Thiên địa chuyển sát: Kỵ động thổ');
    }

    if ((month === 1 && nameDay === 'Canh Tuất') || 
    (month === 2 && nameDay === 'Tân Dậu') || 
    (month === 3 && nameDay === 'Canh Thân') || 
    (month === 4 && nameDay === 'Đinh Mùi') || 
    (month === 5 && nameDay === 'Bính Ngọ') || 
    (month === 6 && nameDay === 'Đinh Tỵ') || 
    (month === 7 && nameDay === 'Giáp Thìn') || 
    (month === 8 && nameDay === 'Ất Mão') || 
    (month === 9 && nameDay === 'Giáp Dần') || 
    (month === 10 && nameDay === 'Quý Sửu') || 
    (month === 11 && nameDay === 'Nhâm Tý') || 
    (month === 12 && nameDay === 'Quý Hợi')
    ) {
        startBad.push('Sao Âm thác: Kỵ xuất hành, giá thú, an táng');
    }

    if ((month === 1 && nameDay === 'Giáp Dần') || 
    (month === 2 && nameDay === 'Ất Mão') || 
    (month === 3 && nameDay === 'Giáp Thìn') || 
    (month === 4 && nameDay === 'Đinh Tỵ') || 
    (month === 5 && nameDay === 'Bính Ngọ') || 
    (month === 6 && nameDay === 'Đinh Mùi') || 
    (month === 7 && nameDay === 'Canh Thân') || 
    (month === 8 && nameDay === 'Tân Dậu') || 
    (month === 9 && nameDay === 'Canh Tuất') || 
    (month === 10 && nameDay === 'Quý Hợi') || 
    (month === 11 && nameDay === 'Nhâm Tý') || 
    (month === 12 && nameDay === 'Quý Sửu')
    ) {
        startBad.push('Sao Dương thác: Kỵ xuất hành, giá thú, an táng');
    }

    if(month === 1 || month === 2 || month === 3 || month === 4 || month === 5 ||
        month === 6 || month === 7 || month === 8 || month === 9 || month === 10 ||
        month === 11 || month === 12 
     ){
        startBad.push('Sao Quỷ khốc: Xấu với tế tự, mai táng');
     }
    return startBad;
}

// lấy thông tin ngũ hành
const nguHanh =(nameDay)=> {

    if(nameDay === 'Mậu Tý'){
        return {
            name : 'tức Can khắc Chi (Thổ khắc Thủy), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Phích Lịch Hỏa, kỵ các tuổi: Nhâm Ngọ và Giáp Ngọ.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Nhâm Thân và Giáp Ngọ thuộc hành Kim không sợ Hỏa.',
            detail :' Ngày Tý lục hợp với Sửu, tam hợp với Thìn và Thân thành Thủy cục. Xung Ngọ, hình Mão, hại Mùi, phá Dậu, tuyệt Tỵ.',
            detail2 : ''
        }
    }else if(nameDay === 'Đinh Sửu'){
        return {
            name : 'tức Can sinh Chi (Hỏa sinh Thổ), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Giản Hạ Thủy, kỵ các tuổi: Tân Mùi và Kỷ Mùi.',
            description :' Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Kỷ Sửu, Đinh Dậu và Kỷ Mùi thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Sửu lục hợp với Tý, tam hợp với Tỵ và Dậu thành Kim cục. Xung Mùi, hình Tuất, hại Ngọ, phá Thìn, tuyệt Mùi.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Dần, Ngọ, Tuất.'
        }
    } else if(nameDay === 'Ất Sửu'){
        return  {
            name : 'tức Can khắc Chi (Mộc khắc Thổ), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Hải Trung Kim, kỵ các tuổi: Kỷ Mùi và Quý Mùi.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Kỷ Hợi vì Kim khắc mà được lợi.',
            detail :'Ngày Sửu lục hợp với Tý, tam hợp với Tỵ và Dậu thành Kim cục. Xung Mùi, hình Tuất, hại Ngọ, phá Thìn, tuyệt Mùi.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Dần, Ngọ, Tuất.'
        }
    }else if(nameDay === 'Giáp Tý'){
        return  {
            name : 'tức Chi sinh Can (Thủy sinh Mộc), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Hải Trung Kim, kỵ các tuổi: Mậu Ngọ và Nhâm Ngọ.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Mậu Tuất vì Kim khắc nên được lợi.',
            detail :'Ngày Tý lục hợp với Sửu, tam hợp với Thìn và Thân thành Thủy cục. Xung Ngọ, hình Mão, hại Mùi, phá Dậu, tuyệt Tỵ.',
            detail2 : ''
        }
    } else if(nameDay === 'Bính Dần'){
        return  {
            name : 'tức Chi sinh Can (Mộc sinh Hỏa), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Lô Trung Hỏa, kỵ các tuổi: Canh Thân và Nhâm Thân.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Nhâm Thân và Giáp Ngọ thuộc hành Kim nhưng không sợ Hỏa.',
            detail :'Ngày Dần lục hợp với Hợi, tam hợp với Ngọ và Tuất thành Hỏa cục. Xung Thân, hình Tỵ, hại Tỵ, phá Hợi, tuyệt Dậu.',
            detail2 : ''
        }
    }else if(nameDay === 'Đinh Mão'){
        return  {
            name : 'tức Chi sinh Can (Mộc sinh Hỏa), ngày này là ngày cát (nghĩa nhật).',
            napAm : ' Ngày Lô Trung Hỏa, kỵ các tuổi: Tân Dậu và Quý Dậu.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Quý Dậu và Ất Mùi thuộc hành Kim nhưng không sợ Hỏa.',
            detail :'Ngày Mão lục hợp với Tuất, tam hợp với Mùi và Hợi thành Mộc cục. Xung Dậu, hình Tý, hại Thìn, phá Ngọ, tuyệt Thân.',
            detail2 : ''
        }
    }
    
    else if(nameDay === 'Mậu Thìn'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Thổ), ngày này là ngày cát.',
            napAm : 'Ngày Đại Lâm Mộc, kỵ các tuổi: Nhâm Tuất và Bính Tuất.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Canh Ngọ, Mậu Thân và Bính Thìn thuộc hành Thổ không sợ Mộc.',
            detail :' Ngày Thìn lục hợp với Dậu, tam hợp với Tý và Thân thành Thủy cục. Xung Tuất, hình Thìn, hình Mùi, hại Mão, phá Sửu, tuyệt Tuất.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Tỵ, Dậu, Sửu.'
        }
    }else if(nameDay === 'Kỷ Tỵ'){
        return  {
            name : ' tức Chi sinh Can (Hỏa sinh Thổ), ngày này là ngày cát (nghĩa nhật).',
            napAm : ' Ngày Đại Lâm Mộc, kỵ các tuổi: Quý Hợi và Đinh Hợi.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Tân Mùi, Kỷ Dậu và Đinh Tỵ thuộc hành Thổ không sợ Mộc.',
            detail :'  Ngày Tỵ lục hợp với Thân, tam hợp với Sửu và Dậu thành Kim cục. Xung Hợi, hình Thân, hại Dần, phá Thân, tuyệt Tý.',
            detail2 : ''
        }
    }else if(nameDay === 'Canh Ngọ'){
        return  {
            name : 'tức Chi khắc Can (Hỏa khắc Kim), là ngày hung (phạt nhật).',
            napAm : 'Ngày Lộ Bàng Thổ, kỵ các tuổi: Giáp Tý và Bính Tý.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Bính Ngọ và Nhâm Tuất thuộc hành Thủy không sợ Thổ.',
            detail :' Ngày Ngọ lục hợp với Mùi, tam hợp với Dần và Tuất thành Hỏa cục. Xung Tý, hình Ngọ, hình Dậu, hại Sửu, phá Mão, tuyệt Hợi.',
            detail2 : ''
        }
    }else if(nameDay === 'Tân Mùi'){
        return  {
            name : 'tức Chi sinh Can (Thổ sinh Kim), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Lộ Bàng Thổ, kỵ các tuổi: Ất Sửu và Đinh Sửu.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Đinh Mùi, Quý Hợi thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Mùi lục hợp với Ngọ, tam hợp với Mão và Hợi thành Mộc cục. Xung Sửu, hình Sửu, hại Tý, phá Tuất, tuyệt Sửu.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Thân, Tý, Thìn.'
        }
    }else if(nameDay === 'Nhâm Thân'){
        return  {
            name : 'tức Chi sinh Can (Kim sinh Thủy), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Kiếm Phong Kim, kỵ các tuổi: Bính Dần và Canh Dần.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Mậu Tuất vì Kim khắc mà được lợi.',
            detail :' Ngày Thân lục hợp với Tỵ, tam hợp với Tý và Thìn thành Thủy cục. Xung Dần, hình Dần, hình Hợi, hại Hợi, phá Tỵ, tuyệt Mão.',
            detail2 : ''
        }
    }else if(nameDay === 'Quý Dậu'){
        return  {
            name : 'tức Chi sinh Can (Kim sinh Thủy), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Kiếm Phong Kim, kỵ các tuổi: Đinh Mão và Tân Mão.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Kỷ Hợi vì Kim khắc mà được lợi.',
            detail :'Ngày Dậu lục hợp với Thìn, tam hợp với Sửu và Tỵ thành Kim cục. Xung Mão, hình Dậu, hại Tuất, phá Tý, tuyệt Dần.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Ất Hợi'){
        return  {
            name : 'tức Chi sinh Can (Thủy sinh Mộc), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Sơn Đầu Hỏa, kỵ các tuổi: Kỷ Tỵ và Tân Tỵ.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Quý Dậu và Ất Mùi thuộc hành Kim không sợ Hỏa.',
            detail :' Ngày Hợi lục hợp với Dần, tam hợp với Mão và Mùi thành Mộc cục. Xung Tỵ, hình Hợi, hại Thân, phá Dần, tuyệt Ngọ.',
            detail2 : ''
        }
    }else if(nameDay === 'Giáp Tuất'){
        return  {
            name : 'tức Can khắc Chi (Mộc khắc Thổ), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Sơn Đầu Hỏa, kỵ các tuổi: Mậu Thìn và Canh Thìn.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Nhâm Thân và Giáp Ngọ thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Tuất lục hợp với Mão, tam hợp với Dần và Ngọ thành Hỏa cục. Xung Thìn, hình Mùi, hại Dậu, phá Mùi, tuyệt Thìn.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Hợi, Mão, Mùi.'
        }
    }
    else if(nameDay === 'Đinh Sữu'){
        return  {
            name : 'tức Can sinh Chi (Hỏa sinh Thổ), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Giản Hạ Thủy, kỵ các tuổi: Tân Mùi và Kỷ Mùi.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Kỷ Sửu, Đinh Dậu và Kỷ Mùi thuộc hành Hỏa không sợ Thủy.',
            detail :' Ngày Sửu lục hợp với Tý, tam hợp với Tỵ và Dậu thành Kim cục. Xung Mùi, hình Tuất, hại Ngọ, phá Thìn, tuyệt Mùi.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Dần, Ngọ, Tuất.'
        }
    }
    else if(nameDay === 'Bính Tý'){
        return  {
            name : 'tức Chi khắc Can (Thủy khắc Hỏa), là ngày hung (phạt nhật).',
            napAm : 'Ngày Giản Hạ Thủy, kỵ các tuổi: Canh Ngọ và Mậu Ngọ.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Mậu Tý, Bính Thân và Mậu Ngọ thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Tý lục hợp với Sửu, tam hợp với Thìn và Thân thành Thủy cục. Xung Ngọ, hình Mão, hại Mùi, phá Dậu, tuyệt Tỵ.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Mậu Dần'){
        return  {
            name : 'tức Chi khắc Can (Mộc khắc Thổ), là ngày hung (phạt nhật).',
            napAm : 'Ngày Thành Đầu Thổ, kỵ các tuổi: Nhâm Thân và Giáp Thân.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Bính Ngọ và Nhâm Tuất thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Dần lục hợp với Hợi, tam hợp với Ngọ và Tuất thành Hỏa cục. Xung Thân, hình Tỵ, hại Tỵ, phá Hợi, tuyệt Dậu.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Kỷ Mão'){
        return  {
            name : 'tức Chi khắc Can (Mộc khắc Thổ), là ngày hung (phạt nhật).',
            napAm : 'Ngày Thành Đầu Thổ, kỵ các tuổi: Quý Dậu và Ất Dậu.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Đinh Mùi và Quý Hợi thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Mão lục hợp với Tuất, tam hợp với Mùi và Hợi thành Mộc cục. Xung Dậu, hình Tý, hại Thìn, phá Ngọ, tuyệt Thân.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Canh Thìn'){
        return  {
            name : 'tức Chi sinh Can (Thổ sinh Kim), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Bạch Lạp Kim, kỵ các tuổi: Giáp Tuất và Mậu Tuất.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Mậu Tuất vì Kim khắc mà được lợi.',
            detail :'Ngày Thìn lục hợp với Dậu, tam hợp với Tý và Thân thành Thủy cục. Xung Tuất, hình Thìn, hình Mùi, hại Mão, phá Sửu, tuyệt Tuất.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Tỵ, Dậu, Sửu.'
        }
    }
    else if(nameDay === 'Tân Tỵ'){
        return  {
            name : 'tức Chi khắc Can (Hỏa khắc Kim), là ngày hung (phạt nhật).',
            napAm : 'Ngày Bạch Lạp Kim, kỵ các tuổi: Ất Hợi và Kỷ Hợi.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Kỷ Hợi vì Kim khắc mà được lợi.',
            detail :'Ngày Tỵ lục hợp với Thân, tam hợp với Sửu và Dậu thành Kim cục. Xung Hợi, hình Thân, hại Dần, phá Thân, tuyệt Tý.',
            detail2 : ''
        }
    }
    else if( nameDay === 'Quý Mùi'){
        return  {
            name : 'tức Chi khắc Can (Thổ khắc Thủy), là ngày hung (phạt nhật).',
            napAm : 'Ngày Dương Liễu Mộc, kỵ các tuổi: Đinh Sửu và Tân Sửu.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Tân Mùi, Kỷ Dậu và Đinh Tỵ thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Mùi lục hợp với Ngọ, tam hợp với Mão và Hợi thành Mộc cục. Xung Sửu, hình Sửu, hại Tý, phá Tuất, tuyệt Sửu.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Thân, Tý, Thìn.'
        }
    }
    else if(nameDay === 'Nhâm Ngọ'){
        return  {
            name : 'tức Can khắc Chi (Thủy khắc Hỏa), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Dương Liễu Mộc, kỵ các tuổi: Bính Tý và Canh Tý.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Canh Ngọ, Mậu Thân và Bính Thìn thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Ngọ lục hợp với Mùi, tam hợp với Dần và Tuất thành Hỏa cục. Xung Tý, hình Ngọ, hình Dậu, hại Sửu, phá Mão, tuyệt Hợi.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Ất Dậu'){
        return  {
            name : 'tức Chi khắc Can (Kim khắc Mộc), là ngày hung (phạt nhật).',
            napAm : 'Ngày Tuyền Trung Thủy, kỵ các tuổi: Kỷ Mão và Đinh Mão.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Kỷ Sửu, Đinh Dậu và Kỷ Mùi thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Dậu lục hợp với Thìn, tam hợp với Sửu và Tỵ thành Kim cục. Xung Mão, hình Dậu, hại Tuất, phá Tý, tuyệt Dần.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Giáp Thân'){
        return  {
            name : 'tức Chi khắc Can (Kim khắc Mộc), là ngày hung (phạt nhật).',
            napAm : 'Ngày Tuyền Trung Thủy, kỵ các tuổi: Mậu Dần và Bính Dần.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Mậu Tý, Bính Thân và Mậu Ngọ thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Thân lục hợp với Tỵ, tam hợp với Tý và Thìn thành Thủy cục. Xung Dần, hình Dần, hình Hợi, hại Hợi, phá Tỵ, tuyệt Mão.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Đinh Hợi'){
        return  {
            name : 'tức Chi khắc Can (Thủy khắc Hỏa), là ngày hung (phạt nhật).',
            napAm : 'Ngày Ốc Thượng Thổ, kỵ các tuổi: Tân Tỵ và Quý Tỵ.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Đinh Mùi và Quý Hợi thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Hợi lục hợp với Dần, tam hợp với Mão và Mùi thành Mộc cục. Xung Tỵ, hình Hợi, hại Thân, phá Dần, tuyệt Ngọ.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Bính Tuất'){
        return  {
            name : 'tức Can sinh Chi (Hỏa sinh Thổ), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Ốc Thượng Thổ, kỵ các tuổi: Canh Thìn và Nhâm Thìn.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Bính Ngọ và Nhâm Tuất thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Tuất lục hợp với Mão, tam hợp với Dần và Ngọ thành Hỏa cục. Xung Thìn, hình Mùi, hại Dậu, phá Mùi, tuyệt Thìn.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Hợi, Mão, Mùi.'
        }
    }
    else if(nameDay === 'Kỷ Sửu'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Thổ), ngày này là ngày cát.',
            napAm : 'Ngày Phích Lịch Hỏa, kỵ các tuổi: Quý Mùi và Ất Mùi.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Quý Dậu thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Sửu lục hợp với Tý, tam hợp với Tỵ và Dậu thành Kim cục. Xung Mùi, hình Tuất, hại Ngọ, phá Thìn, tuyệt Mùi.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Dần, Ngọ, Tuất.'
        }
    }
    else if(nameDay === 'Mậu Tí'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Thổ), ngày này là ngày cát.',
            napAm : 'Ngày Phích Lịch Hỏa, kỵ các tuổi: Quý Mùi và Ất Mùi.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Quý Dậu thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Sửu lục hợp với Tý, tam hợp với Tỵ và Dậu thành Kim cục. Xung Mùi, hình Tuất, hại Ngọ, phá Thìn, tuyệt Mùi.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Dần, Ngọ, Tuất.'
        }
    }
    else if(nameDay === 'Tân Mão'){
        return  {
            name : 'tức Can khắc Chi (Kim khắc Mộc), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Tùng Bách Mộc, kỵ các tuổi: Ất Dậu và Kỷ Dậu.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Tân Mùi, Kỷ Dậu, Đinh Tỵ thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Mão lục hợp với Tuất, tam hợp với Mùi và Hợi thành Mộc cục. Xung Dậu, hình Tý, hại Thìn, phá Ngọ, tuyệt Thân.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Canh Dần'){
        return  {
            name : 'tức Can khắc Chi (Kim khắc Mộc), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Nạp âm: Ngày Tùng Bách Mộc, kỵ các tuổi: Giáp Thân và Mậu Thân.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Canh Ngọ, Mậu Thân và Bính Thìn thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Dần lục hợp với Hợi, tam hợp với Ngọ và Tuất thành Hỏa cục. Xung Thân, hình Tỵ, hại Tỵ, phá Hợi, tuyệt Dậu.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Quý Tỵ'){
        return  {
            name : 'tức Can khắc Chi (Thủy khắc Hỏa), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Trường Lưu Thủy, kỵ các tuổi: Đinh Hợi và Ất Hợi.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Kỷ Sửu, Đinh Dậu và Kỷ Mùi thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Tỵ lục hợp với Thân, tam hợp với Sửu và Dậu thành Kim cục. Xung Hợi, hình Thân, hại Dần, phá Thân, tuyệt Tý.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Nhâm Thìn'){
        return  {
            name : ' tức Chi khắc Can (Thổ khắc Thủy), là ngày hung (phạt nhật).',
            napAm : 'Ngày Trường Lưu Thủy, kỵ các tuổi: Bính Tuất và Giáp Tuất.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Mậu Tý, Bính Thân và Mậu Ngọ thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Thìn lục hợp với Dậu, tam hợp với Tý và Thân thành Thủy cục. Xung Tuất, hình Thìn, hình Mùi, hại Mão, phá Sửu, tuyệt Tuất.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Tỵ, Dậu, Sửu.'
        }
    }
    else if( nameDay === 'Ất Mùi'){
        return  {
            name : 'tức Can khắc Chi (Mộc khắc Thổ), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Sa Trung Kim, kỵ các tuổi: Kỷ Sửu và Quý Sửu.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Kỷ Hợi vì Kim khắc mà được lợi.',
            detail :'Ngày Mùi lục hợp với Ngọ, tam hợp với Mão và Hợi thành Mộc cục. Xung Sửu, hình Sửu, hại Tý, phá Tuất, tuyệt Sửu.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Thân, Tý, Thìn.'
        }
    }
    else if(nameDay === 'Giáp Ngọ'){
        return  {
            name : 'tức Can sinh Chi (Mộc sinh Hỏa), ngày này là ngày cát (bảo nhật).',
            napAm : ' Ngày Sa Trung Kim, kỵ các tuổi: Mậu Tý và Nhâm Tý.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Mậu Tuất vì Kim khắc mà được lợi.',
            detail :'Ngày Ngọ lục hợp với Mùi, tam hợp với Dần và Tuất thành Hỏa cục. Xung Tý, hình Ngọ, hình Dậu, hại Sửu, phá Mão, tuyệt Hợi.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Bính Thân' ){
        return  {
            name : 'tức Can khắc Chi (Hỏa khắc Kim), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Sơn Hạ Hỏa, kỵ các tuổi: Canh Dần và Nhâm Dần.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Nhâm Thân và Giáp Ngọ thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Thân lục hợp với Tỵ, tam hợp với Tý và Thìn thành Thủy cục. Xung Dần, hình Dần, hình Hợi, hại Hợi, phá Tỵ, tuyệt Mão.',
            detail2 : ''
        }
    }
    else if( nameDay === 'Đinh Dậu'){
        return  {
            name : 'tức Can khắc Chi (Hỏa khắc Kim), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Sơn Hạ Hỏa, kỵ các tuổi: Tân Mão và Quý Mão.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Quý Dậu và Ất Mùi thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Dậu lục hợp với Thìn, tam hợp với Sửu và Tỵ thành Kim cục. Xung Mão, hình Dậu, hại Tuất, phá Tý, tuyệt Dần.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Mậu Tuất'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Thổ), ngày này là ngày cát.',
            napAm : 'Ngày Bình Địa Mộc, kỵ các tuổi: Nhâm Thìn và Giáp Ngọ.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Canh Ngọ, Mậu Thân và Bính Thìn thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Tuất lục hợp với Mão, tam hợp với Dần và Ngọ thành Hỏa cục. Xung Thìn, hình Mùi, hại Dậu, phá Mùi, tuyệt Thìn.',
            detail2 : 'Tam Sát kỵ mệnh tuổi Hợi, Mão, Mùi.'
        }
    }
    else if( nameDay === 'Kỷ Hợi'){
        return  {
            name : 'tức Can khắc Chi (Thổ khắc Thủy), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Bình Địa Mộc, kỵ các tuổi: Quý Tỵ và Ất Mùi.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Tân Mùi, Kỷ Dậu và Đinh Tỵ thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Hợi lục hợp với Dần, tam hợp với Mão và Mùi thành Mộc cục. Xung Tỵ, hình Hợi, hại Thân, phá Dần, tuyệt Ngọ.',
            detail2 : ''
        }
    }
    else if( nameDay === 'Tân Sữu'){
        return  {
            name : 'tức Chi sinh Can (Thổ sinh Kim), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Bích Thượng Thổ, kỵ các tuổi: Ất Mùi và Đinh Mùi.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Đinh Mùi và Quý Hợi thuộc hành Thủy không sợ Thổ.',
            detail :' Ngày Sửu lục hợp với Tý, tam hợp với Tỵ và Dậu thành Kim cục. Xung Mùi, hình Tuất, hại Ngọ, phá Thìn, tuyệt Mùi.',
            detail2 : 'Tam Sát kỵ mệnh tuổi Dần, Ngọ, Tuất.'
        }
    }
    else if(nameDay === 'Canh Tý'){
        return  {
            name : 'tức Can sinh Chi (Kim sinh Thủy), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Bích Thượng Thổ, kỵ các tuổi: Giáp Ngọ và Bính Ngọ.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Bính Ngọ và Nhâm Tuất thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Tý lục hợp với Sửu, tam hợp với Thìn và Thân thành Thủy cục. Xung Ngọ, hình Mão, hại Mùi, phá Dậu, tuyệt Tỵ.',
            detail2 : ''
        }
    }
    else if( nameDay === 'Quý Mão'){
        return  {
            name : 'tức Can sinh Chi (Thủy sinh Mộc), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Kim Bạc Kim, kỵ các tuổi: Đinh Dậu và Tân Dậu.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Kỷ Hợi vì Kim khắc mà được lợi.',
            detail :'Ngày Mão lục hợp với Tuất, tam hợp với Mùi và Hợi thành Mộc cục. Xung Dậu, hình Tý, hại Thìn, phá Ngọ, tuyệt Thân.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Nhâm Dần'){
        return  {
            name : 'tức Can sinh Chi (Thủy sinh Mộc), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Kim Bạc Kim, kỵ các tuổi: Bính Thân và Canh Thân.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Mậu Tuất vì Kim khắc mà được lợi',
            detail :'NNgày Dần lục hợp với Hợi, tam hợp với Ngọ và Tuất thành Hỏa cục. Xung Thân, hình Tỵ, hại Tỵ, phá Hợi, tuyệt Dậu.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Ất Tỵ'){
        return  {
            name : 'tức Can sinh Chi (Mộc sinh Hỏa), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Phúc Đăng Hỏa, kỵ các tuổi: Kỷ Hợi và Tân Hợi.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Quý Dậu và Ất Mùi thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Tỵ lục hợp với Thân, tam hợp với Sửu và Dậu thành Kim cục. Xung Hợi, hình Thân, hại Dần, phá Thân, tuyệt Tý.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Giáp Thìn'){
        return  {
            name : 'tức Can khắc Chi (Mộc khắc Thổ), ngày này là ngày cát trung bình (chế nhật).',
            napAm : 'Ngày Phúc Đăng Hỏa, kỵ các tuổi: Mậu Tuất và Canh Tuất.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Nhâm Thân và Giáp Ngọ thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Thìn lục hợp với Dậu, tam hợp với Tý và Thân thành Thủy cục. Xung Tuất, hình Thìn, hình Mùi, hại Mão, phá Sửu, tuyệt Tuất.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Tỵ, Dậu, Sửu.'
        }
    }
    else if( nameDay === 'Đinh Mùi'){
        return  {
            name : 'tức Can sinh Chi (Hỏa sinh Thổ), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Thiên Hà Thủy, kỵ các tuổi: Tân Sửu.',
            description :' Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Kỷ Sửu, Đinh Dậu và Kỷ Mùi thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Mùi lục hợp với Ngọ, tam hợp với Mão và Hợi thành Mộc cục. Xung Sửu, hình Sửu, hại Tý, phá Tuất, tuyệt Sửu.',
            detail2 : 'Tam Sát kỵ mệnh tuổi Thân, Tý, Thìn.'
        }
    }
    else if(nameDay === 'Bính Ngọ'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Hỏa), ngày này là ngày cát.',
            napAm : 'Ngày Thiên Hà Thủy, kỵ các tuổi: Canh Tý.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Mậu Tý, Bính Thân và Mậu Ngọ thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Ngọ lục hợp với Mùi, tam hợp với Dần và Tuất thành Hỏa cục. Xung Tý, hình Ngọ, hình Dậu, hại Sửu, phá Mão, tuyệt Hợi.',
            detail2 : ''
        }
    }

    else if( nameDay === 'Kỷ Dậu'){
        return  {
            name : 'tức Can sinh Chi (Thổ sinh Kim), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Đại Dịch Thổ, kỵ các tuổi: Nhâm Dần và Giáp Dần.',
            description :' Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Bính Ngọ và Nhâm Tuất thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Thân lục hợp với Tỵ, tam hợp với Tý và Thìn thành Thủy cục. Xung Dần, hình Dần, hình Hợi, hại Hợi, phá Tỵ, tuyệt Mão',
            detail2 : ''
        }
    }
    else if(nameDay === 'Mậu Thân'){
        return  {
            name : 'tức Can sinh Chi (Thổ sinh Kim), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Đại Dịch Thổ, kỵ các tuổi: Quý Mão và Ất Mão.',
            description :' Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Đinh Mùi và Quý Hợi thuộc hành Thủy không sợ Thổ',
            detail :'Ngày Dậu lục hợp với Thìn, tam hợp với Sửu và Tỵ thành Kim cục. Xung Mão, hình Dậu, hại Tuất, phá Tý, tuyệt Dần',
            detail2 : ''
        }
    }
    else if(nameDay === 'Canh Tuất'){
        return  {
            name : 'tức Chi sinh Can (Thổ sinh Kim), ngày này là ngày cát (nghĩa nhật).',
            napAm : ' Ngày Thoa Xuyến Kim, kỵ các tuổi: Giáp Thìn và Mậu Thìn.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Mậu Tuất vì Kim khắc mà được lợi.',
            detail :'Ngày Tuất lục hợp với Mão, tam hợp với Dần và Ngọ thành Hỏa cục. Xung Thìn, hình Mùi, hại Dậu, phá Mùi, tuyệt Thìn.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Hợi, Mão, Mùi.'
        }
    }
    else if(nameDay === 'Tân Hợi'){
        return  {
            name : 'tức Can sinh Chi (Kim sinh Thủy), ngày này là ngày cát (bảo nhật).',
            napAm : ' Ngày Thoa Xuyến Kim, kỵ các tuổi: Ất Tỵ và Kỷ Tỵ.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Kỷ Hợi vì Kim khắc mà được lợi.',
            detail :'Ngày Hợi lục hợp với Dần, tam hợp với Mão và Mùi thành Mộc cục. Xung Tỵ, hình Hợi, hại Thân, phá Dần, tuyệt Ngọ.',
            detail2 : ''
        }
    }else if(nameDay === 'Nhâm Tý'){
        return  {
            name : 'tức Can Chi tương đồng ( cùng Thủy), ngày này là ngày cát.',
            napAm : 'Ngày Tang Chá Mộc, kỵ các tuổi: Bính Ngọ và Canh Ngọ.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Canh Ngọ, Mậu Thân và Bính Thìn thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Tý lục hợp với Sửu, tam hợp với Thìn và Thân thành Thủy cục. Xung Ngọ, hình Mão, hại Mùi, phá Dậu, tuyệt Tỵ.',
            detail2 : ''
        }
    }else if(nameDay === 'Quý Sửu'){
        return  {
            name : 'tức Chi khắc Can (Thổ khắc Thủy), là ngày hung (phạt nhật).',
            napAm : 'Ngày Tang Chá Mộc, kỵ các tuổi: Đinh Mùi và Tân Mùi.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Tân Mùi, Kỷ Dậu và Đinh Tỵ thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Sửu lục hợp với Tý, tam hợp với Tỵ và Dậu thành Kim cục. Xung Mùi, hình Tuất, hại Ngọ, phá Thìn, tuyệt Mùi.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Dần, Ngọ, Tuất.'
        }
    }else if(nameDay === 'Giáp Dần'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Mộc), ngày này là ngày cát.',
            napAm : 'Ngày Đại Khê Thủy, kỵ các tuổi: Mậu Thân và Bính Thân.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Mậu Tý, Bính Thân và Mậu Ngọ thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Dần lục hợp với Hợi, tam hợp với Ngọ và Tuất thành Hỏa cục. Xung Thân, hình Tỵ, hại Tỵ, phá Hợi, tuyệt Dậu.',
            detail2 : ''
        }
    }else if(nameDay === 'Ất Mão'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Mộc), ngày này là ngày cát.',
            napAm : 'Ngày Đại Khê Thủy, kỵ các tuổi: Kỷ Dậu và Đinh Dậu.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Kỷ Sửu, Đinh Dậu và Kỷ Mùi thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Mão lục hợp với Tuất, tam hợp với Mùi và Hợi thành Mộc cục. Xung Dậu, hình Tý, hại Thìn, phá Ngọ, tuyệt Thân.',
            detail2 : ''
        }
    }
    else if(nameDay === 'Bính Thìn'){
        return  {
            name : 'tức Can sinh Chi (Hỏa sinh Thổ), ngày này là ngày cát (bảo nhật).',
            napAm : 'Ngày Sa Trung Thổ, kỵ các tuổi: Canh Tuất và Nhâm Tuất.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Bính Ngọvà Nhâm Tuất thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Thìn lục hợp với Dậu, tam hợp với Tý và Thân thành Thủy cục. Xung Tuất, hình Thìn, hình Mùi, hại Mão, phá Sửu, tuyệt Tuất.',
            detail2 : 'Tam Sát kỵ mệnh tuổi Tỵ, Dậu, Sửu.'
        }
    }else if(nameDay === 'Đinh Tỵ'){
        return  {
            name : ' tức Can Chi tương đồng (cùng Hỏa), ngày này là ngày cát.',
            napAm : 'Ngày Sa Trung Thổ, kỵ các tuổi: Tân Hợi và Quý Hợi.',
            description :'Ngày này thuộc hành Thổ khắc với hành Thủy, ngoại trừ các tuổi: Đinh Mùi và Quý Hợi thuộc hành Thủy không sợ Thổ.',
            detail :'Ngày Tỵ lục hợp với Thân, tam hợp với Sửu và Dậu thành Kim cục. Xung Hợi, hình Thân, hại Dần, phá Thân, tuyệt Tý.',
            detail2 : ''
        }
    }else if(nameDay === 'Mậu Ngọ'){
        return  {
            name : 'tức Chi sinh Can (Hỏa sinh Thổ), ngày này là ngày cát (nghĩa nhật).',
            napAm : 'Ngày Thiên Thượng Hỏa, kỵ các tuổi: Nhâm Tý và Giáp Tý.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Nhâm Thân và Giáp Ngọ thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Ngọ lục hợp với Mùi, tam hợp với Dần và Tuất thành Hỏa cục. Xung Tý, hình Ngọ, hình Dậu, hại Sửu, phá Mão, tuyệt Hợi.',
            detail2 : ''
        }
    }else if(nameDay === 'Kỷ Mùi'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Thổ), ngày này là ngày cát.',
            napAm : 'Ngày Thiên Thượng Hỏa, kỵ các tuổi: Quý Sửu và Ất Sửu.',
            description :'Ngày này thuộc hành Hỏa khắc với hành Kim, ngoại trừ các tuổi: Quý Dậu và Ất Mùi thuộc hành Kim không sợ Hỏa.',
            detail :'Ngày Mùi lục hợp với Ngọ, tam hợp với Mão và Hợi thành Mộc cục. Xung Sửu, hình Sửu, hại Tý, phá Tuất, tuyệt Sửu.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Thân, Tý, Thìn.'
        }
    }else if(nameDay === 'Canh Thân'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Kim), ngày này là ngày cát.',
            napAm : 'Ngày Thạch Lựu Mộc, kỵ các tuổi: Giáp Dần và Mậu Dần.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Canh Ngọ, Mậu Thân và Bính Thìn thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Thân lục hợp với Tỵ, tam hợp với Tý và Thìn thành Thủy cục. Xung Dần, hình Dần, hình Hợi, hại Hợi, phá Tỵ, tuyệt Mão.',
            detail2 : ''
        }
    }else if(nameDay === 'Tân Dậu'){
        return  {
            name : 'tức Can Chi tương đồng (cùng Kim), ngày này là ngày cát.',
            napAm : 'Ngày Thạch Lựu Mộc, kỵ các tuổi: Ất Mão và Kỷ Mão.',
            description :'Ngày này thuộc hành Mộc khắc với hành Thổ, ngoại trừ các tuổi: Tân Mùi, Kỷ Dậu và Đinh Tỵ thuộc hành Thổ không sợ Mộc.',
            detail :'Ngày Dậu lục hợp với Thìn, tam hợp với Sửu và Tỵ thành Kim cục. Xung Mão, hình Dậu, hại Tuất, phá Tý, tuyệt Dần.',
            detail2 : ''
        }
    }else if(nameDay === 'Nhâm Tuất'){
        return  {
            name : 'tức Chi khắc Can (Thổ khắc Thủy), là ngày hung (phạt nhật).',
            napAm : 'Ngày Đại Hải Thủy, kỵ các tuổi: Bính Thìn và Giáp Thìn.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Mậu Tý, Bính Thân và Mậu Ngọ thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Tuất lục hợp với Mão, tam hợp với Dần và Ngọ thành Hỏa cục. Xung Thìn, hình Mùi, hại Dậu, phá Mùi, tuyệt Thìn.',
            detail2 : 'Tam Sát kỵ mệnh các tuổi Hợi, Mão, Mùi.'
        }
    }else if(nameDay === 'Quý Hợi'){
        return  {
            name : ' tức Can Chi tương đồng (Thủy), ngày này là ngày cát.',
            napAm : ' Ngày Đại Hải Thủy, kỵ các tuổi: Đinh Tỵ và Ất Tỵ.',
            description :'Ngày này thuộc hành Thủy khắc với hành Hỏa, ngoại trừ các tuổi: Kỷ Sửu, Đinh Dậu và Kỷ Mùi thuộc hành Hỏa không sợ Thủy.',
            detail :'Ngày Tuất lục hợp với Mão, tam hợp với Dần và Ngọ thành Hỏa cục. Xung Thìn, hình Mùi, hại Dậu, phá Mùi, tuyệt Thìn.',
            detail2 : 'Ngày Hợi lục hợp với Dần, tam hợp với Mão và Mùi thành Mộc cục. Xung Tỵ, hình Hợi, hại Thân, phá Dần, tuyệt Ngọ.'
        }
    }else if(nameDay === 'Giáp Tý'){
        return  {
            name : 'tức Chi sinh Can (Thủy sinh Mộc), ngày này là ngày cát (nghĩa nhật).',
            napAm : ' Ngày Hải Trung Kim, kỵ các tuổi: Mậu Ngọ và Nhâm Ngọ.',
            description :'Ngày này thuộc hành Kim khắc với hành Mộc, ngoại trừ các tuổi: Mậu Tuất vì Kim khắc nên được lợi.',
            detail :'Ngày Tý lục hợp với Sửu, tam hợp với Thìn và Thân thành Thủy cục. Xung Ngọ, hình Mão, hại Mùi, phá Dậu, tuyệt Tỵ.',
            detail2 : ''
        }
    }

    // bắt đầu từ ngày ất sửu
}

// Bảng sao Thập Nhị Bát Tú theo thứ và tuần
const bangThapNhiBatTu = {
    4: ["Giác", "Đẩu", "Tỉnh", "Khuê"],
    5: ["Cang", "Ngưu", "Lâu", "Quỷ"],
    6: ["Đê", "Nữ", "Vị", "Liễu"],
    0: ["Phòng", "Hư", "Mão", "Tinh"],
    1: ["Tâm", "Nguy", "Tất", "Trương"],
    2: ["Vĩ", "Thất", "Chủy", "Dực"],
    3: ["Cơ", "Bích", "Sâm", "Chẩn"]
  };
  
function tinhTuanCuaNgay(ngay) {
    return (Math.floor((ngay - 1) / 7) + 1) % 4;
}

// Hàm tính sao Thập Nhị Bát Tú dựa vào ngày và thứ trong tuần
const  tinhThapNhiBatTu =(ngay, thu)=> {
    const xxxxx = dayOfWeek.indexOf(thu);
    if (xxxxx === -1) {
        console.log("Thứ không hợp lệ!");
        return null;
    }
    const dayParts = ngay.split('-');
    const day = Number(dayParts[0]);
    const tuan = tinhTuanCuaNgay(day);
    const index = (tuan + 1) % 4;
    const datasss = bangThapNhiBatTu[xxxxx][index]; 
    const detailStart = thapNhiBatTu[datasss];
    return detailStart;
}

const ngayHoangDaoVaHacDao = (mm, yy) => {
    let daysInMonth = [];
    let informationDayInMonth = [];
    let date = new Date(yy, mm - 1, 1);
    const months = mm;
    const years = yy;
    // Lấy tất cả các ngày trong tháng
    while (date.getMonth() === months - 1) {
        daysInMonth.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }    
    const lengthMonth = daysInMonth.length;
    // Lặp qua từng ngày và tính thông tin
    for (let i = 0; i < lengthMonth; i++) {
        const ngayDuong = daysInMonth[i];
        const rank = rankOffWeek(ngayDuong, mm, yy);
        const ngayAm = convertSolar2Lunar(ngayDuong, mm, yy, 7);
        const getNgayAm = ngayAm.split('-');
        const amLich = `${getNgayAm[0]}/${getNgayAm[1]}`;
        const dayCanChi = getNameDay(ngayDuong, mm, yy);
        const thangAm = getNgayAm[1];
        const getChi = dayCanChi.split(' ');
        const nameChi = getChi[1];
        const ngayHoangDaoHoachacDao = ngayHoangDaovaHacDao[Number(thangAm)-1];
        const  good = ngayHoangDaoHoachacDao.good;
        const bad = ngayHoangDaoHoachacDao.bad;
        let status;
        if(good.includes(nameChi)){
             status = 1;
        }else if(bad.includes(nameChi)){
            status = 2;
        }else {
            status = 0
        }
        informationDayInMonth.push({
            ngayDuong,
            rank,
            amLich,
            dayCanChi,
            status
        });
    }  
    
    return {
        informationDayInMonth,
        months,
        years
    }; 
};

export { canNgay, chiNgay, 
    jdFormDate, layGioHoangDao ,getNameDay,
    getNameMonth, getNameYear, convertSolar2Lunar,rankOffWeek,
    departureDirection, layGioHoangDaoChiTiet, layGioHacDao, departureTime,
    getInforDayCan, getInforDayChi, getKhongMinh, lichTietKhi, 
    getKhongMinhLucDieu, cacNgayKy, thapNhiKienTruc, startInDay, startBadDay,
     nguHanh, tinhThapNhiBatTu, ngayHoangDaoVaHacDao
};
