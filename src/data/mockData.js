import { UtensilsCrossed, Star, Coffee, ChefHat, Heart } from 'lucide-react';

export const MENU_ITEMS = [
  {
    id: 1,
    name: 'Phở Bò Đặc Biệt',
    category: 'Phở',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1533787761082-492a5b83e614?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'regular'
  },
  {
    id: 2,
    name: 'Phở Gà Hà Nội',
    category: 'Phở',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1590420882553-4f9150b71f92?w=300&h=200&fit=crop',
    isPopular: false,
    menuType: 'regular'
  },
  {
    id: 3,
    name: 'Bún Bò Huế',
    category: 'Bún',
    price: 79000,
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'regular'
  },
  {
    id: 4,
    name: 'Bún Chả Hà Nội',
    category: 'Bún',
    price: 85000,
    image: 'https://images.pexels.com/photos/2059153/pexels-photo-2059153.jpeg?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'regular'
  },
  {
    id: 5,
    name: 'Bánh Mì Thịt Nướng',
    category: 'Bánh',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1600454309261-3dc9b7597637?w=300&h=200&fit=crop',
    isPopular: false,
    menuType: 'regular'
  },
  {
    id: 6,
    name: 'Gỏi Cuốn Tôm Thịt',
    category: 'Khai vị',
    price: 45000,
    image: 'https://images.pexels.com/photos/6646082/pexels-photo-6646082.jpeg?w=300&h=200&fit=crop',
    isPopular: false,
    menuType: 'regular'
  },
  {
    id: 7,
    name: 'Cơm Tấm Sài Gòn',
    category: 'Cơm',
    price: 95000,
    image: 'https://images.pexels.com/photos/6646037/pexels-photo-6646037.jpeg?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'regular'
  },
  {
    id: 8,
    name: 'Cà Phê Đen Đá',
    category: 'Đồ uống',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1641440615059-42c8ed3af8c8?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'regular'
  },
  // Holiday menu items
  {
    id: 11,
    name: 'Phở Bò Đặc Biệt Tết',
    category: 'Phở',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1533787761082-492a5b83e614?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'holiday'
  },
  {
    id: 12,
    name: 'Bánh Chưng Chiên',
    category: 'Món Tết',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1600454309261-3dc9b7597637?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'holiday'
  },
  {
    id: 13,
    name: 'Thịt Kho Tàu',
    category: 'Món Tết',
    price: 150000,
    image: 'https://images.pexels.com/photos/2059153/pexels-photo-2059153.jpeg?w=300&h=200&fit=crop',
    isPopular: true,
    menuType: 'holiday'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: UtensilsCrossed },
  { id: 'popular', name: 'Phổ biến', icon: Star },
  { id: 'Phở', name: 'Phở', icon: Coffee },
  { id: 'Bún', name: 'Bún', icon: ChefHat },
  { id: 'Cơm', name: 'Cơm', icon: UtensilsCrossed },
  { id: 'Bánh', name: 'Bánh', icon: Coffee },
  { id: 'Khai vị', name: 'Khai vị', icon: Heart },
  { id: 'Đồ uống', name: 'Đồ uống', icon: Coffee },
  { id: 'Món Tết', name: 'Món Tết', icon: Star }
];

export const MENU_TYPES = [
  { id: 'regular', name: 'Thực đơn thường ngày' },
  { id: 'holiday', name: 'Thực đơn Tết' }
];

export const MOCK_ORDERS_BY_DATE = {
  '2024-01-15': [
    {
      id: 'ORD001',
      tableNumber: 5,
      date: '2024-01-15',
      time: '14:30',
      cashier: 'Nguyễn Văn A',
      paymentMethod: 'cash',
      total: 245000,
      items: [
        { name: 'Phở Bò Đặc Biệt', quantity: 2, price: 89000 },
        { name: 'Cà Phê Đen Đá', quantity: 2, price: 25000 },
        { name: 'Bánh Mì Thịt Nướng', quantity: 1, price: 35000 }
      ]
    },
    {
      id: 'ORD002',
      tableNumber: 12,
      date: '2024-01-15',
      time: '15:45',
      cashier: 'Trần Thị B',
      paymentMethod: 'transfer',
      total: 190000,
      items: [
        { name: 'Bún Bò Huế', quantity: 2, price: 79000 },
        { name: 'Trà Sữa Thái Xanh', quantity: 1, price: 39000 }
      ]
    }
  ],
  '2024-01-14': [
    {
      id: 'ORD003',
      tableNumber: 8,
      date: '2024-01-14',
      time: '16:20',
      cashier: 'Lê Văn C',
      paymentMethod: 'cash',
      total: 180000,
      items: [
        { name: 'Bún Chả Hà Nội', quantity: 2, price: 85000 },
        { name: 'Cà Phê Đen Đá', quantity: 1, price: 25000 }
      ]
    }
  ]
};