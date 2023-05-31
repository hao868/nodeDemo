// const DB = require('../../../models/db')
const sd = require('silly-datetime')
const DB = require('../../../modules/db')
const day = sd.format(new Date(), 'YYYYMMDD')


const addUser = async (req, res) => {
  const result = await DB.insertOne('user', { $inc: { id: 1 }, username: '赵四', age: 60, sex: 1, status: 1})
  console.log(result)
  res.send(result)
}

const modify = async (req, res) => {
  const id = parseInt(req.query.id)
  const data = await DB.update('user', {id}, {username: 'zghao00'})
  res.send(data)
}

const userinfo = async (req, res) => {
  const { limit, page } = req.query 
  const data = await DB.findPage('user', {}, parseInt(limit), parseInt(page))
  res.send(data)
}

const getUserinfoById = async (req, res) => {
  const id = parseInt(req.query.id)
  const data = await DB.findOne('user', {id})
  res.send(data)
}

const upload = (req, res) => {
  const resObj = {
    code: 1,
    msg: 'success',
    data: `localhost:9527/uploads/${day}/${req.file.filename}`
  };
  if(req.method !== 'POST') {
    res.send({
      ...resObj,
      code: 0,
      msg: `method ${req.method} not allowed`,
      data: null
    })
    return
  }
  res.send(resObj)
}

module.exports = {
  userinfo,
  getUserinfoById,
  addUser,
  modify,
  upload
}