// const settings = require('../setting');
// const Db = require('mongodb').Db;
// const Connection = require('mongodb').Connection;
// const Server = require('mongodb').Server;

// module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});

const { MongoClient } = require('mongodb');
const DB_CONFIG = require('./config')

class Db {
  // 单例模式，共享实例  解决多次实例化 实例不共享问题
  static getInstance() {
    if(!Db.instance) {
      Db.instance = new Db(DB_CONFIG.DB_URL, DB_CONFIG.DB_NAME)
    }
    return Db.instance;
  }

  constructor(dbUrl, dbName) {
    this.dbUrl = dbUrl
    this.dbName = dbName
    this.dbClient = '' // 属性 存放db对象
    this.connect() // 实例化的时候就链接数据库
  }

  connect() {
    return new Promise((resolve, reject) => {
      if(this.dbClient) { // 解决数据库多次连接问题
        resolve(this.dbClient)
      } else {
        MongoClient.connect(this.dbUrl, (err, client) => {
          if(err) {
            console.log('-----------数据库链接失败！！！--------------')
            reject(err)
          } else {
            this.dbClient = client.db(this.dbName)
            resolve(this.dbClient)
          }
        })
      }
    })
  }

  /**
   * 分页查询
   * @param {string} collectionName 表名
   * @param {object} query 查询条件
   * @param {number} limit 每页多少条数据
   * @param {number} page 页码
   * @returns Array
   */
  findPage(collectionName, query, limit = 10, page = 1) {
    const reg = page <= 1 ? 0 : page * limit - limit
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = db.collection(collectionName).find(query).limit(limit).skip(reg)
        result.toArray((err, docs) => {
          if(err) {
            reject(err)
            return
          }
          resolve(docs)
        })
      })
    })
  }

  /**
   * 普通查询
   * @param {string} collectionName 表名
   * @param {object} query 查询条件
   * @returns Array
   */
  find(collectionName, query) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = db.collection(collectionName).find(query)
        result.toArray((err, docs) => {
          if(err) {
            reject(err)
            return
          }
          resolve(docs)
        })
      })
    })
  }

  /**
   * 普通查询 只返回一条数据
   * @param {string} collectionName 表名
   * @param {object} query 查询条件
   * @returns Object
   */
  findOne(collectionName, query) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = db.collection(collectionName).findOne(query)
        resolve(result)
      })
    })
  }

  /**
   * 插入数据
   * @param {string} collectionName 表名
   * @param {object | array} newData 数据
   * @returns 
   */
  insert(collectionName, newData) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insert(newData, (err, result) => {
          if(err) {
            reject(err)
            return
          }
          resolve(result)
        })
        
      })
    })
  }


  /**
   * 插入一条数据
   * @param {string} collectionName 表名
   * @param {object} newData 数据
   * @returns 
   */
  insertOne(collectionName, newData) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insertOne(newData, (err, result) => {
          if(err) {
            reject(err)
            return
          }
          resolve(result)
        })
        
      })
    })
  }

  /**
   * 插入多条数据
   * @param {string} collectionName 表名
   * @param {array} newData 数组 数据
   * @param {boolean} ordered 如果数组中的前一个文档插入失败，则阻止插入剩余的文档
   * @returns 
   */
  insertMany(collectionName, newData, ordered = false) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insertMany(newData, { ordered: ordered }, (err, result) => {
          if(err) {
            reject(err)
            return
          }
          resolve(result)
        })
        
      })
    })
  }

  /**
   * 更新数据
   * @param {string} collectionName 表名
   * @param {object} query 查询条件
   * @param {object} newData 更新的数据
   * @param {boolean} upsert (可选）如果查不到update的记录，是否插入
   * @param {boolean} multi (可选）更新所有匹配的数据， 同 updateMany
   * @returns 
   */
  update(collectionName, query, newData, upsert = false, multi = false) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).update(query, 
          { $set: newData }, 
          { upsert: upsert, multi: multi }, 
          (err, result) => {
            if(err) {
              reject(err)
              return
            }
            resolve(result)
          }
        )
      })
    })
  }

  

  /**
   * 删除数据
   * @param {string} collectionName 表名
   * @param {object} query 查询条件  删除所有数据则query={}
   * @param {*} justOne (可选）如果设为 true 或 1，则只删除一个文档。
   * @returns 
   */
  remove(collectionName, query, justOne = false) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).remove(query, { justOne: justOne }, (err, res) => {
          if(err) {
            reject(err)
            return
          }
          resolve(res)
        })
      })
    })
  }

  /**
   * 
   * @param {*} collectionName 
   * @param {*} sequenceName 
   * @returns 
   */
  async getNextSequenceValue (sequenceName) {
    const db = await this.connect();
    const ret = db.counters.findAndModify(
      {
        query: { id: sequenceName },
        update: { $inc: { seq: 1 } },
        new: true,
        upsert: true
      }
    );
    return ret.seq;
  }

}

module.exports = Db.getInstance()