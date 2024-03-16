export interface QueryParams {
  currentPage: number;
  pageSize: number;
  status: number;
}
export interface MessageData {
  messageList: MessageInfo[];
  total: number;
}

export interface MessageInfo {
  avatar: string;
  createTime: string;
  id: number;
  message: string;
  status: number;
  userId: number;
  username: string;
}
