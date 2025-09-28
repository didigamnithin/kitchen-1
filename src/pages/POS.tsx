import React, { useState } from 'react';
import { mockMenuItems, mockBrands } from '../data/mockData';
import { MenuItem, OrderItem } from '../types';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Trash2,
  User,
  Phone,
  Calculator
} from 'lucide-react';

const POS: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState(mockBrands[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);

  const filteredMenuItems = mockMenuItems.filter(item => {
    const matchesBrand = item.brandId === selectedBrand;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesBrand && matchesSearch && matchesCategory && item.isAvailable;
  });

  const categories = ['All', ...Array.from(new Set(mockMenuItems.map(item => item.category)))];

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuItemId === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price,
        modifiers: []
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer({ name: '', phone: '', email: '' });
    setDiscount(0);
    setTip(0);
    setShowCustomerForm(false);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxRate = 0.18; // 18% GST (Indian tax rate)
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const totalAmount = subtotal - discountAmount + taxAmount + tip;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // In a real app, this would process the payment and create the order
    alert(`Order placed successfully!\nTotal: ₹${totalAmount.toFixed(2)}`);
    clearCart();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Menu Section */}
      <div className="flex-1">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {mockBrands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Search & Filters */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map(item => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <div onClick={() => addToCart(item)}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <Badge variant="success">{formatCurrency(item.price)}</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Prep: {item.preparationTime}min
                      </div>
                      <Button size="sm" icon={Plus}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cart.length})
            </h2>
            {cart.length > 0 && (
              <Button size="sm" variant="outline" icon={Trash2} onClick={clearCart}>
                Clear
              </Button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Cart is empty</p>
              <p className="text-sm">Add items from the menu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowCustomerForm(!showCustomerForm)}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  {customer.name ? `Customer: ${customer.name}` : 'Add Customer Info'}
                </button>
                
                {showCustomerForm && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Customer name"
                      value={customer.name}
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={customer.phone}
                      onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={customer.email}
                      onChange={(e) => setCustomer({...customer, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Discounts & Tips */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Tip:</span>
                  <div className="flex space-x-2">
                    {[10, 15, 20].map(percent => (
                      <button
                        key={percent}
                        onClick={() => setTip(subtotal * (percent / 100))}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>
                
                <input
                  type="number"
                  step="0.01"
                  placeholder="Custom tip amount"
                  value={tip || ''}
                  onChange={(e) => setTip(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>GST (18%):</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tip:</span>
                    <span>{formatCurrency(tip)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full"
                icon={CreditCard}
                disabled={cart.length === 0}
              >
                Process Payment
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default POS;