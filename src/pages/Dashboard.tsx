import React from 'react';
import { useOrders } from '../contexts/OrderContext';
import { mockBrands, mockLocations, mockDrivers } from '../data/mockData';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { orders } = useOrders();

  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(o => ['received', 'confirmed', 'preparing'].includes(o.status)).length,
    completedOrders: orders.filter(o => ['delivered'].includes(o.status)).length,
    revenue: orders.reduce((sum, order) => sum + order.netAmount, 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
    onlineDrivers: mockDrivers.filter(d => d.isOnline).length
  };

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'info';
      case 'confirmed':
        return 'primary';
      case 'preparing':
        return 'warning';
      case 'ready':
        return 'success';
      case 'dispatched':
        return 'info';
      case 'delivered':
        return 'success';
      default:
        return 'neutral';
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalOrders}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Orders
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.activeOrders}
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
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(stats.revenue)}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Online Drivers
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.onlineDrivers}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Badge variant="info">{recentOrders.length} orders</Badge>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const brand = mockBrands.find(b => b.id === order.brandId);
              const location = mockLocations.find(l => l.id === order.locationId);
              
              return (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{order.orderNumber}</span>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {brand?.name} • {location?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Brand Performance */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Brand Performance</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockBrands.map((brand) => {
              const brandOrders = orders.filter(o => o.brandId === brand.id);
              const brandRevenue = brandOrders.reduce((sum, order) => sum + order.netAmount, 0);
              
              return (
                <div key={brand.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: brand.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {brand.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(brandRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {brandOrders.length} orders
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">New Order</span>
          </button>
          
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Driver</span>
          </button>
          
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">View Alerts</span>
          </button>
          
          <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Reports</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;