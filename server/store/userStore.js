const { getDatabase } = require("../config/db");

async function findByUsername(username) {
  const db = getDatabase();

  const user = await db.collection("users").findOne({
    usernameLower: username.toLowerCase()
  });
  
  if (!user) {
    return null;
  }
  return {
    id: user._id.toString(),
    username: user.username,
    passwordHash: user.passwordHash
  };
}

async function createUser({ username, passwordHash }) {
  const db = getDatabase();

  const user = {
    username,
    usernameLower: username.toLowerCase(),
    passwordHash,
    createdAt: new Date()
  };

  const result = await db.collection("users").insertOne(user);

  return {
    id: result.insertedId.toString(),
    username: user.username,
    passwordHash: user.passwordHash
  };
}

module.exports = {
  findByUsername,
  createUser
};