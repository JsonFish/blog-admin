export interface DynamicData {
  avatar: string;
  dynamicList: DynamicInfo[];
  username: string;
  total: number;
}

export interface DynamicInfo {
  content: string;
  create_time?: string;
  id?: number;
  images: Image[];
  status?: number;
  upvote?: number;
}

export interface Image {
  status: string;
  uid: number;
  url: string;
}
