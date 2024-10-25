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
    return khongMinhLucDieu[valueChi];
 }

 const cacNgayKy = (dd, valueday) => { 
    const ngayAm = dd.split('-');
    const day = Number(ngayAm[0]);
    const month = Number(ngayAm[1]);
    const years = Number(ngayAm[2]);

    const nameDay = getNameDay(valueday.getDate(), valueday.getMonth() + 1, valueday.getFullYear());
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
    // Tách ngày và tháng âm lịch từ 'ngayAmLich'
    const day = ngayAmLich.split('-');
    const date = Number(day[0]);  // Ngày âm lịch
    const month = Number(day[1]); // Tháng âm lịch

    // Tách chi của ngày từ 'nameDay'
    const name = nameDay.split('-');
    const chiDay = name[1]; // Ví dụ: Tuất, Hợi, Dần,...
    console.log(ngayAmLich);
    console.log(nameDay);
    // Danh sách các Trực
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
            description3 : "Lên quan lãnh chức, uống thuốc, vào làm hành chính, dâng nộp đơn từ."
        },
        4: {
            name: 'Trực Binh',
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
            description4 : "Là ngày Nhật Nguyệt tương xung. Ngày có trực Phá muôn việc làm vào ngày này đều bất lợi, chỉ nên phá dỡ nhà cửa."
        },
        8: {
            name: 'Trực Nguy',
            description4 : "Nói đến Trực Nguy là nói đến sự Nguy hiểm, suy thoái. Chính vì thế ngày có trực Nguy là ngày xấu, tiến hành muôn việc đều hung."
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

    let baseTruc = 1; 
    if (month === 9 && chiDay === 'Tuất') {
        baseTruc = 1;  
    }else {
        for (let i = 1; i <= 12; i++) {
            if(baseTruc === 12){
                baseTruc = 1;
                return kienTruData[1]; 
            }
            if (i === baseTruc) {
                const index = (date + baseTruc) % 12;
                baseTruc = baseTruc + 1;
                if (typeof kienTruData[index + 1] === 'object') {
                    return kienTruData[index + 1];  
                }
                return kienTruData[index + 1];
            }
        }
    }
    if (month === 10 && chiDay === 'Tuất') {
        baseTruc = 1;  // 
    }else {
        for (let i = 1; i <= 12; i++) {
            if (i === baseTruc) {
                if(baseTruc === 12){
                    return kienTruData[1]; 
                }
                const index = (date + baseTruc) % 12;
                baseTruc = baseTruc + 1;
                if (typeof kienTruData[index + 1] === 'object') {
                    return kienTruData[index + 1];  
                }
                return kienTruData[index + 1];
            }
        }
    }

    if (month === 11 && chiDay === 'Tý') {
        baseTruc = 1;  // 
    }else {
        for (let i = 1; i <= 12; i++) {
            if (i === baseTruc) {
                if(baseTruc === 12){
                    return kienTruData[1]; 
                }
                const index = (date + baseTruc) % 12
                baseTruc = baseTruc + 1;
                if (typeof kienTruData[index + 1] === 'object') {
                    return kienTruData[index + 1];  
                }
                return kienTruData[index + 1];
            }
        }
    }

    if (month === 12 && chiDay === 'Sửu') {
        baseTruc = 1;  // 
    }else {
        for (let i = 1; i <= 12; i++) {
            if (i === baseTruc) {
                const index = (date + baseTruc) % 12;
                if (typeof kienTruData[index + 1] === 'object') {
                    return kienTruData[index + 1];  
                }
                return kienTruData[index + 1];
            }
        }
    }

    if (month === 1 && chiDay === 'Sửu') {
        baseTruc = 1;  // 
    }else {
        for (let i = 1; i <= 12; i++) {
            if (i === baseTruc) {
                const index = (date + baseTruc) % 12;
                if (typeof kienTruData[index + 1] === 'object') {
                    return kienTruData[index + 1];  
                }
                return kienTruData[index + 1];
            }
        }
    }
    return kienTruData[baseTruc];
};

