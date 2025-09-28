import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderEvent } from '../types';
import { mockOrders } from '../data/mockData';

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrderEvent: (orderId: string, event: Omit<OrderEvent, 'id' | 'orderId'>) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];
  getOrdersByLocation: (locationId: string) => Order[];
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Simulate real-time order updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new orders and status updates
      setOrders(prevOrders => {
        const updated = [...prevOrders];
        
        // Randomly update some order statuses
        updated.forEach((order, index) => {
          if (Math.random() < 0.1 && order.status === 'received') {
            updated[index] = { ...order, status: 'confirmed' };
          } else if (Math.random() < 0.05 && order.status === 'confirmed') {
            updated[index] = { ...order, status: 'preparing' };
          }
        });

        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status, 
              updatedAt: new Date(),
              events: [
                ...order.events,
                {
                  id: Date.now().toString(),
                  orderId,
                  type: 'status_change',
                  status,
                  timestamp: new Date()
                }
              ]
            }
          : order
      )
    );
  };

  const addOrderEvent = (orderId: string, event: Omit<OrderEvent, 'id' | 'orderId'>) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              events: [
                ...order.events,
                {
                  ...event,
                  id: Date.now().toString(),
                  orderId
                }
              ]
            }
          : order
      )
    );
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByLocation = (locationId: string) => {
    return orders.filter(order => order.locationId === locationId);
  };

  const refreshOrders = () => {
    // In a real app, this would fetch from API
    setOrders([...mockOrders]);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      updateOrderStatus,
      addOrderEvent,
      getOrdersByStatus,
      getOrdersByLocation,
      refreshOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};