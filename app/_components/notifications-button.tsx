"use client";

import { Bell, BellDot, Check, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
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
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNotifications } from "@/app/_contexts/notifications-context";
import { Badge } from "@/app/_components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

const NotificationsButton = () => {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { notifications, removeNotification, fetchNotifications } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      removeNotification(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = () => {
    try {
      notifications.forEach((notification) => {
        if (notification.readAt === null) {
          removeNotification(notification.id);
        }
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => notification.readAt === null,
  );

  const unreadNotifications = notifications.filter(
    (notification) => notification.readAt === null,
  );

  const readNotifications = notifications.filter(
    (notification) => notification.readAt !== null,
  );

  const getNotificationIcon = (category: string) => {
    if (category.includes("Importação")) return "📂";
    if (category.includes("Pagamento")) return "💰";
    if (category.includes("Alerta")) return "⚠️";
    return "📌";
  };

  const getNotificationColor = (category: string) => {
    if (category.includes("Importação")) return "bg-blue-50 border-blue-200";
    if (category.includes("Pagamento")) return "bg-green-50 border-green-200";
    if (category.includes("Alerta")) return "bg-amber-50 border-amber-200";
    return "bg-purple-50 border-purple-200";
  };

  return (
    <div>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full bg-white shadow-sm hover:bg-gray-50 hover:shadow-md"
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: hasUnreadNotifications ? 5 : 0,
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              {hasUnreadNotifications ? (
                <>
                  <BellDot className="h-5 w-5 text-blue-600" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
                    {unreadNotifications.length}
                  </span>
                </>
              ) : (
                <Bell className="h-5 w-5 text-gray-600" />
              )}
            </motion.div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 shadow-xl" align="end">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold text-gray-800">Notificações</h3>
            {hasUnreadNotifications && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>

          <AnimatePresence>
            {notifications.length > 0 ? (
              <div className="flex flex-col">
                <ScrollArea className="h-72">
                  <div className="p-2">
                    {notifications.slice(0, 5).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`mb-2 overflow-hidden rounded-lg border p-3 ${
                          notification.readAt === null
                            ? getNotificationColor(notification.category)
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="mb-1 text-sm font-semibold text-gray-800">
                              {notification.category}
                            </div>
                            <div className="text-sm text-gray-600">
                              {notification.content}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {notification.date}
                              </span>
                              {notification.readAt === null && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-7 rounded-full px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Marcar como lida
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t bg-gray-50 p-3">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center"
                      >
                        Ver todas as notificações
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader className="pb-2">
                        <DialogTitle className="text-xl font-bold text-gray-800">
                          Centro de Notificações
                        </DialogTitle>
                      </DialogHeader>

                      <Tabs
                        defaultValue="all"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsList className="mb-4 grid w-full grid-cols-3">
                          <TabsTrigger value="all" className="text-sm">
                            Todas
                            <Badge className="ml-2 bg-gray-200 text-gray-800">
                              {notifications.length}
                            </Badge>
                          </TabsTrigger>
                          <TabsTrigger value="unread" className="text-sm">
                            Não lidas
                            <Badge className="ml-2 bg-red-100 text-red-800">
                              {unreadNotifications.length}
                            </Badge>
                          </TabsTrigger>
                          <TabsTrigger value="read" className="text-sm">
                            Lidas
                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                              {readNotifications.length}
                            </Badge>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-0">
                          <ScrollArea className="h-96">
                            <div className="space-y-3 pr-4">
                              {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                  <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`rounded-xl border p-4 ${
                                      notification.readAt === null
                                        ? getNotificationColor(
                                            notification.category,
                                          )
                                        : "border-gray-200 bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="text-2xl">
                                        {getNotificationIcon(
                                          notification.category,
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="mb-1 text-sm font-semibold text-gray-800">
                                          {notification.category}
                                          {notification.readAt === null && (
                                            <Badge className="ml-2 bg-blue-500 text-white">
                                              Nova
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {notification.content}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                          <span className="text-xs text-gray-500">
                                            {notification.date}
                                          </span>
                                          {notification.readAt === null && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                markAsRead(notification.id)
                                              }
                                              className="h-8 rounded-lg text-xs"
                                            >
                                              <CheckCircle2 className="mr-1 h-3 w-3" />
                                              Marcar como lida
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-10">
                                  <Info className="mb-2 h-10 w-10 text-gray-300" />
                                  <p className="text-sm text-gray-500">
                                    Nenhuma notificação encontrada
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="unread" className="mt-0">
                          <ScrollArea className="h-96">
                            <div className="space-y-3 pr-4">
                              {unreadNotifications.length > 0 ? (
                                unreadNotifications.map((notification) => (
                                  <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`rounded-xl border p-4 ${getNotificationColor(notification.category)}`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="text-2xl">
                                        {getNotificationIcon(
                                          notification.category,
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="mb-1 text-sm font-semibold text-gray-800">
                                          {notification.category}
                                          <Badge className="ml-2 bg-blue-500 text-white">
                                            Nova
                                          </Badge>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {notification.content}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                          <span className="text-xs text-gray-500">
                                            {notification.date}
                                          </span>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              markAsRead(notification.id)
                                            }
                                            className="h-8 rounded-lg text-xs"
                                          >
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Marcar como lida
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-10">
                                  <CheckCircle2 className="mb-2 h-10 w-10 text-green-300" />
                                  <p className="text-sm text-gray-500">
                                    Você não tem notificações não lidas
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="read" className="mt-0">
                          <ScrollArea className="h-96">
                            <div className="space-y-3 pr-4">
                              {readNotifications.length > 0 ? (
                                readNotifications.map((notification) => (
                                  <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="text-2xl">
                                        {getNotificationIcon(
                                          notification.category,
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="mb-1 text-sm font-semibold text-gray-800">
                                          {notification.category}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {notification.content}
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                          {notification.date}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-10">
                                  <Info className="mb-2 h-10 w-10 text-gray-300" />
                                  <p className="text-sm text-gray-500">
                                    Nenhuma notificação lida encontrada
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>

                      <DialogFooter className="flex justify-between gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Fechar
                        </Button>
                        {hasUnreadNotifications && (
                          <Button
                            variant="default"
                            onClick={markAllAsRead}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Marcar todas como lidas
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10">
                <Bell className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  Você não tem notificações.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  As notificações aparecerão aqui quando houver novidades
                </p>
              </div>
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationsButton;
