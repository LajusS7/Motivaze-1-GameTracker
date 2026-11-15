// TEMPORARY 

const users = [];
let nextId = 1;

async function findByUsername(username) {
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
}

async function createUser({ username, passwordHash }) {
  const user = { id: String(nextId++), username, passwordHash };
  users.push(user);
  return user;
}

module.exports = { findByUsername, createUser };
