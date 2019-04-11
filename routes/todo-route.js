import express from 'express'
import { omit, merge } from 'ramda'
import { find, findById, insertOne, findOneAndDelete, findOneAndUpdate, objectIdFromHexString } from '../db'
import { red } from '../logger'

const router = express.Router()

/*
    - assumes only { title: string } is sent
    - { completed: false } will be added to all new todos
 */

router.post('/', async (req, res) => {
  try {
    const td1 = req.body
    const td2 = {
      title: td1.title,
      completed: false,
    }
    const inserted = await insertOne(
      'todos',
      td2
    )
    res.send(inserted)
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    const todos = await find('todos')
    res.send(todos)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {

  const id = req.params.id
  try {
    const todos = await findById('todos', id)
    res.send(todos)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    let todo = await findOneAndDelete('todos', id)
    if (!todo) {
      return res.status(404).send()
    }
    res.send(todo)
  } catch (e) {
    res.status(400).send()
  }
})

export default router
