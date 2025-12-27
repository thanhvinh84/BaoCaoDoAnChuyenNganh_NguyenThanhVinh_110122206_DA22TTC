import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Đăng ký các thành phần Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

export default function Thongke() {
  const [tongSoKhachHang, setTongSoKhachHang] = useState(0);
  const [soLuongChuaXuLy, setSoLuongChuaXuLy] = useState(0);
  const [doanhThuNam, setDoanhThuNam] = useState(0);
  const [doanhThuThang, setDoanhThuThang] = useState(0);
  const [doanhThuTheoThang, setDoanhThuTheoThang] = useState([]);
  const [thongKeTrangThai, setThongKeTrangThai] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  const currentYear = new Date().getFullYear();

  // Hàm xuất Excel
  const exportToExcel = () => {
    const monthLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                         'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    
    // Sheet 1: Tổng quan
    const tongQuanData = [
      ['BÁO CÁO THỐNG KÊ - SHOP PHỤ KIỆN'],
      ['Ngày xuất:', new Date().toLocaleDateString('vi-VN')],
      [],
      ['THỐNG KÊ TỔNG QUAN'],
      ['Chỉ tiêu', 'Giá trị'],
      ['Thu nhập tháng này', formatVND(doanhThuThang)],
      ['Thu nhập năm ' + currentYear, formatVND(doanhThuNam)],
      ['Đơn hàng chờ xử lý', soLuongChuaXuLy],
      ['Tổng số khách hàng', tongSoKhachHang],
    ];

    // Sheet 2: Doanh thu theo tháng
    const doanhThuData = [
      ['DOANH THU THEO THÁNG - NĂM ' + currentYear],
      [],
      ['Tháng', 'Doanh thu (VNĐ)', 'Số đơn hàng']
    ];
    
    const monthlyRevenue = getMonthlyRevenue();
    const monthlyOrders = getMonthlyData();
    monthLabels.forEach((month, index) => {
      doanhThuData.push([month, monthlyRevenue[index], monthlyOrders[index]]);
    });
    doanhThuData.push([]);
    doanhThuData.push(['Tổng cộng', monthlyRevenue.reduce((a, b) => a + b, 0), monthlyOrders.reduce((a, b) => a + b, 0)]);

    // Sheet 3: Trạng thái đơn hàng
    const trangThaiData = [
      ['THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG'],
      [],
      ['Trạng thái', 'Số lượng', 'Tỷ lệ (%)']
    ];
    
    const tongDon = thongKeTrangThai.reduce((sum, item) => sum + item.so_luong, 0);
    thongKeTrangThai.forEach(item => {
      const tyLe = tongDon > 0 ? ((item.so_luong / tongDon) * 100).toFixed(1) : 0;
      trangThaiData.push([getTrangThaiLabel(item.trang_thai), item.so_luong, tyLe + '%']);
    });
    trangThaiData.push([]);
    trangThaiData.push(['Tổng cộng', tongDon, '100%']);

    // Tạo workbook
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.aoa_to_sheet(tongQuanData);
    const ws2 = XLSX.utils.aoa_to_sheet(doanhThuData);
    const ws3 = XLSX.utils.aoa_to_sheet(trangThaiData);

    // Định dạng độ rộng cột
    ws1['!cols'] = [{ wch: 25 }, { wch: 20 }];
    ws2['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }];
    ws3['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');
    XLSX.utils.book_append_sheet(wb, ws2, 'Doanh thu theo tháng');
    XLSX.utils.book_append_sheet(wb, ws3, 'Trạng thái đơn hàng');

    // Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `ThongKe_${currentYear}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
  };

  // Hàm in báo cáo
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Báo cáo thống kê - Shop Phụ Kiện</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4e73df; padding-bottom: 20px; }
          .header h1 { color: #4e73df; font-size: 28px; margin-bottom: 5px; }
          .header p { color: #666; font-size: 14px; }
          .section { margin-bottom: 30px; }
          .section-title { background: linear-gradient(135deg, #4e73df 0%, #224abe 100%); color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 15px; font-size: 16px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .stat-card { background: #f8f9fc; border-left: 4px solid #4e73df; padding: 15px 20px; border-radius: 0 8px 8px 0; }
          .stat-card.success { border-left-color: #1cc88a; }
          .stat-card.warning { border-left-color: #f6c23e; }
          .stat-card.info { border-left-color: #36b9cc; }
          .stat-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600; }
          .stat-value { font-size: 22px; font-weight: 700; color: #333; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #4e73df; color: white; padding: 12px; text-align: left; font-size: 13px; }
          td { padding: 10px 12px; border-bottom: 1px solid #e3e6f0; font-size: 13px; }
          tr:nth-child(even) { background: #f8f9fc; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e3e6f0; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 BÁO CÁO THỐNG KÊ</h1>
          <p>Shop Phụ Kiện - Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <div class="section">
          <div class="section-title">📈 THỐNG KÊ TỔNG QUAN</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Thu nhập tháng này</div>
              <div class="stat-value">${formatVND(doanhThuThang)}</div>
            </div>
            <div class="stat-card success">
              <div class="stat-label">Thu nhập năm ${currentYear}</div>
              <div class="stat-value">${formatVND(doanhThuNam)}</div>
            </div>
            <div class="stat-card warning">
              <div class="stat-label">Đơn hàng chờ xử lý</div>
              <div class="stat-value">${soLuongChuaXuLy}</div>
            </div>
            <div class="stat-card info">
              <div class="stat-label">Tổng số khách hàng</div>
              <div class="stat-value">${tongSoKhachHang}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">💰 DOANH THU THEO THÁNG - NĂM ${currentYear}</div>
          <table>
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Doanh thu</th>
                <th>Số đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              ${['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'].map((month, index) => `
                <tr>
                  <td>${month}</td>
                  <td>${formatVND(getMonthlyRevenue()[index])}</td>
                  <td>${getMonthlyData()[index]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">📦 THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG</div>
          <table>
            <thead>
              <tr>
                <th>Trạng thái</th>
                <th>Số lượng</th>
                <th>Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              ${thongKeTrangThai.map(item => {
                const tongDon = thongKeTrangThai.reduce((sum, i) => sum + i.so_luong, 0);
                const tyLe = tongDon > 0 ? ((item.so_luong / tongDon) * 100).toFixed(1) : 0;
                return `
                  <tr>
                    <td>${getTrangThaiLabel(item.trang_thai)}</td>
                    <td>${item.so_luong}</td>
                    <td>${tyLe}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>© ${currentYear} Shop Phụ Kiện - Báo cáo được tạo tự động</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Lấy thống kê tổng quan
  const fetchThongKeTongQuan = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/thongke/tongquan');
      const data = response.data;
      setDoanhThuThang(data.doanh_thu_thang || 0);
      setDoanhThuNam(data.doanh_thu_nam || 0);
      setSoLuongChuaXuLy(data.don_chua_xu_ly || 0);
      setTongSoKhachHang(data.tong_khach_hang || 0);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê tổng quan:", error);
      // Fallback: lấy dữ liệu theo cách cũ
      fetchTongSoKhachHang();
      fetchSoLuongChuaXuLy();
      fetchDoanhThuNam();
      fetchDoanhThuThangOld();
    }
  };

  // Fallback functions
  const fetchTongSoKhachHang = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getallkh');
      setTongSoKhachHang(response.data.length);
    } catch (error) {
      console.error("Lỗi khi lấy tổng số khách hàng:", error);
    }
  };

  const fetchSoLuongChuaXuLy = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getalldonhang');
      const countChuaXuLy = response.data.filter(lich => lich.trang_thai === 1).length;
      setSoLuongChuaXuLy(countChuaXuLy);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
    }
  };

  const fetchDoanhThuNam = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getalldonhang');
      const namHienTai = new Date().getFullYear();
      const tongDoanhThuNam = response.data
        .filter(lich => new Date(lich.ngay_dat_hang).getFullYear() === namHienTai && lich.trang_thai_thanh_toan === 2)
        .reduce((tong, lich) => tong + (lich.tong_tien || 0), 0);
      setDoanhThuNam(tongDoanhThuNam);
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu năm:", error);
    }
  };

  const fetchDoanhThuThangOld = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getalldonhang');
      const ngayHienTai = new Date();
      const thang = ngayHienTai.getMonth();
      const nam = ngayHienTai.getFullYear();
      const tongDoanhThuThang = response.data
        .filter(lich => {
          const ngaymua = new Date(lich.ngay_dat_hang);
          return ngaymua.getFullYear() === nam && ngaymua.getMonth() === thang && lich.trang_thai_thanh_toan === 2;
        })
        .reduce((tong, lich) => tong + (lich.tong_tien || 0), 0);
      setDoanhThuThang(tongDoanhThuThang);
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu tháng:", error);
    }
  };

  // Lấy doanh thu theo tháng cho biểu đồ
  const fetchDoanhThuTheoThang = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/thongke/doanhthu/${currentYear}`);
      setDoanhThuTheoThang(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu theo tháng:", error);
      // Fallback: tính từ danh sách đơn hàng
      try {
        const res = await axios.get('http://localhost:5000/api/getalldonhang');
        const donHang = res.data.filter(d => 
          new Date(d.ngay_dat_hang).getFullYear() === currentYear && d.trang_thai_thanh_toan === 2
        );
        const thongKe = [];
        for (let i = 1; i <= 12; i++) {
          const doanhThu = donHang
            .filter(d => new Date(d.ngay_dat_hang).getMonth() + 1 === i)
            .reduce((sum, d) => sum + (d.tong_tien || 0), 0);
          const soDon = donHang.filter(d => new Date(d.ngay_dat_hang).getMonth() + 1 === i).length;
          if (doanhThu > 0 || soDon > 0) {
            thongKe.push({ thang: i, doanh_thu: doanhThu, so_don_hang: soDon });
          }
        }
        setDoanhThuTheoThang(thongKe);
      } catch (err) {
        console.error("Lỗi fallback:", err);
      }
    }
  };

  // Lấy thống kê trạng thái đơn hàng
  const fetchThongKeTrangThai = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/thongke/trangthai');
      setThongKeTrangThai(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê trạng thái:", error);
      // Fallback
      try {
        const res = await axios.get('http://localhost:5000/api/getalldonhang');
        const donHang = res.data;
        const trangThaiCount = {};
        donHang.forEach(d => {
          trangThaiCount[d.trang_thai] = (trangThaiCount[d.trang_thai] || 0) + 1;
        });
        const thongKe = Object.entries(trangThaiCount).map(([trang_thai, so_luong]) => ({
          trang_thai: parseInt(trang_thai),
          so_luong
        }));
        setThongKeTrangThai(thongKe);
      } catch (err) {
        console.error("Lỗi fallback:", err);
      }
    }
  };

  const formatVND = (number) => {
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchThongKeTongQuan(),
        fetchDoanhThuTheoThang(),
        fetchThongKeTrangThai()
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);


  // Chuẩn bị dữ liệu cho biểu đồ tròn (Tỷ lệ đơn hàng theo trạng thái)
  const getTrangThaiLabel = (trangThai) => {
    const labels = {
      1: 'Chờ xử lý',
      2: 'Đang xử lý',
      3: 'Đang giao',
      4: 'Đã giao',
      5: 'Đã hủy'
    };
    return labels[trangThai] || `Trạng thái ${trangThai}`;
  };

  const pieChartData = {
    labels: thongKeTrangThai.map(item => getTrangThaiLabel(item.trang_thai)),
    datasets: [{
      data: thongKeTrangThai.map(item => item.so_luong),
      backgroundColor: [
        '#f6c23e', // Chờ xử lý - vàng
        '#36b9cc', // Đang xử lý - xanh dương
        '#4e73df', // Đang giao - xanh đậm
        '#1cc88a', // Đã giao - xanh lá
        '#e74a3b', // Đã hủy - đỏ
      ],
      borderWidth: 1
    }]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false
      }
    }
  };

  // Chuẩn bị dữ liệu cho biểu đồ đường (Tỷ lệ đơn hàng theo tháng)
  const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  
  const getMonthlyData = () => {
    const data = new Array(12).fill(0);
    doanhThuTheoThang.forEach(item => {
      data[item.thang - 1] = item.so_don_hang || 0;
    });
    return data;
  };

  const lineChartData = {
    labels: monthLabels,
    datasets: [{
      label: 'Số đơn hàng',
      data: getMonthlyData(),
      borderColor: '#4e73df',
      backgroundColor: 'rgba(78, 115, 223, 0.1)',
      tension: 0.3,
      fill: true
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value + ' đơn';
          }
        }
      }
    }
  };

  // Chuẩn bị dữ liệu cho biểu đồ cột (Doanh thu theo tháng)
  const getMonthlyRevenue = () => {
    const data = new Array(12).fill(0);
    doanhThuTheoThang.forEach(item => {
      data[item.thang - 1] = item.doanh_thu || 0;
    });
    return data;
  };

  const barChartData = {
    labels: monthLabels,
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: getMonthlyRevenue(),
      backgroundColor: '#4e73df',
      borderRadius: 4
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            return value.toLocaleString('vi-VN');
          }
        }
      }
    }
  };


  return (
    <div ref={printRef}>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Thống kê</h1>
        <div className="d-flex gap-2">
          <button 
            onClick={handlePrint}
            className="d-none d-sm-inline-block btn btn-sm shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)', 
              color: 'white',
              border: 'none',
              marginRight: '10px'
            }}
          >
            <i className="fas fa-print fa-sm text-white-50 mr-1"></i> In báo cáo
          </button>
          <button 
            onClick={exportToExcel}
            className="d-none d-sm-inline-block btn btn-sm shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #1cc88a 0%, #13855c 100%)', 
              color: 'white',
              border: 'none'
            }}
          >
            <i className="fas fa-file-excel fa-sm text-white-50 mr-1"></i> Xuất Excel
          </button>
        </div>
      </div>

      {/* Cards thống kê */}
      <div className="row">
        {/* Thu nhập tháng */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Thu nhập (Tháng này)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : formatVND(doanhThuThang)}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thu nhập năm */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Thu nhập (Hàng năm)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : formatVND(doanhThuNam)}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yêu cầu giải quyết */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Yêu cầu giải quyết
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : soLuongChuaXuLy}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tổng khách hàng */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Tổng số khách hàng
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? '...' : tongSoKhachHang}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="row">
        {/* Biểu đồ tròn - Tỷ lệ đơn hàng */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Tỷ lệ đơn hàng</h6>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                {loading ? (
                  <div className="text-center py-5">Đang tải...</div>
                ) : thongKeTrangThai.length > 0 ? (
                  <Pie data={pieChartData} options={pieChartOptions} />
                ) : (
                  <div className="text-center py-5 text-muted">Chưa có dữ liệu</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ đường - Số đơn hàng theo tháng */}
        <div className="col-xl-4 col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Số đơn hàng theo tháng</h6>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                {loading ? (
                  <div className="text-center py-5">Đang tải...</div>
                ) : (
                  <Line data={lineChartData} options={lineChartOptions} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ cột - Doanh thu theo tháng */}
        <div className="col-xl-4 col-lg-3">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Doanh thu năm {currentYear}</h6>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                {loading ? (
                  <div className="text-center py-5">Đang tải...</div>
                ) : (
                  <Bar data={barChartData} options={barChartOptions} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
