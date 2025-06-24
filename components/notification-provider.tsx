"use client"

import { useNotifications } from "@/lib/notifications"
import { Notification } from "@/components/ui/notification"
import { AnimatePresence, motion } from "framer-motion"

export function NotificationProvider() {
  const { notifications, remove } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
            className="w-full"
          >
            <Notification
              variant={notification.type === "error" ? "destructive" : notification.type}
              title={notification.title}
              description={notification.message}
              onClose={() => remove(notification.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}