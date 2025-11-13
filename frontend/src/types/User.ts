export default interface UserInfo {
  token: string;
  user: {
    id?: string;
    userId?: string;
    name: string;
    email: string;
  };
}