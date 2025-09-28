import React, { useState, useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { useNotifications } from '../contexts/NotificationContext';
import { mockBrands, mockLocations } from '../data/mockData';
import { Order } from '../types';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  User,
  ChefHat
} from 'lucide-react';

const KDS: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { addNotification } = useNotifications();
  const [selectedStation, setSelectedStation] = useState('all');
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stations = [
    { id: 'all', name: 'All Orders', icon: ChefHat },
    { id: 'grill', name: 'Grill', icon: ChefHat },
    { id: 'fryer', name: 'Fryer', icon: ChefHat },
    { id: 'assembly', name: 'Assembly', icon: ChefHat },
    { id: 'packaging', name: 'Packaging', icon: ChefHat }
  ];

  // Get active orders for KDS
  const activeOrders = orders.filter(order => 
    ['confirmed', 'preparing'].includes(order.status)
  );

  const filteredOrders = selectedStation === 'all' 
    ? activeOrders 
    : activeOrders.filter(order => {
        // In a real app, orders would be assigned to specific stations
        return true;
      });

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        activeOrders.forEach(order => {
          if (order.status === 'preparing') {
            const elapsed = Math.floor((Date.now() - order.updatedAt.getTime()) / 1000);
            newTimers[order.id] = elapsed;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrders]);

  // Check for overdue orders
  useEffect(() => {
    activeOrders.forEach(order => {
      if (order.status === 'preparing') {
        const elapsed = Math.floor((Date.now() - order.updatedAt.getTime()) / 60000); // minutes
        const estimatedTime = order.estimatedPreparationTime || 15;
        
        if (elapsed > estimatedTime && elapsed % 5 === 0) { // Alert every 5 minutes after overdue
          addNotification({
            title: 'Order Overdue',
            message: `Order ${order.orderNumber} is ${elapsed - estimatedTime} minutes overdue`,
            type: 'warning',
            orderId: order.id
          });
        }
      }
    });
  }, [timers, activeOrders, addNotification]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    
    if (newStatus === 'preparing') {
      addNotification({
        title: 'Order Started',
        message: `Preparation started for order ${orders.find(o => o.id === orderId)?.orderNumber}`,
        type: 'info'
      });
    } else if (newStatus === 'ready') {
      addNotification({
        title: 'Order Ready',
        message: `Order ${orders.find(o => o.id === orderId)?.orderNumber} is ready for pickup/delivery`,
        type: 'success'
      });
    }
  };

  const getOrderPriority = (order: Order) => {
    const elapsed = Math.floor((Date.now() - order.createdAt.getTime()) / 60000);
    const estimatedTime = order.estimatedPreparationTime || 15;
    
    if (elapsed > estimatedTime + 5) return 'critical';
    if (elapsed > estimatedTime) return 'warning';
    if (elapsed > estimatedTime - 5) return 'caution';
    return 'normal';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'caution':
        return 'bg-orange-100 border-orange-500 text-orange-900';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-100 p-6 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kitchen Display System</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button onClick={toggleFullscreen} variant="outline">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
          <div className="text-sm text-gray-500">
            Active Orders: {activeOrders.length}
          </div>
        </div>
      </div>

      {/* Station Filters */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {stations.map(station => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStation === station.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <station.icon className="h-4 w-4 mr-2" />
              {station.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders</h3>
            <p className="text-gray-500">
              Orders will appear here when they're ready to be prepared.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map(order => {
            const brand = mockBrands.find(b => b.id === order.brandId);
            const location = mockLocations.find(l => l.id === order.locationId);
            const priority = getOrderPriority(order);
            const elapsedSeconds = timers[order.id] || 0;
            const estimatedTime = order.estimatedPreparationTime || 15;
            const estimatedSeconds = estimatedTime * 60;
            
            return (
              <div
                key={order.id}
                className={`border-l-4 rounded-lg shadow-sm transition-all duration-300 ${getPriorityColor(priority)} ${
                  priority === 'critical' ? 'animate-pulse' : ''
                }`}
              >
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                      {order.channel === 'aggregator' && order.aggregatorName && (
                        <Badge variant="info" size="sm">{order.aggregatorName}</Badge>
                      )}
                    </div>
                    <Badge variant={order.status === 'confirmed' ? 'primary' : 'warning'}>
                      {order.status}
                    </Badge>
                  </div>

                  {/* Timer */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm font-medium">
                        <Clock className="h-4 w-4 mr-1" />
                        {order.status === 'preparing' ? formatTime(elapsedSeconds) : 'Not started'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Est: {estimatedTime}min
                      </div>
                    </div>
                    
                    {order.status === 'preparing' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            elapsedSeconds > estimatedSeconds
                              ? 'bg-red-500'
                              : elapsedSeconds > estimatedSeconds * 0.8
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min((elapsedSeconds / estimatedSeconds) * 100, 100)}%`
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      {brand?.name} • {location?.name}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="h-3 w-3 mr-1" />
                      {order.customer.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Ordered: {order.createdAt.toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Items:</h4>
                    <div className="space-y-1">
                      {order.items.map(item => (
                        <div key={item.id} className="text-sm">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                          {item.specialInstructions && (
                            <div className="text-xs text-red-600 mt-1 italic">
                              Note: {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <div className="flex items-center font-medium text-yellow-800 mb-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Special Instructions:
                      </div>
                      <div className="text-yellow-700">{order.specialInstructions}</div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {order.status === 'confirmed' && (
                      <Button
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="w-full"
                        icon={Play}
                      >
                        Start Cooking
                      </Button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleStatusChange(order.id, 'ready')}
                          className="w-full"
                          variant="success"
                          icon={CheckCircle}
                        >
                          Mark Ready
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          variant="outline"
                          size="sm"
                          icon={RotateCcw}
                          className="w-full"
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KDS;