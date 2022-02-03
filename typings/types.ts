export type Snowflake = string;

export interface ReviewInfo {
  _id: string;
  userID: string;
  botID: string;
  content: string;
  likes: number;
  dislikes: number;
  reports: number;
  replies: number;
  rate: number;
  date: number;
}
