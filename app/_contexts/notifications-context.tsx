"use client";
import { useEffect, useState, useCallback } from "react";
import { createContext, useContext } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import io from "socket.io-client";

interface NotificationProps {
  id: string;
  recipientId: string;
  content: string;
  category: string;
  readAt: Date | null;
  cancelledAt: Date | null;
  date: string;
}

interface NotificationsContextProps {
  notifications: NotificationProps[];
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: NotificationProps) => void;
  removeNotification: (id: string) => void;
}

const NotificationsContext = createContext<
  NotificationsContextProps | undefined
>(undefined);

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:3001/notifications/from/${userId}`,
      );
      const data = res.data.notifications.map((n: any) => ({
        ...n,
        date: new Date(n.date).toLocaleString(),
      }));
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:3001");

    socket.on("new-notification", () => {
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchNotifications, userId]);

  const addNotification = (notification: NotificationProps) => {
    setNotifications((prevNotifications) => [
      notification,
      ...prevNotifications,
    ]);
  };

  const removeNotification = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3001/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        fetchNotifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
};
