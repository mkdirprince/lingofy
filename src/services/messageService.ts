import { redisClient } from "../redis";
import { v7 as uuid7 } from "uuid";

const getAllMessages = async (roomId: string) => {
  const roomMessageKey = `room:message:${roomId}`;

  const allMessagesId = await redisClient.lRange(roomMessageKey, 0, -1);

  const allMessages = await Promise.all(
    allMessagesId.map(async (messageId) => {
      const messageData = await redisClient.hGetAll(messageId);

      return Object.keys(messageData).length > 0 ? messageData : null;
    })
  );

  return allMessages.filter((message) => message !== null);
};

const addMessage = async ({
  userId,
  translatedMessage,
  messageLang,
  roomId,
}: {
  userId: string;
  translatedMessage: string;
  messageLang: string;
  roomId: string;
}) => {
  const messageId = `message:${uuid7()}`;

  const messageData = {
    userId,
    translatedMessage,
    messageLang,
    timeStamp: Date.now(),
  };

  await redisClient.hSet(messageId, messageData);
  await redisClient.expire(messageId, 24 * 60 * 60);

  const roomMessageKey = `room:message:${roomId}`;

  await redisClient.rPush(roomMessageKey, messageId);
  await redisClient.expire(messageId, 24 * 60 * 60);

  return messageData;
};

export default {
  addMessage,
  getAllMessages,
};
