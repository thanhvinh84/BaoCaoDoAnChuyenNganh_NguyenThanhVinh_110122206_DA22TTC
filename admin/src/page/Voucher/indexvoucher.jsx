import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function IndexVoucher() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vouchers');
            setVouchers(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tải dữ liệu voucher');
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa voucher này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/voucher/${id}`);
                toast.success('Xóa voucher thành công!');
                loadData();
            } catch (error) {
                toast.error('Lỗi khi xóa voucher');
            }
        }
    };

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quản lý Voucher</h1>
                <Link to="/Createvoucher" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i> Thêm Voucher
                </Link>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách Voucher</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mã Voucher</th>
                                    <th>Giảm giá</th>
                                    <th>Giá trị</th>
                                    <th>Còn lại</th>
                                    <th>Đơn tối thiểu</th>
                                    <th>Loại SP</th>
                                    <th>HSD</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchers.map((voucher) => (
                                    <tr key={voucher.ma_voucher}>
                                        <td>{voucher.ma_voucher}</td>
                                        <td><strong>{voucher.coupon_name}</strong></td>
                                        <td>{voucher.discount_amount}K</td>
                                        <td>{formatCurrency(voucher.value)}</td>
                                        <td>{voucher.remaining_count}</td>
                                        <td>{formatCurrency(voucher.min_order_value)}</td>
                                        <td><span className="badge badge-info">{voucher.product_keyword}</span></td>
                                        <td>{voucher.expiry_date}</td>
                                        <td>
                                            <Link to={`/Updatevoucher/${voucher.ma_voucher}`} className="btn btn-warning btn-sm mr-1">
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            <button onClick={() => handleDelete(voucher.ma_voucher)} className="btn btn-danger btn-sm">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
