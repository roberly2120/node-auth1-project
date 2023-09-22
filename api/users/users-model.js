const db = require('../../data/db-config')

function find() {
  return db('users')
}

function findBy(filter) {
  return db('users').where(filter)
}

function findById(user_id) {
  return db('users').where('user_id', user_id).first();
}

async function add(user) {
  const [newUserId] = await db('users').insert(user)

  return findById(newUserId);
}

module.exports = {
  find,
  findBy,
  findById,
  add
}