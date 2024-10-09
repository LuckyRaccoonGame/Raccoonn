export interface User {
  name: string;
  level: number;
  points: number;
  pointsPerHour: number;
}

export interface Reward {
  id: number;
  name: string;
  icon: string;
  timeRemaining: number;
}

export interface PurchasableReward {
  id: number;
  name: string;
  description: string;
  cost: number;
  pointsPerHourIncrease: number;
}

export interface NavItem {
  id: number;
  name: string;
  icon: string;
  path: string;
}