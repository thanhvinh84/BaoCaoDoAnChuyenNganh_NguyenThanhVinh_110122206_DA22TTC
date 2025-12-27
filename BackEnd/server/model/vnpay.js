const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
const config = require('config');

function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    for (let key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    }
    return sorted;
}

exports.generatePaymentUrl = (req) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const amount = req.body.amount;
    const locale = req.body.language || 'vn';
    const currCode = 'VND';

    const ipAddr = req.headers['x-forwarded-for'] ||
                   req.connection.remoteAddress ||
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const tmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');
    const vnpUrl = config.get('vnp_Url');
    const returnUrl = config.get('vnp_ReturnUrl');

    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': locale,
        'vnp_CurrCode': currCode,
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': 'Thanh toan cho ma GD:' + orderId,
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100,
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': createDate,
        'vnp_BankCode': 'VNBANK'
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    vnp_Params['vnp_SecureHash'] = signed;

    return vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
};

exports.verifyReturnUrl = (params) => {
  const vnp_Params = { ...params };
  const secureHash = vnp_Params['vnp_SecureHash'];

  if (!secureHash) throw new Error("Thiếu chữ ký xác thực");

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  delete vnp_Params['orderData'];

  const sortedParams = sortObject(vnp_Params);
  const signData = querystring.stringify(sortedParams, { encode: false });

  const secretKey = config.get('vnp_HashSecret');
  const signed = crypto.createHmac("sha512", secretKey)
    .update(Buffer.from(signData, 'utf-8'))
    .digest("hex");
    
 console.log("Dữ liệu để ký:", signData);
 console.log("Kết quả hash:", signed);
 console.log("VNPay gửi về:", secureHash);


  return secureHash === signed;

  
};

