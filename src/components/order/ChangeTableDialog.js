import React from 'react';
import { X, Users, CornerDownLeft } from 'lucide-react';

const ChangeTableDialog = ({
  tables,
  orders,
  currentTable,
  onClose,
  onTableSelect,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary-headline">
            Đổi hoặc gộp đến bàn khác
          </h3>
          <button
            onClick={onClose}
            className="text-primary-paragraph hover:text-primary-headline"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-[60vh] overflow-y-auto">
          {Object.values(tables)
            .filter((table) => table.id !== currentTable)
            .map((table) => {
              const hasOrders = orders[table.id] && orders[table.id].length > 0;
              return (
                <button
                  key={table.id}
                  onClick={() => onTableSelect(table.id)}
                  className={`h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg font-bold text-lg ${
                    hasOrders
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                  aria-label={`Chuyển đến bàn ${table.id}`}
                >
                  <div className="mb-1">
                    {hasOrders ? (
                      <Users size={24} />
                    ) : (
                      <CornerDownLeft size={24} />
                    )}
                  </div>
                  <div>Bàn {table.id}</div>
                  <div className="text-xs font-normal">
                    {hasOrders ? 'Gộp đơn' : 'Chuyển bàn'}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ChangeTableDialog;