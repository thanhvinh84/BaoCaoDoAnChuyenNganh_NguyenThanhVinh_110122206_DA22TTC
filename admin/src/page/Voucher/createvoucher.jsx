import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CreateVoucher() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        coupon_name: '',
        discount_amount: '',
        value: '',
        remaining_count: '',
        description: '',
        expiry_date: '',
        min_order_value: '',
        product_keyword: ''
    });

    useEffect(() => {
        // Load danh mục sản phẩm
        axios.get('http://localhost:5000/api/getalldm')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Tự động tính value từ discount_amount
        if (name === 'discount_amount') {
            setFormData(prev => ({ ...prev, value: parseInt(value) * 1000 || 0 }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/voucher', formData);
            toast.success('Tạo voucher thành công!');
            navigate('/Indexvoucher');
        } catch (error) {
            toast.error('Lỗi khi tạo voucher');
            console.error(error);
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Thêm Voucher mới</h1>
                <Link to="/Indexvoucher" className="btn btn-secondary btn-sm">
                    <i className="fas fa-arrow-left"></i> Quay lại
                </Link>
            </div>

            <div className="card shadow mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Mã Voucher <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="coupon_name"
                                        value={formData.coupon_name}
                                        onChange={handleChange}
                                        placeholder="VD: BEP500K"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Giảm giá (K) <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="discount_amount"
                                        value={formData.discount_amount}
                                        onChange={handleChange}
                                        placeholder="VD: 500 (= 500.000đ)"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Số lượng còn lại <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="remaining_count"
                                        value={formData.remaining_count}
                                        onChange={handleChange}
                                        placeholder="VD: 20"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Đơn hàng tối thiểu (VNĐ) <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="min_order_value"
                                        value={formData.min_order_value}
                                        onChange={handleChange}
                                        placeholder="VD: 5000000"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Loại sản phẩm áp dụng <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="product_keyword"
                                        value={formData.product_keyword}
                                        onChange={handleChange}
                                        placeholder="VD: bếp,nồi (phân cách bằng dấu phẩy)"
                                        required
                                    />
                                    <small className="text-muted">Nhập từ khóa sản phẩm, phân cách bằng dấu phẩy</small>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Hạn sử dụng <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="expiry_date"
                                        value={formData.expiry_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mô tả voucher <span className="text-danger">*</span></label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="VD: Giảm ngay 500.000đ khi mua bếp từ 5 triệu đồng trở lên"
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-save"></i> Lưu Voucher
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
