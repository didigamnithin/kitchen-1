import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBrands, mockLocations } from '../data/mockData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, MapPin, Wifi, Printer, Smartphone, Globe, Save, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    orderReceived: true,
    orderReady: true,
    lowInventory: true,
    driverAssigned: false,
    dailyReports: true
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'locations', name: 'Locations', icon: MapPin },
    { id: 'integrations', name: 'Integrations', icon: Wifi }
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <Badge variant="info">{user?.role.replace('_', ' ')}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Cloud Kitchen OMS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>UTC-05:00 (Eastern Time)</option>
                    <option>UTC-06:00 (Central Time)</option>
                    <option>UTC-07:00 (Mountain Time)</option>
                    <option>UTC-08:00 (Pacific Time)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>USD - US Dollar</option>
                    <option>CAD - Canadian Dollar</option>
                    <option>EUR - Euro</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="autoAcceptOrders"
                    defaultChecked
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="autoAcceptOrders" className="text-sm font-medium text-gray-700">
                    Auto-accept orders
                  </label>
                </div>
                
                <Button icon={Save}>Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-indigo-600" />
                    </div>
                  )}
                  <Button size="sm" variant="outline">Change Photo</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role.replace('_', ' ')}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                
                <Button icon={Save}>Update Profile</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Order Notifications</h3>
                  <div className="space-y-3">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-500">
                            Receive notifications for this event
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNotificationChange(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Delivery Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        defaultChecked
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                        Email notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="smsNotifications"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">
                        SMS notifications
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button icon={Save}>Save Preferences</Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Enable 2FA</div>
                      <div className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Setup</Button>
                  </div>
                </div>
                
                <Button>Update Security Settings</Button>
              </div>
            </Card>
          )}

          {activeTab === 'locations' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
                <Button icon={Plus} size="sm">Add Location</Button>
              </div>
              
              <div className="space-y-4">
                {mockLocations.map(location => {
                  const brand = mockBrands.find(b => b.id === location.brandId);
                  return (
                    <div key={location.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: brand?.color }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.address}</div>
                          <div className="text-xs text-gray-400">{brand?.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={location.isActive ? 'success' : 'neutral'}>
                          {location.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button size="sm" variant="outline" icon={Edit}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" icon={Trash2}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Integrations</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Order Channels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Swiggy', icon: '🍽️', status: 'connected' },
                      { name: 'Zomato', icon: '🛵', status: 'connected' },
                      { name: 'DoorDash', icon: '🚪', status: 'disconnected' },
                      { name: 'UberEats', icon: '🚗', status: 'disconnected' }
                    ].map(integration => (
                      <div key={integration.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{integration.name}</div>
                            <Badge variant={integration.status === 'connected' ? 'success' : 'neutral'} size="sm">
                              {integration.status}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant={integration.status === 'connected' ? 'outline' : 'primary'}>
                          {integration.status === 'connected' ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Payment Gateways</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Stripe', icon: <CreditCard className="h-6 w-6" />, status: 'connected' },
                      { name: 'PayPal', icon: <Globe className="h-6 w-6" />, status: 'disconnected' }
                    ].map(integration => (
                      <div key={integration.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-600">{integration.icon}</div>
                          <div>
                            <div className="font-medium text-gray-900">{integration.name}</div>
                            <Badge variant={integration.status === 'connected' ? 'success' : 'neutral'} size="sm">
                              {integration.status}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant={integration.status === 'connected' ? 'outline' : 'primary'}>
                          {integration.status === 'connected' ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Hardware</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Kitchen Printer', icon: <Printer className="h-5 w-5" />, status: 'Online' },
                      { name: 'Receipt Printer', icon: <Printer className="h-5 w-5" />, status: 'Offline' },
                      { name: 'KDS Tablet', icon: <Smartphone className="h-5 w-5" />, status: 'Online' }
                    ].map(device => (
                      <div key={device.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-600">{device.icon}</div>
                          <span className="font-medium text-gray-900">{device.name}</span>
                        </div>
                        <Badge variant={device.status === 'Online' ? 'success' : 'error'} size="sm">
                          {device.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;