import { Bell, BellDot, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNotifications } from "../_contexts/notifications-context";

const NotificationsButton = () => {
  const [open, setOpen] = useState(false);

  const { notifications, removeNotification, fetchNotifications } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, notifications]);

  const markAsRead = async (id: string) => {
    try {
      removeNotification(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => notification.readAt === null,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="rounded-md">
          <motion.div
            whileHover={{
              scale: 1.2,
              rotate: 10,
              transition: { type: "spring", stiffness: 300 },
            }}
            whileTap={{ scale: 0.9 }}
          >
            {hasUnreadNotifications ? <BellDot /> : <Bell />}
          </motion.div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={
          notifications.length > 0 ? { width: "400px" } : { width: "auto" }
        }
      >
        <div className="flex flex-col gap-2">
          {notifications.length > 0 ? (
            <>
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {notification.category}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {notification.content}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {notification.date}
                    </div>
                  </div>
                  <div className="ml-4 flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check />
                    </Button>
                  </div>
                </div>
              ))}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-700"
                  >
                    Ver mais
                  </Button>
                </DialogTrigger>
                <DialogContent
                  style={{
                    width: "100%",
                    maxWidth: "800px",
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Todas as notificações</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-center">
                        <div className="flex-1">
                          <div className="mt-2 text-sm font-medium">
                            {notification.category}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {notification.content}
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            {notification.date}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Você não tem notificações.
              </p>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsButton;
