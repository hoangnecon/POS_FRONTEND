// src/hooks/usePrinting.js
import { initialPrintSettings } from '../data/initialPrintSettings';
import { generateReceiptHtml } from '../utils/generateReceiptHtml'; // Import hàm helper mới

const usePrinting = (orders, selectedTable, tables, bankSettings, banks) => {
  // Hàm này sẽ trả về dữ liệu hóa đơn hoàn chỉnh (HTML string)
  const getReceiptData = (type, currentPrintSettings) => {
    const currentOrders = orders[selectedTable] || [];
    if (currentOrders.length === 0) {
      return null;
    }

    const printSettings = currentPrintSettings || initialPrintSettings;
    
    // Tạo orderData để truyền vào hàm generateReceiptHtml
    const orderData = {
        items: currentOrders,
        total: currentOrders.reduce((sum, item) => sum + item.price * item.quantity, 0),
        table: tables.find(t => t.id === selectedTable)?.name || 'Không xác định',
        // cashier: loggedInStaff?.name || 'N/A', // Cashier sẽ được truyền từ App.js khi set receiptToPrint
    };

    // Gọi hàm helper để tạo chuỗi HTML hoàn chỉnh
    const htmlContent = generateReceiptHtml(orderData, printSettings, bankSettings, banks, type);

    return { html: htmlContent, type: type, total: orderData.total, table: orderData.table, items: orderData.items };
  };

  return {
    getReceiptData, // Chỉ trả về hàm lấy dữ liệu hóa đơn
    initialSettings: initialPrintSettings, // Trả về initialPrintSettings được import
  };
};

export default usePrinting;