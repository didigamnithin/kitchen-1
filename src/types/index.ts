export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'chain_manager' | 'kitchen_manager' | 'cook' | 'driver' | 'accountant';
  brandId?: string;
  locationId?: string;
  avatar?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  color: string;
  locations: Location[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  brandId: string;
  isActive: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brandId: string;
  isAvailable: boolean;
  preparationTime: number;
  image?: string;
  modifiers?: Modifier[];
  recipe?: Recipe;
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  isRequired: boolean;
  options?: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface Recipe {
  id: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
  minimumStock: number;
  supplierId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  channel: 'aggregator' | 'direct' | 'pos';
  channelOrderId?: string;
  aggregatorName?: string;
  brandId: string;
  locationId: string;
  status: 'received' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'delivered' | 'cancelled';
  items: OrderItem[];
  customer: Customer;
  totalAmount: number;
  taxes: number;
  deliveryFee: number;
  aggregatorCommission: number;
  netAmount: number;
  estimatedPreparationTime: number;
  actualPreparationTime?: number;
  orderType: 'delivery' | 'pickup';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  scheduledFor?: Date;
  specialInstructions?: string;
  driverId?: string;
  events: OrderEvent[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers: SelectedModifier[];
  specialInstructions?: string;
}

export interface SelectedModifier {
  id: string;
  name: string;
  price: number;
  selectedOptions?: ModifierOption[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface OrderEvent {
  id: string;
  orderId: string;
  type: string;
  status: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'bike' | 'car' | 'scooter';
  vehicleNumber: string;
  isOnline: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  activeOrderIds: string[];
  rating: number;
  completedOrders: number;
}

export interface KDSStation {
  id: string;
  name: string;
  type: 'grill' | 'fryer' | 'assembly' | 'packaging';
  orders: Order[];
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  userId?: string;
  orderId?: string;
}