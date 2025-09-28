import React, { useState } from 'react';
import { mockDrivers } from '../data/mockData';
import { Driver } from '../types';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Search,
  Plus,
  MapPin,
  Star,
  Truck,
  Phone,
  Mail,
  Navigation,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';

const Drivers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const filteredDrivers = mockDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'online' && driver.isOnline) ||
                         (statusFilter === 'offline' && !driver.isOnline);
    
    return matchesSearch && matchesStatus;
  });

  const onlineDrivers = mockDrivers.filter(d => d.isOnline);
  const busyDrivers = mockDrivers.filter(d => d.activeOrderIds.length > 0);
  const avgRating = mockDrivers.reduce((sum, driver) => sum + driver.rating, 0) / mockDrivers.length;

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'bike':
        return '🏍️';
      case 'car':
        return '🚗';
      case 'scooter':
        return '🛵';
      default:
        return '🚚';
    }
  };

  const toggleDriverStatus = (driverId: string) => {
    // In a real app, this would make an API call
    console.log(`Toggling status for driver ${driverId}`);
  };

  const assignOrder = (driverId: string) => {
    // In a real app, this would assign an order to the driver
    console.log(`Assigning order to driver ${driverId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button icon={Plus}>Add Driver</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Drivers
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {mockDrivers.length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Navigation className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Online Now
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {onlineDrivers.length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Truck className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Deliveries
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {busyDrivers.length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Rating
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {avgRating.toFixed(1)}
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
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </Card>

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(driver => (
          <Card key={driver.id} className="relative">
            {/* Online Status Indicator */}
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
              driver.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />

            <div className="space-y-4">
              {/* Driver Header */}
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={driver.isOnline ? 'success' : 'neutral'}>
                      {driver.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                    {driver.activeOrderIds.length > 0 && (
                      <Badge variant="warning">
                        {driver.activeOrderIds.length} active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Driver Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {driver.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {driver.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">{getVehicleIcon(driver.vehicleType)}</span>
                  {driver.vehicleType.charAt(0).toUpperCase() + driver.vehicleType.slice(1)} - {driver.vehicleNumber}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-lg font-semibold">{driver.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{driver.completedOrders}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
              </div>

              {/* Current Location */}
              {driver.currentLocation && driver.isOnline && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    Last seen: {driver.currentLocation.lat.toFixed(4)}, {driver.currentLocation.lng.toFixed(4)}
                  </span>
                </div>
              )}

              {/* Active Orders */}
              {driver.activeOrderIds.length > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-sm font-medium text-yellow-800 mb-1">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Active Deliveries
                  </div>
                  <div className="text-sm text-yellow-700">
                    {driver.activeOrderIds.length} order{driver.activeOrderIds.length !== 1 ? 's' : ''} in progress
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={driver.isOnline ? 'outline' : 'primary'}
                  onClick={() => toggleDriverStatus(driver.id)}
                  className="flex-1"
                >
                  {driver.isOnline ? 'Set Offline' : 'Set Online'}
                </Button>
                
                {driver.isOnline && driver.activeOrderIds.length === 0 && (
                  <Button
                    size="sm"
                    onClick={() => assignOrder(driver.id)}
                    className="flex-1"
                  >
                    Assign Order
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or add new drivers.
            </p>
            <Button icon={Plus}>Add Driver</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Drivers;