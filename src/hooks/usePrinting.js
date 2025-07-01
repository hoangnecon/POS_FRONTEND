// src/hooks/usePrinting.js
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
  defaultPrinter: '',
  printerShareName: '',
};

const usePrinting = (orders, selectedTable, tables) => {
  const triggerPrint = async (type) => {
    const currentOrders = orders[selectedTable] || [];
    if (currentOrders.length === 0) {
      alert('Không có món nào để in.');
      return;
    }

    const savedSettings = localStorage.getItem('printSettings');
    const printSettings = savedSettings ? { ...initialSettings, ...JSON.parse(savedSettings) } : initialSettings;
    if (!printSettings.defaultPrinter || !printSettings.printerShareName) {
      alert('Vui lòng cấu hình máy in (tên máy in và Share name) trong Admin > Cài đặt in hóa đơn.');
      return;
    }

    const tableName = tables.find(t => t.id === selectedTable)?.name || 'Không xác định';
    const currentDate = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const payload = {
      isKitchenPrint: type === 'kitchen',
      tableName,
      currentDate,
      items: currentOrders.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: currentOrders.reduce((sum, item) => sum + item.price * item.quantity, 0),
      settings: printSettings,
    };

    console.log('Gửi payload in:', payload);
    try {
      const response = await fetch('http://localhost:9898/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Lỗi máy chủ in: ${await response.text()}`);
      }

      const result = await response.json();
      console.log('Phản hồi từ server:', result);
      alert(result.message || 'In thành công!');
    } catch (error) {
      console.error('Lỗi khi in:', error);
      alert(`Không thể in: ${error.message}. Vui lòng kiểm tra:
        - Ứng dụng Electron đang chạy (http://localhost:9898).
        - Máy in K57 đã được chia sẻ với Share name "${printSettings.printerShareName}".
        - Driver máy in đã được cài đặt đúng.`);
    }
  };

  const processPayment = (paymentData, type = 'full') => {
    if (type === 'full') {
      triggerPrint('provisional');
      // Logic for clearing table or updating partial order should be handled outside this hook,
      // as it modifies order state which is managed by useOrderManagement.
      // This hook should focus solely on printing logic.
      // We will pass clearTable and setOrders as dependencies or callbacks from App.js.
    } else if (type === 'partial') {
      // Similarly, partial payment logic will be handled by useOrderManagement
    }
  };

  return {
    triggerPrint,
    processPayment, // This function itself will be simplified in App.js to call clearTable/setOrders from useOrderManagement
    initialSettings, // Expose initial settings if AdminPrintSettings needs it for restore defaults
  };
};

export default usePrinting;