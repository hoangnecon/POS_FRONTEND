import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import LoginPage from './components/auth/LoginPage';
import StaffPinLoginPage from './components/auth/StaffPinLoginPage';
import AdminPage from './admin/AdminPage';
import Sidebar from './components/common/Sidebar';
import MobileHeader from './components/common/MobileHeader';
import TableGrid from './components/tables/TableGrid';
import MenuSection from './components/menu/MenuSection';
import Dashboard from './components/dashboard/Dashboard';
import CashierExpenses from './cashier/CashierExpenses';
import OrderPanel from './components/order/OrderPanel';
import ChangeTableDialog from './components/order/ChangeTableDialog';
import PrintReceipt from './components/order/PrintReceipt';
import { X, AlertCircle } from 'lucide-react';
import { MOCK_ORDERS_BY_DATE } from './data/mockData';
import useAuth from './hooks/useAuth';
import useTableManagement from './hooks/useTableManagement';
import useOrderManagement from './hooks/useOrderManagement';
import useMenuData from './hooks/useMenuData';
import useDashboardData from './hooks/useDashboardData';
import usePrinting from './hooks/usePrinting';
import useTheme from './hooks/useTheme';
import useDiscountSettings from './hooks/useDiscountSettings';
import useBankSettings from './hooks/useBankSettings';
import useBankList from './hooks/useBankList';
import useStaffManagement from './hooks/useStaffManagement';

