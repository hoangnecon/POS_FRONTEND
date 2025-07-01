// src/admin/AdminPage.js
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminMenus from './AdminMenus';
import AdminItems from './AdminItems';
import AdminPrintSettings from './AdminPrintSettings';

const AdminPage = ({
  adminSection,
  setAdminSection,
  handleLogout,
  // Menu Types
  menuTypes,
  setMenuTypes,
  addMenuType,
  deleteMenuType,
  // Menu Items
  menuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  // Categories
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
  // Dashboard
  selectedDate,
  setSelectedDate,
  paymentFilter,
  setPaymentFilter,
  MOCK_ORDERS_BY_DATE,
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
            MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}
            menuItems={menuItems}
            menuTypes={menuTypes}
          />
        );
      case 'menus':
        return (
          <AdminMenus
            menuTypes={menuTypes}
            setMenuTypes={setMenuTypes}
            menuItems={menuItems}
            addMenuType={addMenuType}
            deleteMenuType={deleteMenuType}
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        );
      case 'items':
        return (
          <AdminItems
            menuItems={menuItems}
            menuTypes={menuTypes}
            categories={categories} // Cần truyền categories cho trang quản lý món ăn
            addMenuItem={addMenuItem}
            updateMenuItem={updateMenuItem}
            deleteMenuItem={deleteMenuItem}
          />
        );
      case 'settings':
        return <AdminPrintSettings />;
      default:
        return (
          <AdminDashboard
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
            MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}
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