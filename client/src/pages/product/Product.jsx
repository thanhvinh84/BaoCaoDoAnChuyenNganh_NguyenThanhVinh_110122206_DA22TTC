import { Fragment, useEffect, useState } from "react";
import Productt from "../../until/layoutauto";
import useProductFilter from "../../until/fillter";
import { Link, useSearchParams } from "react-router-dom";
import AddProduct from "../../until/cart";
import axios from 'axios';
import ReactPaginate from 'react-paginate';

export default function Product() {
    Productt();
    useProductFilter();
    AddProduct();
    
    const [data, setData] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: Infinity });
    const [searchTermid, setSearchTermid] = useState(""); // Thêm state cho nhóm sản phẩm
    const [sortType, setSortType] = useState(""); // State cho sắp xếp

    // Lấy danh mục từ URL
    const danhMucFromUrl = searchParams.get('danhmuc');
    const saleFilter = searchParams.get('sale');

    // Di chuyển loadData ra ngoài useEffect
    const loadData = async () => {
        try {
            const page = searchParams.get('page') || 1;
            const response = await axios.get(`http://localhost:5000/api/getallsp?page=${page}`);
            setTotalProduct(response.data[0].totalproduct);
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu", error);
        }
    };

    // Load sản phẩm theo danh mục
    const loadDataByCategory = async (ma_danh_muc) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/getspDM/${ma_danh_muc}`);
            setData(response.data);
            setTotalProduct(response.data.length);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu theo danh mục", error);
        }
    };

    // Load sản phẩm đang khuyến mãi
    const loadSaleProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/getspsale`);
            setData(response.data);
            setTotalProduct(response.data.length);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm khuyến mãi", error);
        }
    };

    const itemsPageSize = 10;

    const handlePageClick = (event) => {
        setSearchParams(params => {
            params.set('page', event.selected + 1)
            console.log(event.selected+1)
            return params
        })

      };
      const pageCount = Math.ceil(totalProduct / itemsPageSize);

    const pageParam = searchParams.get('page');
    
    useEffect(() => {
        // Nếu có filter sale trong URL, load sản phẩm khuyến mãi
        if (saleFilter === 'true') {
            loadSaleProducts();
        }
        // Nếu có danh mục trong URL, load theo danh mục
        else if (danhMucFromUrl) {
            setSearchTermid(danhMucFromUrl);
            loadDataByCategory(danhMucFromUrl);
        } else {
            // Chỉ load tất cả sản phẩm khi KHÔNG có danh mục
            if (pageParam) {
                loadData();
            } else {
                setSearchParams(params => {
                    params.set('page', 1);
                    return params;
                });
            }
        }
    }, [danhMucFromUrl, pageParam, saleFilter]);

    const handleSearchname = async (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm) {
            // Nếu searchTerm rỗng hoặc null, tải lại toàn bộ dữ liệu
            loadData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchsp/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm dữ liệu", error);
            }
        }
    };

        // Hàm tìm kiếm theo nhóm sản phẩm
        const handleSearchtype = async (categoryId) => {
            setSearchTermid(categoryId); // Cập nhật state khi chọn nhóm sản phẩm
            
            try {
                // Nếu đang ở trang khuyến mãi
                if (saleFilter === 'true') {
                    if (categoryId) {
                        // Lọc sản phẩm sale theo danh mục
                        const response = await axios.get(`http://localhost:5000/api/getspsalebycategory/${categoryId}`);
                        setData(response.data);
                    } else {
                        // Hiển thị tất cả sản phẩm sale
                        loadSaleProducts();
                    }
                } else {
                    // Không ở trang khuyến mãi
                    if (categoryId) {
                        // Nếu chọn danh mục cụ thể, load theo danh mục
                        loadDataByCategory(categoryId);
                    } else {
                        // Nếu chọn "Tất cả sản phẩm", load tất cả
                        loadData();
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tìm kiếm theo nhóm sản phẩm", error);
            }
        };
    
        const handlePriceFilterChange = (minPrice, maxPrice) => {
            setPriceFilterChanged(true);
            setPriceRange({ minPrice, maxPrice });
        };
    
        // Hàm tìm kiếm theo giá và nhóm sản phẩm
        const handleSearchByPrice = async (minPrice, maxPrice , id_danh_muc = searchTermid) => {
            try {
                // Nếu đang ở trang khuyến mãi, chỉ search trong sản phẩm sale
                if (saleFilter === 'true') {
                    const response = await axios.get(`http://localhost:5000/api/getspsalefilter`, {
                        params: { minPrice, maxPrice, id_danh_muc }
                    });
                    setData(response.data);
                } else {
                    const response = await axios.get(`http://localhost:5000/api/searchgdvprice`, {
                        params: { minPrice, maxPrice, id_danh_muc }
                    });
                    setData(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi tìm kiếm theo giá", error);
            }
        };
    
        const [priceFilterChanged, setPriceFilterChanged] = useState(false);
        
        useEffect(() => {
            // Chỉ gọi khi người dùng thực sự thay đổi filter giá (không phải lần đầu mount)
            if (priceFilterChanged) {
                handleSearchByPrice(priceRange.minPrice, priceRange.maxPrice);
            }
        }, [priceRange, priceFilterChanged]);
    

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  

    
        // ✅ Random số sao trung bình từ 4.5 đến 5.0 (1 chữ số thập phân)
    const getRandomRating = () => {
    const rating = Math.random() * (5 - 4.5) + 4.5; 
    return rating.toFixed(1);
    };

    // ✅ Random số lượt đánh giá từ 15 đến 30
    const getRandomReviewCount = () => {
    return Math.floor(Math.random() * (30 - 15 + 1)) + 15;
    };

    // Hàm sắp xếp sản phẩm
    const handleSort = (type) => {
        setSortType(type);
        let sortedData = [...data];
        
        switch(type) {
            case 'newest':
                // Sắp xếp theo mã sản phẩm giảm dần (mới nhất)
                sortedData.sort((a, b) => Number(b.ma_san_pham) - Number(a.ma_san_pham));
                break;
            case 'bestseller':
                // Sắp xếp theo số lượng bán (giả sử dùng soluong)
                sortedData.sort((a, b) => Number(a.soluong) - Number(b.soluong));
                break;
            case 'price-asc':
                // Giá thấp đến cao
                sortedData.sort((a, b) => Number(a.gia) - Number(b.gia));
                break;
            case 'price-desc':
                // Giá cao đến thấp
                sortedData.sort((a, b) => Number(b.gia) - Number(a.gia));
                break;
            case 'discount':
                // % Giảm nhiều nhất - sắp xếp sản phẩm có Sale lên đầu
                sortedData.sort((a, b) => {
                    const aHasSale = a.sale && a.sale.toLowerCase().includes('sale') ? 1 : 0;
                    const bHasSale = b.sale && b.sale.toLowerCase().includes('sale') ? 1 : 0;
                    return bHasSale - aHasSale;
                });
                break;
            default:
                break;
        }
        
        setData(sortedData);
    };


    return (
        <Fragment>
            <div className="all-product-container" style={{ paddingBottom: '30px' }}>
            <div className="filter">
                    <h2>Sản phẩm</h2>
                    <div className="filter-search">
                        <input  onChange={handleSearchname} placeholder="Tìm kiếm dịch vụ..." type="text" />
                        {/* <button
                        >
                            <img src="../Images/icon-search.svg" alt="" />
                        </button> */}
                    </div>
                    <div className="filter-size filter-item">
                        <div className="filter-item__inner">
                            <span>Mức giá</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            <li onClick={() => handlePriceFilterChange(0, 99999999999)}>Tất cả mức giá</li>
                            <li onClick={() => handlePriceFilterChange(500000, 2000000)}>500.000đ - 2.000.000đ</li>
                            <li onClick={() => handlePriceFilterChange(2000000, 5000000)}>2.000.000đ - 5.000.000đ</li>
                            <li onClick={() => handlePriceFilterChange(5000000, 10000000)}>5.000.000đ - 10.000.000đ</li>
                            <li onClick={() => handlePriceFilterChange(10000000, 20000000)}>10.000.000đ - 20.000.000đ</li>
                            <li onClick={() => handlePriceFilterChange(20000000, 50000000)}>20.000.000đ - 50.000.000đ</li>
                            <li onClick={() => handlePriceFilterChange(50000000, 100000000)}>50.000.000đ - 100.000.000đ</li>
                            <li onClick={() => handlePriceFilterChange(100000000, 99999999999)}>Trên 100.000.000đ</li>
                        </ul>
                    </div>

                    <div className="filter-type filter-item">
                        <div className="filter-item__inner">
                            <span>Nhóm sản phẩm</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            {[
                                { value: "", label: "Tất cả sản phẩm" },
                                { value: "1", label: "Bếp điện từ" },
                                { value: "2", label: "Máy rửa chén" },
                                { value: "3", label: "Máy hút mùi" },
                                { value: "4", label: "Khóa điện tử" },
                                { value: "5", label: "Lò nướng" },
                            ].map((item) => (
                                <li key={item.value} onClick={() => handleSearchtype(item.value)}>
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="filter-sort filter-item">
                        <div className="filter-item__inner">
                            <span>Sắp xếp</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            <li onClick={() => handleSort('newest')}>Mới nhất</li>
                            <li onClick={() => handleSort('bestseller')}>Bán chạy</li>
                            <li onClick={() => handleSort('price-asc')}>Giá thấp đến cao</li>
                            <li onClick={() => handleSort('price-desc')}>Giá cao đến thấp</li>
                            <li onClick={() => handleSort('discount')}>% Giảm nhiều nhất</li>
                        </ul>
                    </div>
                </div>

                <div className="container1">
                    <div className="product-type">
                        <div className="row">
                            {/* Sản phẩm mẫu */}
                            

                            {/* Render sản phẩm từ dữ liệu */}
                            {data.map((item) => (
                                <div key={item.ma_san_pham} className="col p-2-4">
                                    <div id={`${item.ma_san_pham}`} className="product">
                                        <div className="product-img-wrap" style={{ marginBottom: '8px' }}>
                                            <Link to={`/detail/${item.ma_san_pham}`} className="product-img product-img--small">
                                                <img className="product-img-1" src={item.anh_sanpham} alt="" />
                                                <img className="product-img-2" src={item.anhhover1} alt="" />
                                            </Link>
                                            <div className="product-size">
                                                <p>Thêm nhanh vào giỏ hàng +</p>
                                                <div className="btn btn--size">Thêm sản phẩm</div>
                                            </div>
                                        </div>
                                        <div className='product-grid__reviews'>
                                            <div className='reviews-rating'>
                                               <div className='reviews-rating__vote'>{getRandomRating()}</div>
                                                <div className='reviews-rating__star'></div>
                                                <div className='reviews-rating__number'>({getRandomReviewCount()})</div>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <div style={{ display: 'none' }} className="product-content__option ">
                                                <div className="product-content__option-item-wrap active">
                                                    <span data={item.mau_sac}></span>
                                                    <span data={item.soluong}></span>
                                                </div>
                                            </div>
                                            <a className="product-name">{item.ten_san_pham}</a>
                                            <div className="product-price-wrap">
                                                <div className="product-price">{formatCurrency(item.gia)}</div>
                                            </div>
                                            <div className="product-discount">
                                                {item.thongbao}
                                            </div>
                                            <div className="sale-tag product-tag">{item.sale}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
                {/* Chỉ hiện pagination khi không filter theo sale hoặc danh mục */}
                {!saleFilter && !danhMucFromUrl && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Trang tiếp >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< Trước"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination"
                        pageLinkClassName="page-num"
                        previousLinkClassName="page-num"
                        nextLinkClassName="page-num"
                        activeLinkClassName="active"
                    />
                )}
                
            </div>

           
        </Fragment>
    );
}
