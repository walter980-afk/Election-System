"use client"

import { useState, useEffect } from "react"

export interface NotificationData {
  id: string
  title: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
  timestamp: Date
}

class NotificationManager {
  private listeners: ((notifications: NotificationData[]) => void)[] = []
  private notifications: NotificationData[] = []

  subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  add(notification: Omit<NotificationData, "id" | "timestamp">) {
    const newNotification: NotificationData = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }

    this.notifications.unshift(newNotification)
    this.notify()

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        this.remove(newNotification.id)
      }, notification.duration || 5000)
    }

    return newNotification.id
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notify()
  }

  clear() {
    this.notifications = []
    this.notify()
  }

  success(title: string, message: string, duration?: number) {
    return this.add({ title, message, type: "success", duration })
  }

  error(title: string, message: string, duration?: number) {
    return this.add({ title, message, type: "error", duration })
  }

  warning(title: string, message: string, duration?: number) {
    return this.add({ title, message, type: "warning", duration })
  }

  info(title: string, message: string, duration?: number) {
    return this.add({ title, message, type: "info", duration })
  }
}

export const notifications = new NotificationManager()

export function useNotifications() {
  const [notificationList, setNotificationList] = useState<NotificationData[]>([])

  useEffect(() => {
    return notifications.subscribe(setNotificationList)
  }, [])

  return {
    notifications: notificationList,
    add: notifications.add.bind(notifications),
    remove: notifications.remove.bind(notifications),
    clear: notifications.clear.bind(notifications),
    success: notifications.success.bind(notifications),
    error: notifications.error.bind(notifications),
    warning: notifications.warning.bind(notifications),
    info: notifications.info.bind(notifications),
  }
}