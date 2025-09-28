import React, { useState } from 'react';
import { mockMenuItems, mockBrands } from '../data/mockData';
import { MenuItem } from '../types';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Search, Plus, CreditCard as Edit, Eye, EyeOff, Clock, DollarSign, Image, Filter } from 'lucide-react';

const Menu: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState(mockBrands[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredMenuItems = mockMenuItems.filter(item => {
    const matchesBrand = item.brandId === selectedBrand;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesAvailability = !showAvailableOnly || item.isAvailable;
    
    return matchesBrand && matchesSearch && matchesCategory && matchesAvailability;
  });

  const categories = ['All', ...Array.from(new Set(mockMenuItems.map(item => item.category)))];
  const selectedBrandData = mockBrands.find(b => b.id === selectedBrand);

  const toggleAvailability = (itemId: string) => {
    // In a real app, this would make an API call
    console.log(`Toggling availability for item ${itemId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          {selectedBrandData && (
            <div className="flex items-center mt-2">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: selectedBrandData.color }}
              />
              <span className="text-gray-600">{selectedBrandData.name}</span>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button icon={Plus}>Add Item</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {mockBrands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          
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
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <label className="flex items-center space-x-2 px-3 py-2">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Available only</span>
          </label>
        </div>
      </Card>

      {/* Menu Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMenuItems.map(item => (
          <Card key={item.id} padding={false} className="overflow-hidden">
            {/* Item Image */}
            <div className="relative">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Image className="h-12 w-12 text-gray-300" />
                </div>
              )}
              
              {/* Availability Toggle */}
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-sm ${
                  item.isAvailable
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {item.isAvailable ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="p-4">
              {/* Item Header */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <Badge variant={item.isAvailable ? 'success' : 'neutral'}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              
              {/* Item Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <Badge variant="neutral" size="sm">{item.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>Price:</span>
                  </div>
                  <span className="font-semibold text-lg">{formatCurrency(item.price)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Prep Time:</span>
                  </div>
                  <span>{item.preparationTime} minutes</span>
                </div>
              </div>
              
              {/* Modifiers */}
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Modifiers ({item.modifiers.length})
                  </h4>
                  <div className="space-y-1">
                    {item.modifiers.slice(0, 2).map(modifier => (
                      <div key={modifier.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{modifier.name}</span>
                        <span className="text-gray-500">
                          {modifier.isRequired ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                    {item.modifiers.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{item.modifiers.length - 2} more modifiers
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" icon={Edit} className="flex-1">
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={item.isAvailable ? 'outline' : 'primary'}
                  onClick={() => toggleAvailability(item.id)}
                  className="flex-1"
                >
                  {item.isAvailable ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMenuItems.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or add new menu items.
            </p>
            <Button icon={Plus}>Add Menu Item</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Menu;