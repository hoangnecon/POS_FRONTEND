// src/admin/AdminMenus.js
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, UtensilsCrossed } from 'lucide-react';
import AdminTables from './AdminTables'; // Import AdminTables

const AdminMenus = ({
  menuTypes,
  setMenuTypes,
  menuItems, // Giữ lại nếu cần hiển thị thông tin món ăn liên quan đến loại món
  addMenuType,
  deleteMenuType,
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
  // Thêm props cho quản lý bàn
  tables,
  setTables,
  addTable, // Mới
  updateTable, // Mới
  deleteTable, // Mới
}) => {
  const [showAddMenuTypeDialog, setShowAddMenuTypeDialog] = useState(false);
  const [newMenuTypeName, setNewMenuTypeName] = useState('');
  const [selectedMenuTypeEdit, setSelectedMenuTypeEdit] = useState(null);

  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);

  // Thêm state để quản lý tab đang hoạt động
  const [activeTab, setActiveTab] = useState('menuAndCategory'); // 'menuAndCategory' hoặc 'tables'

  const handleAddMenuType = () => {
    if (newMenuTypeName.trim()) {
      const newId = newMenuTypeName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      if (menuTypes.some(type => type.id === newId)) {
        alert("ID loại menu đã tồn tại hoặc tên không hợp lệ!");
        return;
      }
      addMenuType(newId, newMenuTypeName);
      setShowAddMenuTypeDialog(false);
      setNewMenuTypeName('');
    }
  };

  const handleUpdateMenuType = () => {
    if (newMenuTypeName.trim() && selectedMenuTypeEdit) {
      setMenuTypes(menuTypes.map(type =>
        type.id === selectedMenuTypeEdit.id ? { ...type, name: newMenuTypeName } : type
      ));
      setShowAddMenuTypeDialog(false);
      setSelectedMenuTypeEdit(null);
      setNewMenuTypeName('');
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName);
      setShowAddCategoryDialog(false);
      setNewCategoryName('');
    }
  };

  const handleUpdateCategory = () => {
    if (newCategoryName.trim() && selectedCategoryEdit) {
      updateCategory(selectedCategoryEdit.id, newCategoryName);
      setShowAddCategoryDialog(false);
      setSelectedCategoryEdit(null);
      setNewCategoryName('');
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-primary-bg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary-headline mb-3">Quản lý Menu & Bàn</h1>
          <p className="text-primary-paragraph text-lg">Quản lý các loại menu, loại món và bàn trong hệ thống.</p>
        </div>
      </div>

      {/* Tab Navigation với style mới và bỏ đường kẻ */}
      <div className="flex gap-3 mb-8 pb-3"> {/* Đã bỏ 'border-b border-primary-secondary' */}
        <button
          onClick={() => setActiveTab('menuAndCategory')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            activeTab === 'menuAndCategory'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
        >
          Quản lý Món & Loại món
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            activeTab === 'tables'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
        >
          Quản lý Bàn
        </button>
      </div>

      {/* Conditional Rendering based on activeTab */}
      {activeTab === 'menuAndCategory' && (
        <>
          {/* Quản lý Loại Menu */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-headline">Loại Menu</h2>
              <button onClick={() => setShowAddMenuTypeDialog(true)} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg">
                <Plus size={20} /> Thêm Loại Menu
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuTypes.map((type) => (
                <div key={type.id} className="bg-primary-main rounded-3xl p-6 shadow-xl flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary-headline">{type.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedMenuTypeEdit(type); setNewMenuTypeName(type.name); setShowAddMenuTypeDialog(true); }} className="p-2 text-primary-button hover:bg-primary-secondary rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => deleteMenuType(type.id)} className="p-2 text-primary-tertiary hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quản lý Loại Món */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-headline">Loại Món</h2>
              <button onClick={() => setShowAddCategoryDialog(true)} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg">
                <Plus size={20} /> Thêm Loại Món
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-primary-main rounded-3xl p-6 shadow-xl flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary-headline">{category.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedCategoryEdit(category); setNewCategoryName(category.name); setShowAddCategoryDialog(true); }} className="p-2 text-primary-button hover:bg-primary-secondary rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => deleteCategory(category.id)} className="p-2 text-primary-tertiary hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dialog for Add/Edit Menu Type */}
          {showAddMenuTypeDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-primary-headline mb-4">
                  {selectedMenuTypeEdit ? 'Sửa Loại Menu' : 'Thêm Loại Menu Mới'}
                </h3>
                <input
                  type="text"
                  value={newMenuTypeName}
                  onChange={(e) => setNewMenuTypeName(e.target.value)}
                  placeholder="Tên loại menu"
                  className="w-full p-3 bg-primary-secondary rounded-xl text-primary-headline"
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={selectedMenuTypeEdit ? handleUpdateMenuType : handleAddMenuType} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">
                    {selectedMenuTypeEdit ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button onClick={() => { setShowAddMenuTypeDialog(false); setSelectedMenuTypeEdit(null); setNewMenuTypeName(''); }} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dialog for Add/Edit Category */}
          {showAddCategoryDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-primary-headline mb-4">
                  {selectedCategoryEdit ? 'Sửa Loại Món' : 'Thêm Loại Món Mới'}
                </h3>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Tên loại món"
                  className="w-full p-3 bg-primary-secondary rounded-xl text-primary-headline"
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={selectedCategoryEdit ? handleUpdateCategory : handleAddCategory} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">
                    {selectedCategoryEdit ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button onClick={() => { setShowAddCategoryDialog(false); setSelectedCategoryEdit(null); setNewCategoryName(''); }} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'tables' && (
        <AdminTables
          tables={tables}
          setTables={setTables}
          addTable={addTable} // Pass addTable from useTableManagement
          updateTable={updateTable} // Pass updateTable from useTableManagement
          deleteTable={deleteTable} // Pass deleteTable from useTableManagement
        />
      )}
    </div>
  );
};

export default AdminMenus;