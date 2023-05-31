const path = require('path')
const multer = require('multer')
const sd = require('silly-datetime')
const mkdirp = require('mkdirp')

const tools = {
  multer() {
    const storage = multer.diskStorage({
      // 指定上传后保存到哪一个文件夹中
      destination: async (req, file, cb) => {
        // 获取当前日期 20220620
        const day = sd.format(new Date(), 'YYYYMMDD')
        // uploads/20220620
        const dir = path.join('uploads', day)
        // 按照日期生成目录 mkdirp 是异步方法，返回Promise对象
        await mkdirp(dir)
        // 上传之前目录必须存在
        cb(null, dir)
      },
      filename: (req, file, cb) => {
        const extname = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + extname)
      }
    })
    // const upload = multer({ storage })

    return multer({ storage })
  }
}

module.exports = tools