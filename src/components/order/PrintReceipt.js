// src/components/order/PrintReceipt.js

import React, { useMemo } from 'react';

const PrintReceipt = React.forwardRef(({ receiptData }, ref) => {
  // Component này sẽ không hiển thị gì trong giao diện chính
  // Nó chỉ dùng để cung cấp nội dung cho chức năng in
  if (!receiptData) {
    // Nếu không có dữ liệu, trả về một div rỗng để ref vẫn được gắn
    // và không gây lỗi cho react-to-print
    return <div ref={ref}></div>; 
  }

  const { type, table, items, total, cashier, settings, bankSettings, banks } = receiptData;

  // Helper function to get style string from settings
  const getStyleString = (styleObj = {}) => {
    return `font-size: ${styleObj.fontSize || 9}pt; font-weight: ${styleObj.fontWeight || 'normal'}; font-style: ${styleObj.fontStyle || 'normal'};`;
  };

  // Generate QR Code URL
  const qrCodeUrl = useMemo(() => {
    // Chỉ tạo QR nếu cài đặt cho phép và có đủ thông tin ngân hàng
    if (!settings.showQrCode || !bankSettings || !bankSettings.bin || !bankSettings.accountNumber) {
        console.log("QR Code: Không đủ thông tin hoặc cài đặt không cho phép.");
        return null;
    }
    const { bin, accountNumber, accountName } = bankSettings;
    const template = 'compact2'; // Mẫu compact của VietQR
    // Nội dung thanh toán có thể tùy chỉnh hoặc lấy từ thông tin bàn
    const description = `TTDH Ban ${table}`; 
    const url = `https://img.vietqr.io/image/${bin}-${accountNumber}-${template}.png?amount=${total}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName || '')}`;
    console.log("QR Code URL được tạo:", url);
    return url;
  }, [settings.showQrCode, bankSettings, total, table]);

  const bankName = useMemo(() => {
    if (!bankSettings || !banks) return '';
    const bank = banks.find(b => b.bin === bankSettings.bin);
    return bank ? bank.shortName : '';
  }, [banks, bankSettings]);


  // CSS này sẽ được áp dụng cho nội dung bên trong component khi in
  // Các giá trị sẽ được lấy từ settings để tùy chỉnh
  const printStyles = `
    .print-content {
      font-family: '${settings.fontFamily || 'Courier New'}', Courier, monospace;
      font-size: 9pt; /* Base font size */
      color: #000;
      width: 57mm; /* Khổ giấy K57 */
      margin: 0;
      padding: 3mm;
      box-sizing: border-box;
      line-height: ${settings.lineSpacing || 2}mm;
    }
    .print-header { text-align: center; margin-bottom: 5px; }
    .print-header h1 { margin: 0; ${getStyleString(settings.headerStyle)} }
    .print-header p { margin: 1px 0; ${getStyleString(settings.subHeaderStyle)} } /* Changed to subHeaderStyle */
    .print-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    .print-table th, .print-table td { text-align: left; padding: 2px 0; vertical-align: top; word-break: break-word; }
    .print-table th { ${getStyleString(settings.itemsHeaderStyle)} }
    .print-table td { ${getStyleString(settings.itemsBodyStyle)} }
    .col-sl { text-align: center; width: 30px; }
    .col-thanh-tien { text-align: right; }
    .line { border-top: 1px dashed #000; margin: 5px 0; }
    .total-section { text-align: right; ${getStyleString(settings.totalStyle)} margin-top: 5px; }
    .footer { text-align: center; margin-top: 10px; ${getStyleString(settings.footerStyle)} }
    .order-info { ${getStyleString(settings.orderInfoStyle)} }
    .wifi-info { text-align: center; margin-top: 10px; ${getStyleString(settings.wifiStyle)} }
    .qr-code-section { text-align: center; margin-top: 10px; }
    .qr-code-section img { width: 100%; max-width: 45mm; height: auto; display: block; margin: 0 auto; } /* Adjust QR size for K57 */
    .qr-bank-info { font-size: 8pt; margin-top: 5px; }
  `;

  return (
    <div ref={ref} className="print-container">
      <style>{`@media print { ${printStyles} }`}</style>
      <div className="print-content">
        {settings.showStoreName && (
          <div className="print-header">
            <h1>{settings.restaurantName}</h1>
            <p>{settings.address}</p>
            <p>ĐT: {settings.phone}</p>
          </div>
        )}
        {settings.useSeparatorLine && <div className="line"></div>}
        <div className="order-info">
          <p>Bàn: {table} | {settings.showDateTime ? `Ngày: ${new Date().toLocaleString('vi-VN')}` : ''}</p>
          {settings.showCashier && cashier && <p>Thu ngân: {cashier}</p>}
        </div>
        {settings.useSeparatorLine && <div className="line"></div>}
        <table className="print-table">
          <thead>
            <tr>
              <th>Tên món</th>
              <th className="col-sl">SL</th>
              {type === 'provisional' && <th className="col-thanh-tien">T.Tiền</th>}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td className="col-sl">{item.quantity}</td>
                {type === 'provisional' && <td className="col-thanh-tien">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {settings.useSeparatorLine && <div className="line"></div>}
        {type === 'provisional' && (
          <div className="total-section">
            {settings.totalLabel} {total.toLocaleString('vi-VN')}đ
          </div>
        )}

        {settings.showQrCode && qrCodeUrl && (
          <div className="qr-code-section">
            <img src={qrCodeUrl} alt="Mã QR Thanh Toán" />
            <div className="qr-bank-info">
              <p>{bankName} - {bankSettings?.accountNumber}</p>
              <p>{bankSettings?.accountName}</p>
              <p>Nội dung: TTDH Ban {table}</p>
            </div>
          </div>
        )}

        {settings.showWifi && settings.wifiPassword && (
          <div className="wifi-info">
            Pass Wi-Fi: {settings.wifiPassword}
          </div>
        )}
        <div className="footer">
          {settings.thankYouMessage}
        </div>
      </div>
    </div>
  );
});

export default PrintReceipt;
