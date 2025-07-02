import { useState } from 'react';

// Định nghĩa initialSettings (sử dụng cùng cấu hình ban đầu từ AdminPrintSettings.js)
const initialSettings = {
  fontFamily: 'Courier New',
  lineSpacing: 2,
  useSeparatorLine: true,
  restaurantName: 'Nhà hàng ABC',
  address: '123 Đường XYZ, Q.1, TP.HCM',
  phone: '0909 123 456',
  showStoreName: true,
  headerStyle: { fontSize: 14, fontWeight: 'bold', fontStyle: 'normal' },
  subHeaderStyle: { fontSize: 8, fontWeight: 'normal', fontStyle: 'normal' },
  showDateTime: true,
  showCashier: false,
  orderInfoStyle: { fontSize: 9, fontWeight: 'normal', fontStyle: 'normal' },
  itemsHeaderStyle: { fontSize: 9, fontWeight: 'bold', fontStyle: 'normal' },
  itemsBodyStyle: { fontSize: 9, fontWeight: 'normal', fontStyle: 'normal' },
  totalLabel: 'TỔNG CỘNG:',
  thankYouMessage: 'Cảm ơn quý khách!',
  showQrCode: false,
  totalStyle: { fontSize: 10, fontWeight: 'bold', fontStyle: 'normal' },
  footerStyle: { fontSize: 8, fontWeight: 'normal', fontStyle: 'italic' },
  showWifi: true,
  wifiPassword: 'your_wifi_password',
  wifiStyle: { fontSize: 9, fontWeight: 'bold', fontStyle: 'normal' },
  defaultPrinter: '', // Không còn dùng cho window.print
  printerShareName: '', // Không còn dùng cho window.print
};

const usePrinting = (orders, selectedTable, tables) => {
  // `triggerPrint` sẽ được gọi từ `App.js` sau khi setup `useReactToPrint`
  // Hàm này sẽ trả về `receiptData` để `PrintReceipt.js` sử dụng
  const getReceiptData = (type) => { // Đổi tên từ triggerPrint sang getReceiptData cho rõ ràng mục đích
    const currentOrders = orders[selectedTable] || [];
    if (currentOrders.length === 0) {
      // Có thể không cần alert ở đây, mà chỉ trả về null hoặc lỗi để App.js xử lý
      return null; 
    }

    const savedSettings = localStorage.getItem('printSettings');
    const printSettings = savedSettings ? { ...initialSettings, ...JSON.parse(savedSettings) } : initialSettings;
    
    // Không còn kiểm tra defaultPrinter hay printerShareName ở đây

    const tableName = tables.find(t => t.id === selectedTable)?.name || 'Không xác định';
    const currentDate = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Chuẩn bị dữ liệu hóa đơn cho PrintReceipt component
    const receiptData = {
      type: type === 'kitchen' ? 'PHIẾU BẾP' : 'PHIẾU TẠM TÍNH', // Loại phiếu
      table: tableName,
      date: currentDate,
      cashier: 'Thu Ngân', // Thay bằng loggedInStaff?.name nếu có
      items: currentOrders.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: currentOrders.reduce((sum, item) => sum + item.price * item.quantity, 0),
      settings: printSettings, // Truyền toàn bộ cài đặt để PrintReceipt sử dụng
    };

    return receiptData;
  };

  // `processPayment` trong hook này sẽ được đơn giản hóa
  // và logic in thực tế sẽ nằm trong App.js
  const processPayment = (paymentData, type = 'full') => {
    // Logic của processPayment sẽ chủ yếu nằm ở App.js,
    // nơi nó sẽ gọi getReceiptData và sau đó trigger hàm in từ useReactToPrint.
    // Hook này chỉ cung cấp dữ liệu và cấu hình ban đầu.
  };

  return {
    getReceiptData, // Cung cấp hàm để lấy dữ liệu hóa đơn
    processPayment, // Giữ lại để tránh phá vỡ cấu trúc hiện tại, nhưng logic sẽ được di chuyển
    initialSettings, 
  };
};

export default usePrinting;