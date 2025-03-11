const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// 静态文件服务
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 处理文件上传
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully', file: req.file.filename });
});

// 处理文件删除
app.post('/delete', (req, res) => {
  const fileName = req.query.filename;
  const filePath = path.join(__dirname, 'uploads', fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete file' });
    } else {
      res.json({ message: 'File deleted successfully' });
    }
  });
});

// 获取文件列表
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to get file list' });
    } else {
      res.json({ files });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
