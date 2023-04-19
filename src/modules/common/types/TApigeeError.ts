export type TApigeeError = {
  timestamp: Date;
  status: number;
  title: string;
  type: string;
  detail: string;
  instance: string;
  fault: string;
};
