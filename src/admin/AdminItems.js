// src/admin/AdminItems.js
import React, { useState } from 'react';
import { Plus, Star, Edit3, Trash2 } from 'lucide-react';

const ItemDialog = ({ mode, item, onSave, onClose, menuTypes, categories }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        // Lấy category đầu tiên làm mặc định nếu không có item
        category: item?.category || (categories.find(c => c.id !== 'all' && c.id !== 'popular')?.name || ''),
        price: item?.price || 0,
        image: item?.image || '',
        isPopular: item?.isPopular || false,
        menuType: item?.menuType || menuTypes[0]?.id || 'regular'
    });

    const handleSave = () => {
        if (formData.name && formData.category && formData.price > 0) {
            onSave(formData);
            onClose();
        } else {
            alert("Vui lòng điền đầy đủ thông tin tên, danh mục và giá.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-primary-main rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <h3 className="text-lg font-bold text-primary-headline mb-4">
                    {mode === 'add' ? 'Thêm Món Mới' : 'Sửa Món Ăn'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Tên món</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-primary-secondary rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Danh mục</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 bg-primary-secondary rounded-xl">
                                {categories.filter(cat => cat.id !== 'all' && cat.id !== 'popular').map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Giá (VND)</label>
                            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-3 bg-primary-secondary rounded-xl" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">URL Hình ảnh</label>
                            <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full p-3 bg-primary-secondary rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Loại menu</label>
                            <select value={formData.menuType} onChange={(e) => setFormData({ ...formData, menuType: e.target.value })} className="w-full p-3 bg-primary-secondary rounded-xl">
                                {menuTypes.map((menu) => (
                                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <input type="checkbox" id="isPopular" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })} className="w-5 h-5 text-primary-button rounded" />
                            <label htmlFor="isPopular" className="text-sm font-medium text-primary-paragraph">Món phổ biến</label>
                        </div>
                        {formData.image && (
                            <div>
                                <label className="block text-sm font-medium text-primary-paragraph mb-2">Xem trước</label>
                                <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={handleSave} className="flex-1 bg-primary-button text-primary-main py-3 rounded-xl font-bold hover:bg-primary-highlight transition-colors shadow-md">{mode === 'add' ? 'Thêm' : 'Cập nhật'}</button>
                    <button onClick={onClose} className="flex-1 bg-primary-secondary text-primary-button py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors shadow-md">Hủy</button>
                </div>
            </div>
        </div>
    );
};

const AdminItems = ({
  menuItems,
  menuTypes,
  categories, // Nhận prop categories
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
}) => {
  const [itemFilter, setItemFilter] = useState('all');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const filteredItems = menuItems.filter((item) => {
    if (itemFilter === 'all') return true;
    return item.menuType === itemFilter;
  });

  return (
    <div className="p-8 h-full overflow-y-auto bg-primary-bg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary-headline mb-3">Quản lý Món ăn</h1>
          <p className="text-primary-paragraph text-lg">Thêm, sửa, xóa các món ăn trong thực đơn</p>
        </div>
        <button onClick={() => setShowAddItemDialog(true)} className="bg-primary-button text-primary-main px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-highlight transition-colors shadow-lg">
          <Plus size={20} /> Thêm Món Mới
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setItemFilter('all')} className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-md ${itemFilter === 'all' ? 'bg-primary-button text-primary-main' : 'bg-primary-main'}`}>
          Tất cả ({menuItems.length})
        </button>
        {menuTypes.map((menu) => (
          <button key={menu.id} onClick={() => setItemFilter(menu.id)} className={`px-4 py-2 rounded-xl font-medium transition-colors shadow-md ${itemFilter === menu.id ? 'bg-primary-button text-primary-main' : 'bg-primary-main'}`}>
            {menu.name} ({menuItems.filter((item) => item.menuType === menu.id).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-primary-main rounded-3xl p-4 shadow-xl">
            <div className="relative mb-4">
              <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-2xl" />
              {item.isPopular && <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full"><Star size={12} className="fill-current" /></div>}
            </div>
            <h3 className="font-bold text-primary-headline mb-1">{item.name}</h3>
            <p className="text-sm text-primary-paragraph mb-2">{item.category}</p>
            <p className="text-lg font-bold text-primary-headline mb-3">{item.price.toLocaleString('vi-VN')}đ</p>
            <div className="flex gap-2">
              <button onClick={() => { setSelectedMenuItem(item); setShowEditItemDialog(true); }} className="flex-1 bg-primary-button text-white py-2 rounded-lg font-medium hover:bg-blue-600 shadow-md">Sửa</button>
              <button onClick={() => deleteMenuItem(item.id)} className="flex-1 bg-primary-tertiary text-white py-2 rounded-lg font-medium hover:bg-red-600 shadow-md">Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {showAddItemDialog && <ItemDialog mode="add" onSave={addMenuItem} onClose={() => setShowAddItemDialog(false)} menuTypes={menuTypes} categories={categories} />}
      {showEditItemDialog && selectedMenuItem && <ItemDialog mode="edit" item={selectedMenuItem} onSave={(data) => updateMenuItem(selectedMenuItem.id, data)} onClose={() => { setShowEditItemDialog(false); setSelectedMenuItem(null); }} menuTypes={menuTypes} categories={categories} />}
    </div>
  );
};

export default AdminItems;