function App() {
  const [activeSection, setActiveSection] = useState('tables');
  const [adminSection, setAdminSection] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [receiptToPrint, setReceiptToPrint] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileOrderPanelOpen, setIsMobileOrderPanelOpen] = useState(false);
  const [isDemoModeActive, setIsDemoModeActive] = useState(true);
  const [isDemoAdminView, setIsDemoAdminView] = useState(false);

  const { theme, setTheme } = useTheme();
  const { quickDiscountOptions, addDiscountOption, updateDiscountOption, deleteDiscountOption } = useDiscountSettings();
  const { bankSettings, setBankSettings } = useBankSettings();
  const { banks, loading: bankListLoading } = useBankList();
  const { staffList, addStaff, updateStaff, deleteStaff } = useStaffManagement();
  const { tables, setTables, addTable, updateTable, deleteTable } = useTableManagement();
  const {
    menuItems, setMenuItems, menuTypes, setMenuTypes, categories,
    addMenuType, deleteMenuType, addMenuItem, updateMenuItem, deleteMenuItem,
    updateItemInventory, addCategory, updateCategory, deleteCategory,
    searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedMenuType, setSelectedMenuType,
  } = useMenuData();
  const {
    selectedDate, setSelectedDate, paymentFilter, setPaymentFilter,
    dateRange, setDateRange, aggregatedOrdersForDisplay,
    expenses, addExpense,
  } = useDashboardData();

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i));
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notification.id)), 5000);
  }, []);

  const {
    selectedTable, setSelectedTable, orders, setOrders,
    recentItems, setRecentItems, tableNotes, setTableNotes, itemNotes, setItemNotes,
    tableFilter, setTableFilter, showNoteDialog, setShowNoteDialog,
    currentNoteType, setCurrentNoteType, currentNoteTarget, setCurrentNoteTarget,
    noteInput, setNoteInput, showChangeTableDialog, setShowChangeTableDialog,
    autoOpenMenu, handleAutoOpenMenuToggle,
    addToOrder, updateQuantity, clearTable,
    handleNoteSubmit, openTableNoteDialog, openItemNoteDialog, handleChangeTable,
  } = useOrderManagement(tables, menuItems, addNotification);

  const { getReceiptData, initialSettings } = usePrinting(orders, selectedTable, tables);

  const {
    authLevel, loggedInStaff, loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    handleLogin, handleAdminLogin, handleStaffLogin, handleStaffLogout, handleBusinessLogout,
  } = useAuth(staffList, (isAdminFlag) => {
    setActiveSection('tables');
    if (isAdminFlag) setAdminSection('dashboard');
  }, () => {
    setActiveSection('tables');
    setAdminSection('dashboard');
    setSelectedTable(null);
    setOrders({});
    setTableNotes({});
    setItemNotes({});
  });

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (selectedTable && autoOpenMenu) setActiveSection('menu');
  }, [selectedTable, autoOpenMenu]);

  const componentRef = useRef();

  useEffect(() => {
    if (receiptToPrint && componentRef.current) {
      console.log('useEffect: receiptToPrint:', receiptToPrint);
      const timer = setTimeout(() => {
        console.log('useEffect: Gọi window.print');
        window.print();
        setReceiptToPrint(null); // Xóa sau khi in
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [receiptToPrint]);

  const processPaymentAndOrders = useCallback((paymentData, type = 'full') => {
    console.log('processPaymentAndOrders: Bắt đầu xử lý.');
    const receiptType = type === 'full' ? 'provisional' : 'kitchen';
    const dataForPrint = getReceiptData(receiptType);

    if (dataForPrint) {
      dataForPrint.cashier = loggedInStaff?.name || 'Không xác định';
      dataForPrint.bankSettings = bankSettings || {};
      dataForPrint.banks = banks || [];
      dataForPrint.settings = initialSettings || {};
      setReceiptToPrint(dataForPrint);
    } else {
      addNotification({
        id: `print-error-${Date.now()}`,
        type: 'error',
        message: 'Không có dữ liệu để in hóa đơn.',
      });
    }

    if (type === 'full') {
      clearTable();
    } else if (type === 'partial') {
      const currentOrder = [...(orders[selectedTable] || [])];
      const updatedOrder = currentOrder.map((orderItem) => {
        const paidItem = paymentData.paidItems.find((p) => p.id === orderItem.id);
        if (paidItem) return { ...orderItem, quantity: orderItem.quantity - paidItem.quantity };
        return orderItem;
      }).filter((item) => item.quantity > 0);
      setOrders({ ...orders, [selectedTable]: updatedOrder });
    }
  }, [addNotification, getReceiptData, loggedInStaff, bankSettings, banks, clearTable, orders, selectedTable, setOrders, initialSettings]);

  const handleToggleView = useCallback(() => {
    setIsDemoAdminView(prev => !prev);
    setActiveSection('tables');
    setAdminSection('dashboard');
  }, []);

  const printComponent = receiptToPrint ? (
    <PrintReceipt ref={componentRef} receiptData={receiptToPrint} />
  ) : (
    <PrintReceipt ref={componentRef} receiptData={null} />
  );

  return (
    <>
      {(() => {
        if (isDemoModeActive) {
          if (isDemoAdminView) {
            return (
              <AdminPage
                adminSection={adminSection}
                setAdminSection={setAdminSection}
                handleLogout={handleBusinessLogout}
                staffList={staffList}
                addStaff={addStaff}
                updateStaff={updateStaff}
                deleteStaff={deleteStaff}
                MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}
                menuTypes={menuTypes}
                setMenuTypes={setMenuTypes}
                addMenuType={addMenuType}
                deleteMenuType={deleteMenuType}
                menuItems={menuItems}
                addMenuItem={addMenuItem}
                updateMenuItem={updateMenuItem}
                deleteMenuItem={deleteMenuItem}
                updateItemInventory={updateItemInventory}
                categories={categories}
                addCategory={addCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
                orders={orders}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                paymentFilter={paymentFilter}
                setPaymentFilter={setPaymentFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
                aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
                tables={tables}
                setTables={setTables}
                addTable={addTable}
                updateTable={updateTable}
                deleteTable={deleteTable}
                initialSettings={initialSettings}
                expenses={expenses}
                addExpense={addExpense}
                currentTheme={theme}
                onThemeChange={setTheme}
                quickDiscountOptions={quickDiscountOptions}
                addDiscountOption={addDiscountOption}
                updateDiscountOption={updateDiscountOption}
                deleteDiscountOption={deleteDiscountOption}
                bankSettings={bankSettings}
                setBankSettings={setBankSettings}
                bankList={banks}
                bankListLoading={bankListLoading}
                isDemoModeActive={isDemoModeActive}
                handleToggleView={handleToggleView}
              />
            );
          } else {
            const currentOrderItems = orders[selectedTable] || [];
            const orderItemCount = currentOrderItems.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div className="h-screen bg-primary-bg flex flex-col md:flex-row md:overflow-hidden">
                <MobileHeader
                  onToggleSidebar={() => setIsMobileSidebarOpen(true)}
                  onToggleOrderPanel={() => setIsMobileOrderPanelOpen(true)}
                  orderItemCount={orderItemCount}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
                {isMobileSidebarOpen && <div onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
                <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                  <Sidebar
                    activeSection={activeSection}
                    setActiveSection={(section) => {
                      setActiveSection(section);
                      setIsMobileSidebarOpen(false);
                    }}
                    handleStaffLogout={handleStaffLogout}
                    handleBusinessLogout={handleBusinessLogout}
                    loggedInStaff={loggedInStaff}
                    isDemoModeActive={isDemoModeActive}
                    handleToggleView={handleToggleView}
                  />
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 overflow-y-auto">
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
                        orders={orders}
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
                    {activeSection === 'expenses' && (
                      <CashierExpenses expenses={expenses} addExpense={addExpense} />
                    )}
                  </div>
                  <div className="hidden md:flex">
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
                      handlePrint={(type) => processPaymentAndOrders({}, type)}
                      quickDiscountOptions={quickDiscountOptions}
                      bankSettings={bankSettings}
                      banks={banks}
                    />
                  </div>
                </div>
                {isMobileOrderPanelOpen && <div onClick={() => setIsMobileOrderPanelOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
                <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out md:hidden ${isMobileOrderPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                    handlePrint={(type) => processPaymentAndOrders({}, type)}
                    quickDiscountOptions={quickDiscountOptions}
                    bankSettings={bankSettings}
                    banks={banks}
                  />
                </div>
              </div>
            );
          }
        } else {
          switch (authLevel) {
            case 'admin_auth':
              return (
                <AdminPage
                  adminSection={adminSection}
                  setAdminSection={setAdminSection}
                  handleLogout={handleBusinessLogout}
                  staffList={staffList}
                  addStaff={addStaff}
                  updateStaff={updateStaff}
                  deleteStaff={deleteStaff}
                  MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}
                  menuTypes={menuTypes}
                  setMenuTypes={setMenuTypes}
                  addMenuType={addMenuType}
                  deleteMenuType={deleteMenuType}
                  menuItems={menuItems}
                  addMenuItem={addMenuItem}
                  updateMenuItem={updateMenuItem}
                  deleteMenuItem={deleteMenuItem}
                  updateItemInventory={updateItemInventory}
                  categories={categories}
                  addCategory={addCategory}
                  updateCategory={updateCategory}
                  deleteCategory={deleteCategory}
                  orders={orders}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  paymentFilter={paymentFilter}
                  setPaymentFilter={setPaymentFilter}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
                  tables={tables}
                  setTables={setTables}
                  addTable={addTable}
                  updateTable={updateTable}
                  deleteTable={deleteTable}
                  initialSettings={initialSettings}
                  expenses={expenses}
                  addExpense={addExpense}
                  currentTheme={theme}
                  onThemeChange={setTheme}
                  quickDiscountOptions={quickDiscountOptions}
                  addDiscountOption={addDiscountOption}
                  updateDiscountOption={updateDiscountOption}
                  deleteDiscountOption={deleteDiscountOption}
                  bankSettings={bankSettings}
                  setBankSettings={setBankSettings}
                  bankList={banks}
                  bankListLoading={bankListLoading}
                  isDemoModeActive={false}
                  handleToggleView={handleToggleView}
                />
              );
            case 'staff_auth':
              const currentOrderItems = orders[selectedTable] || [];
              const orderItemCount = currentOrderItems.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div className="h-screen bg-primary-bg flex flex-col md:flex-row md:overflow-hidden">
                  <MobileHeader
                    onToggleSidebar={() => setIsMobileSidebarOpen(true)}
                    onToggleOrderPanel={() => setIsMobileOrderPanelOpen(true)}
                    orderItemCount={orderItemCount}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                  />
                  {isMobileSidebarOpen && <div onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
                  <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Sidebar
                      activeSection={activeSection}
                      setActiveSection={(section) => {
                        setActiveSection(section);
                        setIsMobileSidebarOpen(false);
                      }}
                      handleStaffLogout={handleStaffLogout}
                      handleBusinessLogout={handleBusinessLogout}
                      loggedInStaff={loggedInStaff}
                      isDemoModeActive={false}
                      handleToggleView={handleToggleView}
                    />
                  </div>
                  <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
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
                          orders={orders}
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
                      {activeSection === 'expenses' && (
                        <CashierExpenses expenses={expenses} addExpense={addExpense} />
                      )}
                    </div>
                    <div className="hidden md:flex">
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
                        handlePrint={(type) => processPaymentAndOrders({}, type)}
                        quickDiscountOptions={quickDiscountOptions}
                        bankSettings={bankSettings}
                        banks={banks}
                      />
                    </div>
                  </div>
                  {isMobileOrderPanelOpen && <div onClick={() => setIsMobileOrderPanelOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
                  <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out md:hidden ${isMobileOrderPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                      handlePrint={(type) => processPaymentAndOrders({}, type)}
                      quickDiscountOptions={quickDiscountOptions}
                      bankSettings={bankSettings}
                      banks={banks}
                    />
                  </div>
                </div>
              );
            case 'business_auth':
              return (
                <StaffPinLoginPage
                  staffList={staffList}
                  handleStaffLogin={handleStaffLogin}
                  handleBusinessLogout={handleBusinessLogout}
                />
              );
            case 'logged_out':
            default:
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
        }
      })()}

      <div className="absolute top-4 right-4 space-y-3 z-50">
        {notifications.map(n => (
          <div key={n.id} className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-lg shadow-lg flex items-center gap-3">
            <AlertCircle />
            <p>{n.message}</p>
            <button onClick={() => removeNotification(n.id)} className="ml-auto"><X size={18} /></button>
          </div>
        ))}
      </div>

      <div style={{ display: 'none' }}>
        {printComponent}
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
    </>
  );
}

export default App;