export interface Notification {
  idNotification: number;
  user: User;
  message: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
}