const startInDay =(nameDay, ngayAm)=> {
    const day = nameDay.split(' ');
    const name = day[1];
    const name2 = day[0];
    console.log(name);
    
    const monthOfDay = ngayAm.split('-');
    const month = Number(monthOfDay[1]);
    console.log(month);
    let  startGood = [];

    if((month === 1 && name === 'Đinh') || (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Nhâm') || (month === 4 && name === 'Tân') || 
    (month === 5 && name === 'Hợi') || (month === 6 && name === 'Giáp') ||
    (month === 7 && name === 'Quý') || (month === 8 && name === 'Dần') ||
    (month === 9 && name === 'Bính') || (month === 10 && name === 'Ất') ||
    (month === 11 && name === 'Tỵ') || (month === 12 && name === 'Canh')
    ){
        startGood.push('Thiên Đức: Tốt cho mọi việc.')
    }

    if((month === 1 && name === 'Bính') || (month === 2 && name === 'Giáp') ||
    (month === 3 && name === 'Nhâm') || (month === 4 && name === 'Canh') || 
    (month === 5 && name === 'Bính') || (month === 6 && name === 'Giáp') ||
    (month === 7 && name === 'Nhâm') || (month === 8 && name === 'Canh') ||
    (month === 9 && name === 'Bính') || (month === 10 && name === 'Giáp') ||
    (month === 11 && name === 'Nhâm') || (month === 12 && name === 'Nhâm')
    ){
        startGood.push('Nguyệt Đức: Tốt cho mọi việc.')
    }

    if((month === 1 && name === 'Tuất') || (month === 2 && name === 'Hợi') ||
    (month === 3 && name === 'Tý') || (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Dần') || (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Thìn') || (month === 8 && name === 'Tỵ') ||
    (month === 9 && name === 'Ngọ') || (month === 10 && name === 'Mùi') ||
    (month === 11 && name === 'Thân') || (month === 12 && name === 'Dậu')
    ){
        startGood.push('Sao Thiên Hỷ: tốt mọi việc, nhất là việc cưới hỏi')
    }

    if((month === 1 && name === 'Thìn') || (month === 2 && name === 'Tỵ') ||
    (month === 3 && name === 'Ngọ') || (month === 4 && name === 'Mùi') || 
    (month === 5 && name === 'Thân') || (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Tuất') || (month === 8 && name === 'Hợi') ||
    (month === 9 && name === 'Tý') || (month === 10 && name === 'Sửu') ||
    (month === 11 && name === 'Dần') || (month === 12 && name === 'Mão')
    ){
        startGood.push('Sao Thiên Phú: tốt mọi việc, nhất là xây dựng, khai trương, an táng')
    }


    if((month === 1 && name === 'Tuất') || (month === 2 && name === 'Hợi') ||
    (month === 3 && name === 'Tý') || (month === 4 && name === 'Sửu') || 
    (month === 5 && name === 'Dần') || (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Thìn') || (month === 8 && name === 'Tỵ') ||
    (month === 9 && name === 'Ngọ') || (month === 10 && name === 'Mùi') ||
    (month === 11 && name === 'Thân') || (month === 12 && name === 'Dậu')
    ){
        startGood.push('Sao Thiên Hỷ: tốt mọi việc, nhất là việc cưới hỏi')
    }

    if((month === 1 && name2 === 'Giáp' || name2 === "Ất") || (month === 2 && name2 === 'Giáp' || name2 === 'Ất') ||
    (month === 3 && name2 === 'Giáp' || name2 === 'Ất') || (month === 4 && name2 === 'Bính' || name2 === 'Đinh') || 
    (month === 5 && name2 === 'Bính' || name2 === 'Đinh') || (month === 6 && name2 === 'Bính' || name2 === 'Đinh') ||
    (month === 7 && name2 === 'Canh'|| name2 === 'Tân') || (month === 8 && name2 === 'Canh' || name2 === 'Tân') ||
    (month === 9 && name2 === 'Canh' || name2 === 'Tân') || (month === 10 && name2 === 'Nhâm' || name2 === 'Quý') ||
    (month === 11 && name2 === 'Nhâm' || name2 === 'Quý') || (month === 12 && name2 === 'Nhâm' || name2 === 'Quý')
    ){
        startGood.push('Sao Thiên Quý: tốt mọi việc')
    }

    if((month === 1 && name === 'Dần') || (month === 2 && name === 'Dần') ||
    (month === 3 && name === 'Dần') || (month === 4 && name === 'Tỵ') || 
    (month === 5 && name === 'Tỵ') || (month === 6 && name === 'Tỵ') ||
    (month === 7 && name === 'Thân') || (month === 8 && name === 'Thân') ||
    (month === 9 && name === 'Thân') || (month === 10 && name === 'Hợi') ||
    (month === 11 && name === 'Hợi') || (month === 12 && name === 'Hợi')
    ){
        startGood.push('Sao Phúc Hậu: tốt cho việc cầu tài, khai trương')
    }

    if((month === 1 && name === 'Ngọ') || (month === 2 && name === 'Ngọ') ||
    (month === 3 && name === 'Ngọ') || (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Dậu') || (month === 6 && name === 'Dậu') ||
    (month === 7 && name === 'Tý') || (month === 8 && name === 'Tý') ||
    (month === 9 && name === 'Tý') || (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Mão') || (month === 12 && name === 'Mão')
    ){
        startGood.push(' Sao Dân Nhật, Thời Đức: tốt mọi việc')
    }


    if((month === 1 && name2 === 'Tý' || name2 === "Sửu") || (month === 2 && name2 === 'Tý' || name2 === "Sửu") ||
    (month === 3 && name2 === 'Tý' || name2 === "Sửu") || (month === 4 && name2 === 'Thìn' || name2 === 'Tỵ') || 
    (month === 5 && name2 === 'Thìn' || name2 === 'Tỵ') || (month === 6 && name2 === 'Thìn' || name2 === 'Tỵ') ||
    (month === 7 && name2 === 'Ngọ'|| name2 === 'Mùi') || (month === 8 && name2 === 'Ngọ'|| name2 === 'Mùi') ||
    (month === 9 && name2 === 'Ngọ'|| name2 === 'Mùi') || (month === 10 && name2 === 'Thân' || name2 === 'Tuất') ||
    (month === 11 && name2 === 'Thân' || name2 === 'Tuất') || (month === 12 && name2 === 'Thân' || name2 === 'Tuất')
    ){
        startGood.push(' Sao Đại Hồng Sa: tốt mọi việc')
    }

    if((month === 1 && name === 'Dậu') || (month === 2 && name === 'Mùi') ||
    (month === 3 && name === 'Tỵ') || (month === 4 && name === 'Mão') || 
    (month === 5 && name === 'Sửu') || (month === 6 && name === 'Hợi') ||
    (month === 7 && name === 'Dậu') || (month === 8 && name === 'Mùi') ||
    (month === 9 && name === 'Tỵ') || (month === 10 && name === 'Mão') ||
    (month === 11 && name === 'Sửu') || (month === 12 && name === 'Hợi')
    ){
        startGood.push('Sao Âm Đức: tốt mọi việc')
    }

    if((month === 1 && name === 'Hợi') || (month === 2 && name === 'Thìn') ||
    (month === 3 && name === 'Sửu') || (month === 4 && name === 'Ngọ') || 
    (month === 5 && name === 'Mão') || (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Tỵ') || (month === 8 && name === 'Tuất') ||
    (month === 9 && name === 'Mùi') || (month === 10 && name === 'Tỵ') ||
    (month === 11 && name === 'Dậu') || (month === 12 && name === 'Dần')
    ){
        startGood.push('Sao U Vi Tinh: tốt mọi việc')
    }

    if((month === 1 && name === 'Mùi') || (month === 2 && name === 'Sửu') ||
    (month === 3 && name === 'Thân') || (month === 4 && name === 'Dần') || 
    (month === 5 && name === 'Dậu') || (month === 6 && name === 'Mão') ||
    (month === 7 && name === 'Tuất') || (month === 8 && name === 'Thìn') ||
    (month === 9 && name === 'Hợi') || (month === 10 && name === 'Tỵ') ||
    (month === 11 && name === 'Tý') || (month === 12 && name === 'Ngọ')
    ){
        startGood.push('Sao Kính Tâm: tốt với việc tang tế')
    }

    if((month === 1 && name === 'Sửu') || (month === 2 && name === 'Tý') ||
    (month === 3 && name === 'Hợi') || (month === 4 && name === 'Tuất') || 
    (month === 5 && name === 'Dậu') || (month === 6 && name === 'Thân') ||
    (month === 7 && name === 'Mùi') || (month === 8 && name === 'Ngọ') ||
    (month === 9 && name === 'Tỵ') || (month === 10 && name === 'Thìn') ||
    (month === 11 && name === 'Mão') || (month === 12 && name === 'Dần')
    ){
        startGood.push('Sao Tuế Hợp: tốt mọi việc')
    }

    if((month === 1 && name === 'Thân') || (month === 2 && name === 'Thân') ||
    (month === 3 && name === 'Dậu') || (month === 4 && name === 'Dậu') || 
    (month === 5 && name === 'Tuất') || (month === 6 && name === 'Tuất') ||
    (month === 7 && name === 'Hợi') || (month === 8 && name === 'Hợi') ||
    (month === 9 && name === 'Ngọ') || (month === 10 && name === 'Ngọ') ||
    (month === 11 && name === 'Mùi') || (month === 12 && name === 'Mùi')
    ){
        startGood.push('Sao Nguyệt Giải: tốt mọi việc')
    }

    console.log(startGood);
    
    return startGood;
}

export { canNgay, chiNgay, 
    jdFormDate, layGioHoangDao ,getNameDay,
    getNameMonth, getNameYear, convertSolar2Lunar,rankOffWeek,
    departureDirection, layGioHoangDaoChiTiet, layGioHacDao, departureTime,
    getInforDayCan, getInforDayChi, getKhongMinh, lichTietKhi, 
    getKhongMinhLucDieu, cacNgayKy, thapNhiKienTruc, startInDay
};
