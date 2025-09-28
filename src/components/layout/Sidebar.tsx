import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart3,
  ChefHat,
  Home,
  ShoppingCart,
  Monitor,
  Menu,
  Package,
  Truck,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['superadmin', 'chain_manager', 'kitchen_manager'] },
  { name: 'Orders', href: '/orders', icon: ShoppingCart, roles: ['superadmin', 'chain_manager', 'kitchen_manager', 'cook'] },
  { name: 'POS', href: '/pos', icon: Monitor, roles: ['superadmin', 'chain_manager', 'kitchen_manager'] },
  { name: 'KDS', href: '/kds', icon: ChefHat, roles: ['superadmin', 'chain_manager', 'kitchen_manager', 'cook'] },
  { name: 'Menu', href: '/menu', icon: Menu, roles: ['superadmin', 'chain_manager', 'kitchen_manager'] },
  { name: 'Inventory', href: '/inventory', icon: Package, roles: ['superadmin', 'chain_manager', 'kitchen_manager'] },
  { name: 'Drivers', href: '/drivers', icon: Truck, roles: ['superadmin', 'chain_manager', 'kitchen_manager'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['superadmin', 'chain_manager', 'accountant'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['superadmin', 'chain_manager'] }
];

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center">
                  <ChefHat className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Indian CK-OMS</span>
                </div>
              </div>
              
              <nav className="mt-8 px-4">
                <div className="space-y-1">
                  {filteredNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150 ${
                          isActive
                            ? 'bg-indigo-50 border-r-4 border-indigo-600 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow-lg">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <ChefHat className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Indian CK-OMS</span>
              </div>
              
              <nav className="mt-8 flex-1 px-4">
                <div className="space-y-1">
                  {filteredNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                          isActive
                            ? 'bg-indigo-50 border-r-4 border-indigo-600 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;