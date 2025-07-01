// src/admin/AdminMenus.js
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, UtensilsCrossed } from 'lucide-react';

const AdminMenus = ({
  menuTypes, setMenuTypes, menuItems, addMenuType, deleteMenuType,
  categories, addCategory, updateCategory, deleteCategory
}) => {
  // States for Menu Type
  const [showAddMenuDialog, setShowAddMenuDialog] = useState(false);
  const [showEditMenuDialog, setShowEditMenuDialog] = useState(false);
  const [selectedMenuTypeEdit, setSelectedMenuTypeEdit] = useState(null);
  const [newMenuType, setNewMenuType] = useState('');
  const [newMenuName, setNewMenuName] = useState('');

  // States for Category
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Handlers for Menu Type
  const handleAddMenu = () => { if (newMenuType && newMenuName) { addMenuType(newMenuType, newMenuName); setNewMenuType(''); setNewMenuName(''); setShowAddMenuDialog(false); } };
  const handleUpdateMenu = () => { if (newMenuName && selectedMenuTypeEdit) { setMenuTypes( menuTypes.map((menu) => menu.id === selectedMenuTypeEdit.id ? { ...menu, name: newMenuName } : menu) ); setShowEditMenuDialog(false); setSelectedMenuTypeEdit(null); setNewMenuName(''); } };

  // Handlers for Category
  const handleAddCategory = () => { if (newCategoryName) { addCategory(newCategoryName); setNewCategoryName(''); setShowAddCategoryDialog(false); } };
  const handleUpdateCategory = () => { if (newCategoryName && selectedCategoryEdit) { updateCategory(selectedCategoryEdit.id, newCategoryName); setShowEditCategoryDialog(false); setSelectedCategoryEdit(null); setNewCategoryName(''); } };

  return (
    <div className="p-8 h-full overflow-y-auto bg-primary-bg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary-headline mb-3">Quản lý Menu & Loại món</h1>
          <p className="text-primary-paragraph text-lg">Thêm, sửa, xóa các loại menu và loại món ăn</p>
        </div>
        <div className="flex gap-4">
            <button onClick={() => setShowAddMenuDialog(true)} className="bg-primary-button text-primary-main px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg">
                <Plus size={20} /> Thêm Menu
            </button>
            <button onClick={() => setShowAddCategoryDialog(true)} className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-600 transition-colors shadow-lg">
                <Plus size={20} /> Thêm Loại Món
            </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary-headline mb-4 mt-8">Các loại Menu (Thực đơn)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuTypes.map((menu) => (
          <div key={menu.id} className="bg-primary-main rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary-headline">{menu.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => { setSelectedMenuTypeEdit(menu); setNewMenuName(menu.name); setShowEditMenuDialog(true); }} className="p-2 text-primary-button hover:bg-primary-secondary rounded-lg"><Edit3 size={16} /></button>
                <button onClick={() => deleteMenuType(menu.id)} className="p-2 text-primary-tertiary hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-sm text-primary-paragraph">Số món: {menuItems.filter((item) => item.menuType === menu.id).length}</p>
            <p className="text-sm text-primary-paragraph">ID: {menu.id}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-primary-headline mb-4 mt-12">Các loại món ăn (Category)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.filter(c => c.id !== 'all' && c.id !== 'popular').map((cat) => (
          <div key={cat.id} className="bg-primary-main rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <UtensilsCrossed className="text-primary-button" />
                 <h3 className="text-xl font-bold text-primary-headline">{cat.name}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSelectedCategoryEdit(cat); setNewCategoryName(cat.name); setShowEditCategoryDialog(true); }} className="p-2 text-primary-button hover:bg-primary-secondary rounded-lg"><Edit3 size={16} /></button>
                <button onClick={() => deleteCategory(cat.id)} className="p-2 text-primary-tertiary hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-sm text-primary-paragraph">Số món: {menuItems.filter((item) => item.category === cat.name).length}</p>
             <p className="text-sm text-primary-paragraph">ID: {cat.id}</p>
          </div>
        ))}
      </div>

      {showAddMenuDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl"><h3 className="text-lg font-bold text-primary-headline mb-4">Thêm Menu Mới</h3><div className="space-y-4"><div><label className="block text-sm font-medium text-primary-paragraph mb-2">ID Menu (vd: summer, tet...)</label><input type="text" value={newMenuType} onChange={(e) => setNewMenuType(e.target.value)} className="w-full p-3 bg-primary-secondary rounded-xl" /></div><div><label className="block text-sm font-medium text-primary-paragraph mb-2">Tên Menu (vd: Thực đơn mùa hè)</label><input type="text" value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} className="w-full p-3 bg-primary-secondary rounded-xl" /></div></div><div className="flex gap-3 mt-6"><button onClick={handleAddMenu} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">Thêm</button><button onClick={() => setShowAddMenuDialog(false)} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button></div></div></div>
      )}
      {showEditMenuDialog && selectedMenuTypeEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl"><h3 className="text-lg font-bold text-primary-headline mb-4">Sửa tên Menu</h3><input type="text" value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} className="w-full p-3 bg-primary-secondary rounded-xl" /><div className="flex gap-3 mt-6"><button onClick={handleUpdateMenu} className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold">Cập nhật</button><button onClick={() => setShowEditMenuDialog(false)} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button></div></div></div>
      )}
      {showAddCategoryDialog && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl"><h3 className="text-lg font-bold text-primary-headline mb-4">Thêm Loại Món Mới</h3><label className="block text-sm font-medium text-primary-paragraph mb-2">Tên Loại Món (vd: Món Nước, Món Khô...)</label><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full p-3 bg-primary-secondary rounded-xl" /><div className="flex gap-3 mt-6"><button onClick={handleAddCategory} className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold">Thêm</button><button onClick={() => setShowAddCategoryDialog(false)} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button></div></div></div>
      )}
       {showEditCategoryDialog && selectedCategoryEdit && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl"><h3 className="text-lg font-bold text-primary-headline mb-4">Sửa Tên Loại Món</h3><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full p-3 bg-primary-secondary rounded-xl" /><div className="flex gap-3 mt-6"><button onClick={handleUpdateCategory} className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold">Cập nhật</button><button onClick={() => setShowEditCategoryDialog(false)} className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold">Hủy</button></div></div></div>
      )}
    </div>
  );
};

export default AdminMenus;