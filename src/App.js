// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Import hooks
import useAuth from './hooks/useAuth';
import useTableManagement from './hooks/useTableManagement';
import useOrderManagement from './hooks/useOrderManagement';
import useMenuData from './hooks/useMenuData';
import useDashboardData from './hooks/useDashboardData';
import usePrinting from './hooks/usePrinting';

// Import components
import LoginPage from './components/auth/LoginPage';
import AdminPage from './admin/AdminPage';
import Sidebar from './components/common/Sidebar';
import TableGrid from './components/tables/TableGrid';
import MenuSection from './components/menu/MenuSection';
import Dashboard from './components/dashboard/Dashboard';
import OrderPanel from './components/order/OrderPanel';
import ChangeTableDialog from './components/order/ChangeTableDialog';
import { X, UtensilsCrossed } from 'lucide-react';

// Import data (only for initialSettings, as MOCK_ORDERS_BY_DATE is now from useDashboardData)
// Note: MOCK_ORDERS_BY_DATE is still imported in useDashboardData.js
import { MENU_ITEMS, CATEGORIES, MENU_TYPES } from './data/mockData';

function App() {
  // Global state for active UI section (controlled by Sidebar)
  const [activeSection, setActiveSection] = useState('tables');
  const [adminSection, setAdminSection] = useState('dashboard'); // State specific to AdminPage

  // --- Sử dụng các Custom Hooks ---
  const {
    tables, setTables, addTable, updateTable, deleteTable
  } = useTableManagement();

  const {
    menuItems, menuTypes, setMenuTypes, categories,
    addMenuType, deleteMenuType, addMenuItem, updateMenuItem, deleteMenuItem,
    addCategory, updateCategory, deleteCategory,
    searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedMenuType, setSelectedMenuType,
  } = useMenuData();

  const {
    selectedTable, setSelectedTable, orders, setOrders,
    recentItems, setRecentItems, tableNotes, setTableNotes, itemNotes, setItemNotes,
    tableFilter, setTableFilter, showNoteDialog, setShowNoteDialog,
    currentNoteType, setCurrentNoteType, currentNoteTarget, setCurrentNoteTarget,
    noteInput, setNoteInput, showChangeTableDialog, setShowChangeTableDialog,
    autoOpenMenu, handleAutoOpenMenuToggle,
    addToOrder, updateQuantity, clearTable,
    handleNoteSubmit, openTableNoteDialog, openItemNoteDialog, handleChangeTable,
  } = useOrderManagement(tables, menuItems);

  // Updated to receive new states/functions from useDashboardData
  const {
    selectedDate, setSelectedDate, paymentFilter, setPaymentFilter,
    dateRange, setDateRange, aggregatedOrdersForDisplay, MOCK_ORDERS_BY_DATE
  } = useDashboardData();

  const { triggerPrint, initialSettings } = usePrinting(orders, selectedTable, tables);

  // --- Auth Hook (đã có từ trước) ---
  const {
    isLoggedIn, showLoginPage, loginEmail, setLoginEmail, loginPassword,
    setLoginPassword, isAdmin, handleLogin, handleAdminLogin, handleLogout
  } = useAuth(
    () => {
      // Callback khi login thành công
      setActiveSection('tables'); // Về trang chính
      setAdminSection('dashboard'); // Đảm bảo admin dash là mặc định
    },
    () => {
      // Callback khi logout
      setSelectedTable(null); // Reset table selection
      setOrders({}); // Clear all orders
      setTableNotes({}); // Clear all table notes
      setItemNotes({}); // Clear all item notes
      setActiveSection('tables'); // Về trang login/mặc định
      setAdminSection('dashboard'); // Reset admin section
    }
  );

  // --- Additional Logic / Effects ---
  // Effect để tự động mở menu khi chọn bàn và autoOpenMenu bật
  useEffect(() => {
    if (selectedTable && autoOpenMenu) {
      setActiveSection('menu');
    }
  }, [selectedTable, autoOpenMenu, setActiveSection]);


  // --- Helper function for Payment processing that interacts with OrderManagement ---
  const processPaymentAndOrders = (paymentData, type = 'full') => {
    if (type === 'full') {
      triggerPrint('provisional'); // Call printing logic
      clearTable(); // Clear table after full payment (from useOrderManagement)
    } else if (type === 'partial') {
      // This is partial payment logic, which modifies the order directly
      const currentOrder = [...(orders[selectedTable] || [])];
      const updatedOrder = currentOrder.map((orderItem) => {
        const paidItem = paymentData.paidItems.find((p) => p.id === orderItem.id);
        if (paidItem) { return { ...orderItem, quantity: orderItem.quantity - paidItem.quantity }; }
        return orderItem;
      }).filter((item) => item.quantity > 0);
      setOrders({ ...orders, [selectedTable]: updatedOrder }); // Update orders (from useOrderManagement)
    }
  };


  // --- Render UI ---
  if (showLoginPage && !isLoggedIn) {
    return (
      <LoginPage
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
        handleAdminLogin={handleAdminLogin}
      />
    );
  }

  if (isAdmin) {
    return (
      <AdminPage
        adminSection={adminSection}
        setAdminSection={setAdminSection}
        handleLogout={handleLogout}
        // Menu Data props
        menuTypes={menuTypes}
        setMenuTypes={setMenuTypes}
        addMenuType={addMenuType}
        deleteMenuType={deleteMenuType}
        menuItems={menuItems}
        addMenuItem={addMenuItem}
        updateMenuItem={updateMenuItem}
        deleteMenuItem={deleteMenuItem}
        categories={categories}
        addCategory={addCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        // Dashboard Data props (new props passed)
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
        MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE} // Only needed if raw MOCK_ORDERS_BY_DATE is explicitly used in AdminDashboard
        // Table Data props
        tables={tables}
        setTables={setTables}
        addTable={addTable}
        updateTable={updateTable}
        deleteTable={deleteTable}
        // Print Settings (initialSettings for AdminPrintSettings component)
        initialSettings={initialSettings}
      />
    );
  }

  return (
    <div className="h-screen bg-primary-bg flex overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} handleLogout={handleLogout} />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {activeSection === 'tables' && (
            <TableGrid
              tables={tables}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              orders={orders}
              tableFilter={tableFilter}
              setTableFilter={setTableFilter}
              recentItems={recentItems}
              menuItems={menuItems}
              addToOrder={addToOrder}
              autoOpenMenu={autoOpenMenu}
              handleAutoOpenMenuToggle={handleAutoOpenMenuToggle}
            />
          )}
          {activeSection === 'menu' && (
            <MenuSection
              selectedTable={selectedTable}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedMenuType={selectedMenuType}
              setSelectedMenuType={setSelectedMenuType}
              menuItems={menuItems}
              menuTypes={menuTypes}
              categories={categories}
              addToOrder={addToOrder}
            />
          )}
          {activeSection === 'dashboard' && (
            <Dashboard
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
            />
          )}
        </div>
        <OrderPanel
          selectedTable={selectedTable}
          orders={orders}
          itemNotes={itemNotes}
          tableNotes={tableNotes}
          updateQuantity={updateQuantity}
          clearTable={clearTable}
          processPayment={processPaymentAndOrders}
          openTableNoteDialog={openTableNoteDialog}
          openItemNoteDialog={openItemNoteDialog}
          openChangeTableDialog={() => setShowChangeTableDialog(true)}
          handlePrint={triggerPrint}
        />
      </div>
      {showNoteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-primary-headline mb-4">
              {currentNoteType === 'table' ? 'Ghi chú đơn hàng' : 'Ghi chú món ăn'}
            </h3>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Nhập ghi chú..."
              className="w-full h-24 p-3 rounded-xl bg-primary-secondary text-primary-headline resize-none focus:ring-2 focus:ring-primary-highlight shadow-md"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleNoteSubmit}
                className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold shadow-md"
              >
                Lưu
              </button>
              <button
                onClick={() => { setShowNoteDialog(false); setNoteInput(''); }}
                className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold shadow-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {showChangeTableDialog && selectedTable && (
        <ChangeTableDialog
          tables={tables}
          orders={orders}
          currentTable={selectedTable}
          onClose={() => setShowChangeTableDialog(false)}
          onTableSelect={handleChangeTable}
        />
      )}
    </div>
  );
}

export default App;