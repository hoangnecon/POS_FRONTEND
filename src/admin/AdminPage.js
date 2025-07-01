// src/admin/AdminPage.js
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminMenus from './AdminMenus';
import AdminItems from './AdminItems';
import AdminPrintSettings from './AdminPrintSettings';
// Vui lòng đảm bảo bạn đã import AdminTables nếu component này tồn tại.
// Dựa trên file AdminPage.js bạn cung cấp, AdminTables không được sử dụng trực tiếp ở đây.

const AdminPage = ({
  adminSection,
  setAdminSection,
  handleLogout,
  // Menu Data props
  menuTypes,
  setMenuTypes,
  addMenuType,
  deleteMenuType,
  menuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
  // Dashboard Data props (Đảm bảo các props này được App.js truyền xuống)
  selectedDate,
  setSelectedDate,
  paymentFilter,
  setPaymentFilter,
  // Các props mới từ useDashboardData mà App.js truyền xuống
  dateRange, // Giờ đây AdminPage nhận dateRange
  setDateRange, // Giờ đây AdminPage nhận setDateRange
  aggregatedOrdersForDisplay, // Giờ đây AdminPage nhận aggregatedOrdersForDisplay
  MOCK_ORDERS_BY_DATE,
  // Table Data props (từ useTableManagement)
  tables, // Prop tables nhận từ App.js (là một đối tượng)
  setTables,
  addTable,
  updateTable,
  deleteTable,
  // Print Settings
  initialSettings,
}) => {
  const renderSection = () => {
    switch (adminSection) {
      case 'dashboard':
        return (
          <AdminDashboard
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
            // Truyền các props mới xuống AdminDashboard
            dateRange={dateRange}
            setDateRange={setDateRange}
            aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
            menuItems={menuItems}
            menuTypes={menuTypes}
          />
        );
      case 'menus':
        return (
          <AdminMenus
            menuTypes={menuTypes}
            setMenuTypes={setMenuTypes}
            menuItems={menuItems} // Pass menuItems if needed for category item count
            addMenuType={addMenuType}
            deleteMenuType={deleteMenuType}
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            // SỬA LỖI: Chuyển đổi đối tượng tables thành mảng trước khi truyền xuống AdminMenus
            tables={Object.values(tables)} // Chuyển đổi đối tượng tables thành mảng các giá trị
            setTables={setTables}
            addTable={addTable}
            updateTable={updateTable}
            deleteTable={deleteTable}
          />
        );
      case 'items':
        return (
          <AdminItems
            menuItems={menuItems}
            menuTypes={menuTypes}
            categories={categories}
            addMenuItem={addMenuItem}
            updateMenuItem={updateMenuItem}
            deleteMenuItem={deleteMenuItem}
          />
        );
      case 'settings':
        return <AdminPrintSettings initialSettings={initialSettings} />; // Pass initialSettings
      default:
        return (
          <AdminDashboard
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
            // Truyền các props mới xuống AdminDashboard
            dateRange={dateRange}
            setDateRange={setDateRange}
            aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
            menuItems={menuItems}
            menuTypes={menuTypes}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-primary-bg flex overflow-hidden">
      <AdminSidebar
        adminSection={adminSection}
        setAdminSection={setAdminSection}
        handleLogout={handleLogout}
      />
      <div className="flex-1 overflow-hidden">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;