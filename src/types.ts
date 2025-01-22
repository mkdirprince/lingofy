export interface User {
  username: string;
  userLang: string;
  roomId: string;
}

interface Message {
  id: string;
  userId: string;
  message: string;
  messageLang: string;
}
