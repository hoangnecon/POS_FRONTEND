// src/components/order/PrintReceipt.js

import React from 'react';

const PrintReceipt = React.forwardRef(({ receiptData }, ref) => {
  // Component này sẽ không hiển thị gì trong giao diện chính
  // Nó chỉ dùng để cung cấp nội dung cho chức năng in
  if (!receiptData) {
    return null;
  }

  const { type, table, items, total, cashier } = receiptData;

  // CSS này sẽ được áp dụng cho nội dung bên trong component khi in
  const printStyles = `
    .print-content {
      font-family: 'Courier New', Courier, monospace;
      font-size: 9pt; /* Cỡ chữ nhỏ hơn cho K57 */
      color: #000;
      width: 57mm; /* Khổ giấy K57 */
      margin: 0;
      padding: 3mm;
      box-sizing: border-box;
    }
    .print-header { text-align: center; margin-bottom: 5px; }
    .print-header h1 { font-size: 12pt; margin: 0; }
    .print-header p { margin: 1px 0; font-size: 8pt; }
    .print-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
    .print-table th, .print-table td { text-align: left; padding: 2px 0; vertical-align: top; word-break: break-word; }
    .col-sl { text-align: center; width: 30px; }
    .col-thanh-tien { text-align: right; }
    .line { border-top: 1px dashed #000; margin: 5px 0; }
    .total-section { text-align: right; font-weight: bold; font-size: 10pt; margin-top: 5px; }
    .footer { text-align: center; margin-top: 10px; font-style: italic; font-size: 8pt; }
  `;

  return (
    <div ref={ref} className="print-container">
      <style>{`@media print { ${printStyles} }`}</style>
      <div className="print-content">
        <div className="print-header">
          <h1>{type === 'provisional' ? 'PHIẾU TẠM TÍNH' : 'PHIẾU BẾP'}</h1>
          <p>Nhà hàng ABC</p>
          <p>123 Đường XYZ, Quận 1, TP. HCM</p>
        </div>
        <div className="line"></div>
        <p>Bàn: {table} | Ngày: {new Date().toLocaleString('vi-VN')}</p>
        {cashier && <p>Thu ngân: {cashier}</p>}
        <div className="line"></div>
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
                {type === 'provisional' && <td className="col-thanh-tien">{(item.price * item.quantity).toLocaleString('vi-VN')}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="line"></div>
        {type === 'provisional' && (
          <div className="total-section">
            TỔNG CỘNG: {total.toLocaleString('vi-VN')}đ
          </div>
        )}
        <div className="footer">
          {type === 'provisional'
            ? 'Cảm ơn quý khách!'
            : '--- YÊU CẦU BẾP CHUẨN BỊ ---'
          }
        </div>
      </div>
    </div>
  );
});

export default PrintReceipt;