import 'babel-polyfill'
import { expect } from 'chai'
import  'mocha'
import { redf } from '../../logger/'
import { todo, todos } from './fixture'
import {
  find,
  findOneAndDelete,
  dropCollection,
  insertMany,
  insertOne,
} from '../../db'

require('dotenv').config()

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const dropAllCollections = () => {
  try {
    dropCollection('todos')
  }
  catch (e) {
    redf('ERROR: before', e)
  }
}

const populateDb = async () => {
  try {
    const insert = await insertMany('todos', todos)
    if (insert.data.length !== 5) {
      throw 'peopulateDb failed'
    }
  }
  catch (e) {
    redf('ERROR: populateDb', e)
  }
}

const getTodos = async () => {
  try {
    const todos = await find('todos', {})
    return todos.data
  }
  catch (e) {
    redf('ERROR: getTods', e)
  }
}

before(() => {
  dropAllCollections()
})

after(() => {
  if (!process.env.WATCH) {
    setTimeoutPromise(1900).then((value) => {
      process.exit(0)
    })
  }
})

describe('dbFunctions', () => {
  before(() => {
    dropAllCollections()
    populateDb()
  })
  it('should add one todo', async () => {
    const insert = await insertOne('todos', todo)
    const data = insert.data
    expect(data[0].title).to.equal(todo.title)
    expect(data[0].completed).to.equal(todo.completed)
  })

  it('should return 6 todos', async () => {
    const todos = await getTodos()
    expect(todos.length).to.equal(6)
  })

  it('should delete one todo', async () => {
    const todos = await getTodos()
    expect(todos.length).to.equal(6)
    await findOneAndDelete('todos', todos[1]._id)
    const todos1 = await getTodos()
    expect(todos1.length).to.equal(5)
  })
})
