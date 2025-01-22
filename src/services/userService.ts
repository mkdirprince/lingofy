import { redisClient } from "../redis";

interface AddUserProp {
  username: string;
  userLang: string;
  roomId: string;
  secretKey: string;
}

const getUserName = async (userId: string) => {
  const userKey = `user:${userId}`;
  const user = await redisClient.hGetAll(userKey);
  return user.username ? JSON.parse(user.username) : null;
};

const getUserLang = async (userId: string) => {
  const user = await redisClient.hGetAll(userId);

  if (Object.keys(user).length > 0) {
    return JSON.parse(user.userLang);
  }

  return null;
};

const createUser = async ({
  secretKey,
  username,
  userLang,
  roomId,
}: AddUserProp) => {
  const userKey = `user:${secretKey}`;

  await redisClient.hSet(userKey, {
    username,
    userLang,
    rooms: JSON.stringify([roomId]),
  });

  return userKey;
};

const addUserToRoom = async ({
  userId,
  userLang,
  roomId,
  username,
}: {
  userId: string;
  userLang: string;
  roomId: string;
  username: string;
}) => {
  const user = await redisClient.hGetAll(userId);

  if (Object.keys(user).length === 0) {
    return await redisClient.hSet(userId, {
      username: username,
      rooms: roomId,
      userLang: userLang,
    });
  }
  const rooms = JSON.parse(user.rooms);

  if (!rooms.includes(roomId)) {
    rooms.push(roomId);

    return await redisClient.hSet(userId, {
      rooms: JSON.stringify(rooms),
    });
  } else {
    throw new Error(`User ${username} already added to room`);
  }
};

export default {
  addUserToRoom,
  getUserLang,
  getUserName,
  createUser,
};
