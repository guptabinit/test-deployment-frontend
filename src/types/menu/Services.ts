export type Service = {
  _id: string;
  menuId: string;
  serviceName: string;
  serviceDesc: string;
  serviceImage: string;
  isFood: boolean;
  time: string;
  isActive: boolean;
  lastUpdated: Date;
  hotelId: string;
};

export type CreateServiceData = {
  serviceName: string;
  serviceDesc: string;
  serviceImage: string;
  isFood: boolean;
  time: string;
  hotelId: string;
  menuId: string;
};
