import React, { useState } from 'react';
import {
  CalendarDays,
  DollarSign,
  Receipt,
  Banknote,
  CreditCard,
  Eye,
  X,
} from 'lucide-react';

const Dashboard = ({
  selectedDate,
  setSelectedDate,
  paymentFilter,
  setPaymentFilter,
  MOCK_ORDERS_BY_DATE,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getOrdersForDate = () => {
    return MOCK_ORDERS_BY_DATE[selectedDate] || [];
  };

  const getFilteredOrders = () => {
    const ordersForDate = getOrdersForDate();
    if (paymentFilter === 'all') return ordersForDate;
    return ordersForDate.filter(
      (order) => order.paymentMethod === paymentFilter
    );
  };

  const getRevenueByPayment = () => {
    const ordersForDate = getOrdersForDate();
    const cashRevenue = ordersForDate
      .filter((order) => order.paymentMethod === 'cash')
      .reduce((sum, order) => sum + order.total, 0);

    const transferRevenue = ordersForDate
      .filter((order) => order.paymentMethod === 'transfer')
      .reduce((sum, order) => sum + order.total, 0);

    return { cash: cashRevenue, transfer: transferRevenue };
  };

  const getBestSellingItems = () => {
    const ordersForDate = getOrdersForDate();
    const itemCount = {};
    ordersForDate.forEach((order) => {
      order.items.forEach((item) => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    return Object.entries(itemCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const revenueData = getRevenueByPayment();
  const bestSelling = getBestSellingItems();
  const filteredOrders = getFilteredOrders();
  const ordersForDate = getOrdersForDate();

  return (
    <div className="p-8 h-full overflow-y-auto bg-primary-bg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-headline mb-3">
          Dashboard
        </h1>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-2">
          <CalendarDays size={20} className="text-primary-headline" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-primary-main rounded-xl text-primary-headline focus:ring-2 focus:ring-primary-highlight shadow-md"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 bg-primary-main rounded-xl text-primary-headline focus:ring-2 focus:ring-primary-highlight shadow-md"
        >
          <option value="all">Tất cả thanh toán</option>
          <option value="cash">Tiền mặt</option>
          <option value="transfer">Chuyển khoản</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary-headline">
              Tổng doanh thu
            </h3>
            <div className="w-10 h-10 sidebar-gradient rounded-2xl flex items-center justify-center">
              <DollarSign size={20} className="text-primary-main" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary-headline mb-2">
            {(revenueData.cash + revenueData.transfer).toLocaleString('vi-VN')}đ
          </p>
          <p className="text-sm text-primary-headline">
            {selectedDate === new Date().toISOString().split('T')[0]
              ? 'Hôm nay'
              : selectedDate}
          </p>
        </div>

        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary-headline">Tiền mặt</h3>
            <div className="w-10 h-10 sidebar-gradient rounded-2xl flex items-center justify-center">
              <Banknote size={20} className="text-primary-main" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary-headline mb-2">
            {revenueData.cash.toLocaleString('vi-VN')}đ
          </p>
          <p className="text-sm text-primary-paragraph">
            {ordersForDate.filter((o) => o.paymentMethod === 'cash').length} đơn
            hàng
          </p>
        </div>

        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary-headline">
              Chuyển khoản
            </h3>
            <div className="w-10 h-10 sidebar-gradient rounded-2xl flex items-center justify-center">
              <CreditCard size={20} className="text-primary-main" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary-headline mb-2">
            {revenueData.transfer.toLocaleString('vi-VN')}đ
          </p>
          <p className="text-sm text-primary-paragraph">
            {
              ordersForDate.filter((o) => o.paymentMethod === 'transfer')
                .length
            }{' '}
            đơn hàng
          </p>
        </div>

        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary-headline">
              Tổng đơn hàng
            </h3>
            <div className="w-10 h-10 sidebar-gradient rounded-2xl flex items-center justify-center">
              <Receipt size={20} className="text-primary-main" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary-headline mb-2">
            {ordersForDate.length}
          </p>
          <p className="text-sm text-primary-paragraph">
            {selectedDate === new Date().toISOString().split('T')[0]
              ? 'Hôm nay'
              : selectedDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Selling Items */}
        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-primary-headline mb-6">
            Món bán chạy nhất
          </h3>
          {bestSelling.length > 0 ? (
            <div className="space-y-4">
              {bestSelling.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-primary-secondary rounded-xl shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-button rounded-full flex items-center justify-center text-primary-main font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-primary-headline">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-primary-button">
                    {item.count} phần
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-primary-paragraph text-center py-8">
              Không có dữ liệu cho ngày này
            </p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary-headline">Đơn hàng</h3>
            <span className="text-sm text-primary-paragraph">
              {filteredOrders.length} đơn hàng
            </span>
          </div>
          {filteredOrders.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-primary-secondary rounded-xl shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary-headline">
                        {order.id}
                      </span>
                      <span className="text-sm text-primary-paragraph">
                        Bàn {order.tableNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="text-primary-button hover:text-primary-highlight transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {order.paymentMethod === 'cash' ? (
                        <Banknote size={14} className="text-primary-button" />
                      ) : (
                        <CreditCard
                          size={14}
                          className="text-primary-tertiary"
                        />
                      )}
                      <span className="text-sm text-primary-paragraph">
                        {order.paymentMethod === 'cash'
                          ? 'Tiền mặt'
                          : 'Chuyển khoản'}
                      </span>
                    </div>
                    <span className="font-bold text-primary-button">
                      {order.total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-primary-paragraph">
                    <span>
                      {order.date} • {order.time}
                    </span>
                    <span>Thu ngân: {order.cashier}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-primary-paragraph text-center py-8">
              Không có đơn hàng cho ngày này
            </p>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-primary-headline">
                Chi tiết đơn hàng {selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-primary-paragraph hover:text-primary-headline"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-primary-headline mb-3">
                  Thông tin đơn hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-paragraph">Mã đơn:</span>
                    <span className="font-medium text-primary-headline">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-paragraph">Bàn số:</span>
                    <span className="font-medium text-primary-headline">
                      {selectedOrder.tableNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-paragraph">Ngày giờ:</span>
                    <span className="font-medium text-primary-headline">
                      {selectedOrder.date} {selectedOrder.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-paragraph">Thu ngân:</span>
                    <span className="font-medium text-primary-headline">
                      {selectedOrder.cashier}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-paragraph">Thanh toán:</span>
                    <div className="flex items-center gap-1">
                      {selectedOrder.paymentMethod === 'cash' ? (
                        <Banknote size={14} className="text-primary-button" />
                      ) : (
                        <CreditCard
                          size={14}
                          className="text-primary-tertiary"
                        />
                      )}
                      <span className="font-medium text-primary-headline">
                        {selectedOrder.paymentMethod === 'cash'
                          ? 'Tiền mặt'
                          : 'Chuyển khoản'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-primary-headline mb-3">Tổng kết</h4>
                <div className="bg-primary-secondary rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-headline">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-primary-button">
                      {selectedOrder.total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-primary-headline mb-3">
                Chi tiết món ăn
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-primary-secondary rounded-xl shadow-md"
                  >
                    <div>
                      <span className="font-medium text-primary-headline">
                        {item.name}
                      </span>
                      <span className="text-sm text-primary-paragraph ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-primary-button">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;