import React, { useState } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { mockBrands, mockLocations } from '../data/mockData';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  BarChart3,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { orders } = useOrders();
  const [dateRange, setDateRange] = useState('today');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Filter orders based on date range
  const filterOrdersByDate = (orders: any[], range: string) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return orders.filter(order => order.createdAt >= startOfDay);
      case 'week':
        const weekAgo = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orders.filter(order => order.createdAt >= weekAgo);
      case 'month':
        const monthAgo = new Date(startOfDay.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orders.filter(order => order.createdAt >= monthAgo);
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrdersByDate(orders, dateRange).filter(order =>
    selectedBrand === 'all' || order.brandId === selectedBrand
  );

  // Calculate metrics
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalNetRevenue = filteredOrders.reduce((sum, order) => sum + order.netAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completedOrders = filteredOrders.filter(o => o.status === 'delivered').length;
  const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Channel breakdown
  const channelStats = {
    aggregator: filteredOrders.filter(o => o.channel === 'aggregator'),
    direct: filteredOrders.filter(o => o.channel === 'direct'),
    pos: filteredOrders.filter(o => o.channel === 'pos')
  };

  // Brand performance
  const brandStats = mockBrands.map(brand => {
    const brandOrders = filteredOrders.filter(o => o.brandId === brand.id);
    const revenue = brandOrders.reduce((sum, order) => sum + order.netAmount, 0);
    const commission = brandOrders.reduce((sum, order) => sum + order.aggregatorCommission, 0);
    
    return {
      brand,
      orders: brandOrders.length,
      revenue,
      commission,
      avgOrderValue: brandOrders.length > 0 ? revenue / brandOrders.length : 0
    };
  });

  // Top menu items
  const itemStats = new Map();
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const key = item.name;
      if (!itemStats.has(key)) {
        itemStats.set(key, { name: item.name, quantity: 0, revenue: 0 });
      }
      const stat = itemStats.get(key);
      stat.quantity += item.quantity;
      stat.revenue += item.price * item.quantity;
    });
  });

  const topItems = Array.from(itemStats.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Time-based analysis
  const hourlyStats = new Array(24).fill(0).map((_, hour) => {
    const hourOrders = filteredOrders.filter(order => {
      const orderHour = order.createdAt.getHours();
      return orderHour === hour;
    });
    return {
      hour,
      orders: hourlyStats.length,
      revenue: hourOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
  });

  const peakHour = hourlyStats.reduce((peak, current) => 
    current.orders > peak.orders ? current : peak, hourlyStats[0]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportReport = () => {
    // In a real app, this would generate and download a report
    alert('Report exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button icon={Download} variant="outline" onClick={exportReport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Brands</option>
              {mockBrands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {totalOrders}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Revenue
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(totalRevenue)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Order Value
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(averageOrderValue)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Conversion Rate
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatPercentage(conversionRate)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Channel Performance */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Channel Performance</h3>
          <div className="space-y-4">
            {Object.entries(channelStats).map(([channel, orders]) => {
              const revenue = orders.reduce((sum: number, order: any) => sum + order.netAmount, 0);
              const commission = orders.reduce((sum: number, order: any) => sum + order.aggregatorCommission, 0);
              
              return (
                <div key={channel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <div>
                      <div className="font-medium capitalize">{channel}</div>
                      <div className="text-sm text-gray-500">{orders.length} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(revenue)}</div>
                    {commission > 0 && (
                      <div className="text-sm text-red-600">-{formatCurrency(commission)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Brand Performance */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Performance</h3>
          <div className="space-y-4">
            {brandStats.map(({ brand, orders, revenue, commission }) => (
              <div key={brand.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: brand.color }}
                  ></div>
                  <div>
                    <div className="font-medium">{brand.name}</div>
                    <div className="text-sm text-gray-500">{orders} orders</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(revenue)}</div>
                  {commission > 0 && (
                    <div className="text-sm text-red-600">-{formatCurrency(commission)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Menu Items */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Menu Items</h3>
          <div className="space-y-3">
            {topItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.quantity} sold</div>
                  </div>
                </div>
                <div className="font-medium text-gray-900">
                  {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Financial Summary */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Revenue:</span>
              <span className="font-medium">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Commission Fees:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(filteredOrders.reduce((sum, o) => sum + o.aggregatorCommission, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes:</span>
              <span className="font-medium">
                {formatCurrency(filteredOrders.reduce((sum, o) => sum + o.taxes, 0))}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-medium text-gray-900">Net Revenue:</span>
              <span className="font-bold text-green-600">{formatCurrency(totalNetRevenue)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{peakHour.hour}:00</div>
            <div className="text-sm text-blue-800">Peak Hour</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(conversionRate)}
            </div>
            <div className="text-sm text-green-800">Success Rate</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredOrders.map(o => o.customer.id)).size}
            </div>
            <div className="text-sm text-purple-800">Unique Customers</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;