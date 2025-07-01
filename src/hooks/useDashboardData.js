// src/hooks/useDashboardData.js
import { useState, useMemo } from 'react';
import { MOCK_ORDERS_BY_DATE } from '../data/mockData';

// Helper function to get dates within a range (YYYY-MM-DD format)
const getDatesInDateRange = (startDateStr, rangeType) => {
    const dates = [];
    let currentDate = new Date(startDateStr);

    if (rangeType === 'day') {
        dates.push(startDateStr);
    } else if (rangeType === 'week') {
        const dayOfWeek = (currentDate.getDay() + 6) % 7; // Adjust to make Monday=0, Sunday=6
        currentDate.setDate(currentDate.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else if (rangeType === 'month') {
        currentDate.setDate(1); // Set to the first day of the month
        const month = currentDate.getMonth();
        while (currentDate.getMonth() === month) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return dates;
};

const useDashboardData = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState('day'); // New state for date range

  // Memoize aggregated orders based on selectedDate and dateRange
  const aggregatedOrdersForDisplay = useMemo(() => {
    const datesToConsider = getDatesInDateRange(selectedDate, dateRange);
    let aggregated = [];
    datesToConsider.forEach(date => {
        // Đảm bảo MOCK_ORDERS_BY_DATE[date] luôn là một mảng (hoặc rỗng nếu không có dữ liệu)
        const ordersOnDate = MOCK_ORDERS_BY_DATE[date] || [];
        aggregated = [...aggregated, ...ordersOnDate];
    });
    return aggregated;
  }, [selectedDate, dateRange, MOCK_ORDERS_BY_DATE]);

  return {
    selectedDate,
    setSelectedDate,
    paymentFilter,
    setPaymentFilter,
    MOCK_ORDERS_BY_DATE, // This is static, but can be managed by state if dynamic data fetching is implemented
    dateRange, // New return value
    setDateRange, // New return value
    aggregatedOrdersForDisplay, // New aggregated data
  };
};

export default useDashboardData;