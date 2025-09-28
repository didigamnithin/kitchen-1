import { Brand, Location, MenuItem, Order, Driver, Ingredient } from '../types';

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Spice Garden',
    color: '#FF6B35',
    logo: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=64&h=64&fit=crop',
    locations: []
  },
  {
    id: '2',
    name: 'Tandoor Express',
    color: '#2E86AB',
    logo: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?w=64&h=64&fit=crop',
    locations: []
  },
  {
    id: '3',
    name: 'South Indian Delights',
    color: '#A23B72',
    logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=64&h=64&fit=crop',
    locations: []
  }
];

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Mumbai Central Kitchen',
    address: '123 Linking Road, Bandra West, Mumbai',
    brandId: '1',
    isActive: true,
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: '2',
    name: 'Delhi NCR Kitchen',
    address: '456 Connaught Place, New Delhi',
    brandId: '1',
    isActive: true,
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: '3',
    name: 'Bangalore Hub',
    address: '789 Brigade Road, Bangalore',
    brandId: '2',
    isActive: true,
    coordinates: { lat: 12.9716, lng: 77.5946 }
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato and cream sauce with aromatic spices',
    price: 299,
    category: 'North Indian',
    brandId: '1',
    isAvailable: true,
    preparationTime: 12,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=400&h=300&fit=crop',
    modifiers: [
      {
        id: '1',
        name: 'Spice Level',
        price: 0,
        isRequired: true,
        options: [
          { id: '1', name: 'Mild', price: 0 },
          { id: '2', name: 'Medium', price: 0 },
          { id: '3', name: 'Hot', price: 0 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Tandoori Chicken',
    description: 'Marinated chicken cooked in clay oven with yogurt and spices',
    price: 349,
    category: 'Tandoor',
    brandId: '2',
    isAvailable: true,
    preparationTime: 18,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato and served with sambar',
    price: 149,
    category: 'South Indian',
    brandId: '3',
    isAvailable: true,
    preparationTime: 8,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Biryani Rice',
    description: 'Fragrant basmati rice cooked with aromatic spices and herbs',
    price: 199,
    category: 'Rice',
    brandId: '1',
    isAvailable: true,
    preparationTime: 15,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked with butter and cream',
    price: 179,
    category: 'Dal',
    brandId: '1',
    isAvailable: true,
    preparationTime: 10,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    name: 'Idli Sambar',
    description: 'Soft rice cakes served with tangy lentil soup',
    price: 89,
    category: 'South Indian',
    brandId: '3',
    isAvailable: true,
    preparationTime: 5,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    channel: 'aggregator',
    channelOrderId: 'SW-12345',
    aggregatorName: 'Swiggy',
    brandId: '1',
    locationId: '1',
    status: 'confirmed',
    items: [
      {
        id: '1',
        menuItemId: '1',
        name: 'Butter Chicken',
        quantity: 2,
        price: 299,
        modifiers: [
          {
            id: '1',
            name: 'Spice Level',
            price: 0,
            selectedOptions: [{ id: '2', name: 'Medium', price: 0 }]
          }
        ]
      }
    ],
    customer: {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+919876543210',
      email: 'rajesh@example.com',
      address: {
        street: '123 Linking Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400050',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      }
    },
    totalAmount: 718,
    taxes: 65,
    deliveryFee: 30,
    aggregatorCommission: 144,
    netAmount: 574,
    estimatedPreparationTime: 12,
    orderType: 'delivery',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 300000), // 5 minutes ago
    updatedAt: new Date(),
    events: [
      {
        id: '1',
        orderId: '1',
        type: 'order_received',
        status: 'received',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        orderId: '1',
        type: 'order_confirmed',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 240000)
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    channel: 'aggregator',
    channelOrderId: 'ZM-67890',
    aggregatorName: 'Zomato',
    brandId: '2',
    locationId: '3',
    status: 'preparing',
    items: [
      {
        id: '2',
        menuItemId: '2',
        name: 'Tandoori Chicken',
        quantity: 1,
        price: 349,
        modifiers: []
      }
    ],
    customer: {
      id: '2',
      name: 'Priya Sharma',
      phone: '+919876543211',
      email: 'priya@example.com'
    },
    totalAmount: 419,
    taxes: 38,
    deliveryFee: 32,
    aggregatorCommission: 84,
    netAmount: 335,
    estimatedPreparationTime: 18,
    orderType: 'delivery',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 600000), // 10 minutes ago
    updatedAt: new Date(),
    events: [
      {
        id: '3',
        orderId: '2',
        type: 'order_received',
        status: 'received',
        timestamp: new Date(Date.now() - 600000)
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    channel: 'pos',
    brandId: '3',
    locationId: '1',
    status: 'ready',
    items: [
      {
        id: '3',
        menuItemId: '3',
        name: 'Masala Dosa',
        quantity: 2,
        price: 149,
        modifiers: []
      }
    ],
    customer: {
      id: '3',
      name: 'Arjun Patel',
      phone: '+919876543212'
    },
    totalAmount: 357,
    taxes: 32,
    deliveryFee: 0,
    aggregatorCommission: 0,
    netAmount: 357,
    estimatedPreparationTime: 8,
    actualPreparationTime: 10,
    orderType: 'pickup',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
    updatedAt: new Date(),
    events: []
  }
];

export const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Vikram Singh',
    phone: '+919876543220',
    email: 'vikram@drivers.com',
    vehicleType: 'bike',
    vehicleNumber: 'MH-01-AB-1234',
    isOnline: true,
    currentLocation: { lat: 19.0760, lng: 72.8777 },
    activeOrderIds: ['1'],
    rating: 4.8,
    completedOrders: 156
  },
  {
    id: '2',
    name: 'Rahul Kumar',
    phone: '+919876543221',
    email: 'rahul@drivers.com',
    vehicleType: 'car',
    vehicleNumber: 'DL-01-CD-5678',
    isOnline: true,
    currentLocation: { lat: 28.6139, lng: 77.2090 },
    activeOrderIds: [],
    rating: 4.6,
    completedOrders: 203
  },
  {
    id: '3',
    name: 'Suresh Reddy',
    phone: '+919876543222',
    email: 'suresh@drivers.com',
    vehicleType: 'scooter',
    vehicleNumber: 'KA-01-EF-9012',
    isOnline: false,
    activeOrderIds: [],
    rating: 4.9,
    completedOrders: 89
  }
];

export const mockIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Chicken (Boneless)',
    unit: 'kg',
    costPerUnit: 280,
    currentStock: 25,
    minimumStock: 8,
    supplierId: 'supplier-1'
  },
  {
    id: '2',
    name: 'Basmati Rice',
    unit: 'kg',
    costPerUnit: 120,
    currentStock: 50,
    minimumStock: 20,
    supplierId: 'supplier-1'
  },
  {
    id: '3',
    name: 'Paneer',
    unit: 'kg',
    costPerUnit: 180,
    currentStock: 12,
    minimumStock: 5,
    supplierId: 'supplier-2'
  },
  {
    id: '4',
    name: 'Dosa Batter',
    unit: 'kg',
    costPerUnit: 45,
    currentStock: 15,
    minimumStock: 8,
    supplierId: 'supplier-2'
  },
  {
    id: '5',
    name: 'Garam Masala',
    unit: 'kg',
    costPerUnit: 800,
    currentStock: 2,
    minimumStock: 1,
    supplierId: 'supplier-3'
  },
  {
    id: '6',
    name: 'Turmeric Powder',
    unit: 'kg',
    costPerUnit: 200,
    currentStock: 3,
    minimumStock: 1,
    supplierId: 'supplier-3'
  },
  {
    id: '7',
    name: 'Cumin Seeds',
    unit: 'kg',
    costPerUnit: 350,
    currentStock: 2,
    minimumStock: 1,
    supplierId: 'supplier-3'
  },
  {
    id: '8',
    name: 'Coriander Leaves',
    unit: 'bunch',
    costPerUnit: 15,
    currentStock: 20,
    minimumStock: 10,
    supplierId: 'supplier-4'
  }
];