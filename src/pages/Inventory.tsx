import React, { useState } from 'react';
import { mockIngredients } from '../data/mockData';
import { Ingredient } from '../types';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Search, Plus, AlertTriangle, Package, TrendingDown, TrendingUp, CreditCard as Edit, BarChart3 } from 'lucide-react';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const filteredIngredients = mockIngredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStockFilter = !showLowStockOnly || ingredient.currentStock <= ingredient.minimumStock;
    
    return matchesSearch && matchesStockFilter;
  });

  const lowStockItems = mockIngredients.filter(ingredient => ingredient.currentStock <= ingredient.minimumStock);
  const outOfStockItems = mockIngredients.filter(ingredient => ingredient.currentStock === 0);
  
  const totalValue = mockIngredients.reduce((sum, ingredient) => 
    sum + (ingredient.currentStock * ingredient.costPerUnit), 0
  );

  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.currentStock === 0) return 'out';
    if (ingredient.currentStock <= ingredient.minimumStock) return 'low';
    if (ingredient.currentStock <= ingredient.minimumStock * 1.5) return 'medium';
    return 'good';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'out':
        return 'error';
      case 'low':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'success';
    }
  };

  const getStockLabel = (status: string) => {
    switch (status) {
      case 'out':
        return 'Out of Stock';
      case 'low':
        return 'Low Stock';
      case 'medium':
        return 'Medium Stock';
      default:
        return 'Good Stock';
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button icon={BarChart3} variant="outline">Reports</Button>
          <Button icon={Plus}>Add Ingredient</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Items
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {mockIngredients.length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Low Stock
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {lowStockItems.length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Out of Stock
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {outOfStockItems.length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Value
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(totalValue)}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <label className="flex items-center space-x-2 px-3 py-2">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Show low stock only</span>
          </label>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <p className="text-sm text-yellow-700">
                {lowStockItems.length} ingredient{lowStockItems.length !== 1 ? 's are' : ' is'} running low. 
                Consider reordering soon.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Ingredients List */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingredient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Minimum Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost per Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIngredients.map(ingredient => {
                const status = getStockStatus(ingredient);
                const totalValue = ingredient.currentStock * ingredient.costPerUnit;
                
                return (
                  <tr key={ingredient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ingredient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Unit: {ingredient.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ingredient.currentStock} {ingredient.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ingredient.minimumStock} {ingredient.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(ingredient.costPerUnit)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(totalValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStockColor(status)}>
                        {getStockLabel(status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="outline" icon={Edit}>
                          Edit
                        </Button>
                        <Button size="sm" variant="primary">
                          Reorder
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ingredients found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or add new ingredients.
            </p>
            <Button icon={Plus}>Add Ingredient</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Inventory;