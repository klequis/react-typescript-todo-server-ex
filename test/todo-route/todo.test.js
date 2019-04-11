import request from 'supertest'
import { expect } from 'chai'
import app from '../../server'
import 'mocha'

import {
  dropCollection,
  insertMany,
  find
} from '../../db/dbFunctions'
import { todo, todos } from './fixture'


describe('Read /api/todos', async() => {
  before(async () => {
    await dropCollection('todos')
    await insertMany('todos', todos)
  })
  it('read all todos', async () => {
    const ret = await request(app).get('/api/todos')
  })
})

describe('Create /api/todo', async() => {
  before(async () => {
    await dropCollection('todos')
  })
  it('create 1 todo', async () => {
    const res = await request(app)
      .post('/api/todo')
      .send(todo)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
    const insertedTodos = res.body.data
    expect(insertedTodos.length).to.equal(1)
    expect(insertedTodos[0].title).to.equal('Todo test - 01')
  })
})

describe('Delete /api/todos', async() => {
  let insertedTodos = undefined
  before(async () => {
    await dropCollection('todos')
    const ret = await insertMany('todos', todos)
    insertedTodos = ret.data
  })
  it('delete one todo', async () => {
    const id = insertedTodos[1]._id
    const res = await request(app)
      .delete(`/api/todo/${id}`)
    expect(res.status).to.equal(200)
    const todos = await find('todos', {})
    expect(todos.data.length).to.equal(4)
  })
})