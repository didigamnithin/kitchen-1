import React, { useState } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { mockBrands, mockLocations } from '../data/mockData';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Filter, Search, RefreshCw, Eye, CreditCard as Edit, Truck, Clock, MapPin, User, Phone } from 'lucide-react';

const Orders: React.FC = () => {
  const { orders, updateOrderStatus, refreshOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || order.channel === channelFilter;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

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
      case 'cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      'received': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'ready',
      'ready': 'dispatched',
      'dispatched': 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status as any);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={refreshOrders} icon={RefreshCw} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="received">Received</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Channels</option>
            <option value="aggregator">Swiggy/Zomato</option>
            <option value="direct">Direct</option>
            <option value="pos">POS</option>
          </select>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or refresh the page.
              </p>
            </div>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const brand = mockBrands.find(b => b.id === order.brandId);
            const location = mockLocations.find(l => l.id === order.locationId);
            const nextStatus = getNextStatus(order.status);
            
            return (
              <Card key={order.id} padding={false}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Order Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge variant="neutral">{order.channel}</Badge>
                        {order.aggregatorName && (
                          <Badge variant="info">{order.aggregatorName}</Badge>
                        )}
                      </div>
                      
                      {/* Order Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {brand?.name} • {location?.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {order.customer.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {order.customer.phone}
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Items ({order.items.length})
                        </h4>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm font-medium">
                          <span>Total</span>
                          <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                      </div>
                      
                      {/* Timing */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Ordered {getTimeSince(order.createdAt)}</span>
                        {order.estimatedPreparationTime && (
                          <span className="ml-4">
                            • Est. prep: {order.estimatedPreparationTime}min
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Eye}
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      >
                        {selectedOrder === order.id ? 'Hide' : 'View'}
                      </Button>
                      
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, nextStatus)}
                        >
                          Mark {nextStatus}
                        </Button>
                      )}
                      
                      {order.status === 'ready' && !order.driverId && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Truck}
                        >
                          Assign Driver
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Customer Details</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Name: {order.customer.name}</div>
                            <div>Phone: {order.customer.phone}</div>
                            {order.customer.email && (
                              <div>Email: {order.customer.email}</div>
                            )}
                            {order.customer.address && (
                              <div>
                                Address: {order.customer.address.street}, {order.customer.address.city}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Financial Breakdown</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>{formatCurrency(order.totalAmount - order.taxes)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxes:</span>
                              <span>{formatCurrency(order.taxes)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Delivery Fee:</span>
                              <span>{formatCurrency(order.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Commission:</span>
                              <span>-{formatCurrency(order.aggregatorCommission)}</span>
                            </div>
                            <div className="flex justify-between font-medium pt-1 border-t">
                              <span>Net Amount:</span>
                              <span>{formatCurrency(order.netAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {order.specialInstructions && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Special Instructions</h5>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                            {order.specialInstructions}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;