// src/components/tables/TableGrid.js

import React from 'react';
import { GalleryVertical, ShoppingBag } from 'lucide-react';

const TableGrid = ({
  tables, // Now expects an array of table objects
  selectedTable,
  setSelectedTable,
  orders,
  tableFilter,
  setTableFilter,
  recentItems,
  menuItems,
  addToOrder,
  autoOpenMenu,
  handleAutoOpenMenuToggle,
}) => {
  const getRecentMenuItems = () => {
    if (!recentItems || !menuItems) return [];
    return recentItems
      .map((id) => menuItems.find((item) => item?.id === id))
      .filter(Boolean)
      .slice(0, 6);
  };

  const getFilteredTables = () => {
    if (!tables) return [];
    
    // Sort tables: special tables first, then by ID ascending
    const sortedAndFilteredTables = [...tables]
      .sort((a, b) => {
        if (a.isSpecial && !b.isSpecial) return -1;
        if (!a.isSpecial && b.isSpecial) return 1;
        // If both are special or both are regular, sort by ID
        return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
      })
      .filter((table) => {
        const hasOrders = orders?.[table.id] && orders[table.id].length > 0;
        if (tableFilter === 'available') {
          return !hasOrders;
        } else if (tableFilter === 'used') {
          return hasOrders;
        }
        return true; // 'all' filter
      });

    return sortedAndFilteredTables;
  };

  return (
    <div className="p-8 h-full flex flex-col bg-primary-bg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-headline mb-3">CASHAA</h1>
        <p className="text-primary-paragraph text-lg">Quản lý bàn ăn hiện đại</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTableFilter('all')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            tableFilter === 'all'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
          aria-label="Show all tables"
        >
          Tất cả bàn
        </button>
        <button
          onClick={() => setTableFilter('available')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            tableFilter === 'available'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-highlight'
          }`}
          aria-label="Show available tables"
        >
          Còn trống
        </button>
        <button
          onClick={() => setTableFilter('used')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
            tableFilter === 'used'
              ? 'bg-primary-button text-primary-main shadow-lg'
              : 'bg-primary-main text-primary-headline hover:bg-primary-secondary'
          }`}
          aria-label="Show used tables"
        >
          Đã sử dụng
        </button>
      </div>

      {/* Recent Items & Auto-open Menu Toggle */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-primary-headline">
            Món gần đây
          </h3>
          <div className="flex items-center gap-2">
            <label htmlFor="autoOpenMenu" className="text-sm font-medium text-primary-paragraph">
              Tự động mở menu
            </label>
            <button
                onClick={handleAutoOpenMenuToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
                    autoOpenMenu ? 'bg-primary-button' : 'bg-gray-300'
                }`}
                id="autoOpenMenu"
            >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                        autoOpenMenu ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
            {getRecentMenuItems().map((item) => (
              <button
                key={item.id}
                onClick={() => addToOrder(item)}
                className="flex-shrink-0 px-4 py-2 bg-primary-main rounded-xl hover:bg-primary-secondary transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label={`Add ${item.name} to order`}
              >
                <span className="text-sm font-medium text-primary-paragraph whitespace-nowrap">
                  {item.name}
                </span>
              </button>
            ))}
        </div>
      </div>
      
      {/* Table Grid Wrapper with scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-6 gap-4">
          {getFilteredTables().map((table) => {
            const hasOrders = orders?.[table.id] && orders[table.id].length > 0;
            const IconComponent = table.icon;
            return (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`
                  h-40 rounded-3xl flex flex-col items-center justify-center 
                  transition-all duration-300 hover:scale-105 shadow-lg
                  font-bold text-lg
                  ${
                    selectedTable === table.id
                      ? 'bg-primary-button text-white shadow-xl'
                      : hasOrders
                        ? 'bg-primary-button-light text-primary-paragraph shadow-md'
                        : 'bg-primary-main text-primary-paragraph hover:bg-primary-secondary'
                  }
                `}
                aria-label={`Select table ${table.name}`}
              >
                <div className="mb-1">
                  {IconComponent && <IconComponent size={30} />}
                </div>
                <div>{table.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TableGrid;