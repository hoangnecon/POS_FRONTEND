// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

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

// Import data
import { MENU_ITEMS, CATEGORIES, MENU_TYPES, MOCK_ORDERS_BY_DATE } from './data/mockData';

function App() {
  // STATE MANAGEMENT
  const [activeSection, setActiveSection] = useState('tables');
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMenuType, setSelectedMenuType] = useState('regular');
  const [orders, setOrders] = useState({});
  const [recentItems, setRecentItems] = useState([1, 3, 4, 7, 8]);
  const [tableNotes, setTableNotes] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  const [tableFilter, setTableFilter] = useState('all');
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [currentNoteType, setCurrentNoteType] = useState('table');
  const [currentNoteTarget, setCurrentNoteTarget] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [showChangeTableDialog, setShowChangeTableDialog] = useState(false);
  const [autoOpenMenu, setAutoOpenMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');
  const [menuTypes, setMenuTypes] = useState(MENU_TYPES);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [tables, setTables] = useState(() => {
    const initialTables = {};
    for (let i = 1; i <= 30; i++) {
      initialTables[i] = { id: i };
    }
    return initialTables;
  });

  const triggerPrint = async (type) => {
    const currentOrders = orders[selectedTable] || [];
    if (currentOrders.length === 0) {
      alert('Không có món nào để in.');
      return;
    }

    // Lấy cấu hình từ localStorage
    const savedSettings = localStorage.getItem('printSettings');
    const settings = savedSettings ? { ...initialSettings, ...JSON.parse(savedSettings) } : initialSettings;
    if (!settings.defaultPrinter || !settings.printerShareName) {
      alert('Vui lòng cấu hình máy in (tên máy in và Share name) trong Admin > Cài đặt in hóa đơn.');
      return;
    }

    // Chuẩn bị dữ liệu hóa đơn
    const total = currentOrders.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tableName = selectedTable === 'takeaway' ? 'Mang về' : `Bàn ${selectedTable}`;
    const currentDate = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }); // Ví dụ: 29/06/2025 19:34

    const payload = {
      isKitchenPrint: type === 'kitchen',
      tableName,
      currentDate,
      items: currentOrders.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      settings,
    };

    console.log('Gửi payload in:', payload); // Debug payload

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
        - Máy in K57 đã được chia sẻ với Share name "${settings.printerShareName}".
        - Driver máy in đã được cài đặt đúng.`);
    }
  };

  const processPayment = (paymentData, type = 'full') => {
    if (type === 'full') {
      triggerPrint('provisional');
      clearTable();
    } else if (type === 'partial') {
      const currentOrder = [...(orders[selectedTable] || [])];
      const updatedOrder = currentOrder.map((orderItem) => {
        const paidItem = paymentData.paidItems.find((p) => p.id === orderItem.id);
        if (paidItem) { return { ...orderItem, quantity: orderItem.quantity - paidItem.quantity }; }
        return orderItem;
      }).filter((item) => item.quantity > 0);
      setOrders({ ...orders, [selectedTable]: updatedOrder });
    }
  };
  
  const addCategory = (name) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    if (categories.some(cat => cat.id === newId)) { alert("ID loại món đã tồn tại hoặc tên không hợp lệ!"); return; }
    const newCategory = { id: newId, name, icon: UtensilsCrossed };
    setCategories([...categories, newCategory]);
  };
  const updateCategory = (categoryId, newName) => { setCategories(categories.map(cat => cat.id === categoryId ? { ...cat, name: newName } : cat)); };
  const deleteCategory = (categoryId) => { if (['all', 'popular'].includes(categoryId)) { alert("Không thể xóa loại món cơ bản này!"); return; } const categoryToDelete = categories.find(cat => cat.id === categoryId); if (!categoryToDelete) return; setCategories(categories.filter(cat => cat.id !== categoryId)); setMenuItems(menuItems.map(item => item.category === categoryToDelete.name ? { ...item, category: 'Khác' } : item)); };
  useEffect(() => { if (selectedTable && autoOpenMenu) { setActiveSection('menu'); } }, [selectedTable, autoOpenMenu]);
  const handleAutoOpenMenuToggle = () => setAutoOpenMenu((prev) => !prev);
  const handleLogin = () => { if (loginEmail && loginPassword) { setIsLoggedIn(true); setShowLoginPage(false); if (loginEmail.includes('admin') || loginPassword.includes('admin')) { setIsAdmin(true); } setLoginEmail(''); setLoginPassword(''); } };
  const handleLogout = () => { setIsLoggedIn(false); setIsAdmin(false); setShowLoginPage(true); setSelectedTable(null); setOrders({}); setActiveSection('tables'); setAdminSection('dashboard'); };
  const handleAdminLogin = () => { setIsAdmin(true); setIsLoggedIn(true); setShowLoginPage(false); };
  const addToOrder = (item) => { if (!selectedTable) return; const tableOrders = orders[selectedTable] || []; const existingItem = tableOrders.find((orderItem) => orderItem.id === item.id); if (existingItem) { setOrders({ ...orders, [selectedTable]: tableOrders.map((orderItem) => orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem), }); } else { setOrders({ ...orders, [selectedTable]: [...tableOrders, { ...item, quantity: 1 }], }); } setRecentItems((prev) => { const filtered = prev.filter((id) => id !== item.id); return [item.id, ...filtered].slice(0, 8); }); };
  const updateQuantity = (itemId, newQuantity) => { if (!selectedTable) return; if (newQuantity <= 0) { setOrders({ ...orders, [selectedTable]: (orders[selectedTable] || []).filter((item) => item.id !== itemId), }); const itemKey = `${selectedTable}-${itemId}`; const newItemNotes = { ...itemNotes }; delete newItemNotes[itemKey]; setItemNotes(newItemNotes); } else { setOrders({ ...orders, [selectedTable]: (orders[selectedTable] || []).map((item) => item.id === itemId ? { ...item, quantity: newQuantity } : item), }); } };
  const clearTable = () => { if (!selectedTable) return; setOrders({ ...orders, [selectedTable]: [] }); const newTableNotes = { ...tableNotes }; delete newTableNotes[selectedTable]; setTableNotes(newTableNotes); const newItemNotes = { ...itemNotes }; Object.keys(newItemNotes).forEach((key) => { if (key.startsWith(`${selectedTable}-`)) { delete newItemNotes[key]; } }); setItemNotes(newItemNotes); };
  const handleNoteSubmit = () => { if (currentNoteType === 'table') { setTableNotes({ ...tableNotes, [selectedTable]: noteInput }); } else if (currentNoteType === 'item') { const itemKey = `${selectedTable}-${currentNoteTarget}`; setItemNotes({ ...itemNotes, [itemKey]: noteInput }); } setNoteInput(''); setShowNoteDialog(false); };
  const openTableNoteDialog = () => { setCurrentNoteType('table'); setNoteInput(tableNotes[selectedTable] || ''); setShowNoteDialog(true); };
  const openItemNoteDialog = (itemId) => { setCurrentNoteType('item'); setCurrentNoteTarget(itemId); const itemKey = `${selectedTable}-${itemId}`; setNoteInput(itemNotes[itemKey] || ''); setShowNoteDialog(true); };
  const handleChangeTable = (targetTableId) => { if (!selectedTable || !orders[selectedTable]) return; const sourceOrder = orders[selectedTable] || []; const targetOrder = orders[targetTableId] || []; const mergedOrder = [...targetOrder]; sourceOrder.forEach((sourceItem) => { const existingItemIndex = mergedOrder.findIndex((item) => item.id === sourceItem.id); if (existingItemIndex > -1) { mergedOrder[existingItemIndex].quantity += sourceItem.quantity; } else { mergedOrder.push(sourceItem); } }); setOrders({ ...orders, [targetTableId]: mergedOrder, [selectedTable]: [], }); const newTableNotes = { ...tableNotes }; if (tableNotes[selectedTable]) { newTableNotes[targetTableId] = (newTableNotes[targetTableId] || '') + ' | ' + tableNotes[selectedTable]; delete newTableNotes[selectedTable]; setTableNotes(newTableNotes); } setShowChangeTableDialog(false); setSelectedTable(targetTableId); };
  const addMenuType = (id, name) => { const newMenu = { id, name }; setMenuTypes([...menuTypes, newMenu]); };
  const deleteMenuType = (menuTypeId) => { setMenuTypes(menuTypes.filter((menu) => menu.id !== menuTypeId)); setMenuItems(menuItems.filter((item) => item.menuType !== menuTypeId)); };
  const addMenuItem = (itemData) => { const newItem = { ...itemData, id: Math.max(0, ...menuItems.map((item) => item.id)) + 1, }; setMenuItems([...menuItems, newItem]); };
  const updateMenuItem = (itemId, itemData) => { setMenuItems( menuItems.map((item) => (item.id === itemId ? { ...item, ...itemData } : item)) ); };
  const deleteMenuItem = (itemId) => { setMenuItems(menuItems.filter((item) => item.id !== itemId)); };

  if (showLoginPage && !isLoggedIn) {
    return (
      <LoginPage loginEmail={loginEmail} setLoginEmail={setLoginEmail} loginPassword={loginPassword} setLoginPassword={setLoginPassword} handleLogin={handleLogin} handleAdminLogin={handleAdminLogin}/>
    );
  }

  if (isAdmin) {
    return (
      <AdminPage adminSection={adminSection} setAdminSection={setAdminSection} handleLogout={handleLogout} menuTypes={menuTypes} setMenuTypes={setMenuTypes} addMenuType={addMenuType} deleteMenuType={deleteMenuType} menuItems={menuItems} addMenuItem={addMenuItem} updateMenuItem={updateMenuItem} deleteMenuItem={deleteMenuItem} categories={categories} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} selectedDate={selectedDate} setSelectedDate={setSelectedDate} paymentFilter={paymentFilter} setPaymentFilter={setPaymentFilter} MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}/>
    );
  }

  return (
    <div className="h-screen bg-primary-bg flex overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} handleLogout={handleLogout} />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {activeSection === 'tables' && (<TableGrid tables={tables} selectedTable={selectedTable} setSelectedTable={setSelectedTable} orders={orders} tableFilter={tableFilter} setTableFilter={setTableFilter} recentItems={recentItems} menuItems={menuItems} addToOrder={addToOrder} autoOpenMenu={autoOpenMenu} handleAutoOpenMenuToggle={handleAutoOpenMenuToggle}/>)}
          {activeSection === 'menu' && (<MenuSection selectedTable={selectedTable} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedMenuType={selectedMenuType} setSelectedMenuType={setSelectedMenuType} menuItems={menuItems} menuTypes={menuTypes} categories={categories} addToOrder={addToOrder}/>)}
          {activeSection === 'dashboard' && (<Dashboard selectedDate={selectedDate} setSelectedDate={setSelectedDate} paymentFilter={paymentFilter} setPaymentFilter={setPaymentFilter} MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}/>)}
        </div>
        <OrderPanel selectedTable={selectedTable} orders={orders} itemNotes={itemNotes} tableNotes={tableNotes} updateQuantity={updateQuantity} clearTable={clearTable} processPayment={processPayment} openTableNoteDialog={openTableNoteDialog} openItemNoteDialog={openItemNoteDialog} openChangeTableDialog={() => setShowChangeTableDialog(true)} handlePrint={triggerPrint}/>
      </div>
      {showNoteDialog && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl"><h3 className="text-lg font-bold text-primary-headline mb-4">{currentNoteType === 'table' ? 'Ghi chú đơn hàng' : 'Ghi chú món ăn'}</h3><textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Nhập ghi chú..." className="w-full h-24 p-3 rounded-xl bg-primary-secondary text-primary-headline resize-none focus:ring-2 focus:ring-primary-highlight shadow-md"/><div className="flex gap-3 mt-4"><button onClick={handleNoteSubmit} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold shadow-md">Lưu</button><button onClick={() => { setShowNoteDialog(false); setNoteInput(''); }} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold shadow-md">Hủy</button></div></div></div>)}
      {showChangeTableDialog && selectedTable && (<ChangeTableDialog tables={tables} orders={orders} currentTable={selectedTable} onClose={() => setShowChangeTableDialog(false)} onTableSelect={handleChangeTable}/>)}
    </div>
  );
}

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

export default App;