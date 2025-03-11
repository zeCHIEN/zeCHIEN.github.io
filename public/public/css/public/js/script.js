// 上传文件
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const resourceList = document.getElementById('resource-list');

uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('/upload', formData);
      console.log(response.data);
      fetchFiles();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
});

// 获取文件列表
const fetchFiles = async () => {
  try {
    const response = await axios.get('/files');
    const files = response.data.files;
    resourceList.innerHTML = '';
    files.forEach(file => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `/uploads/${file}`;
      a.textContent = file;
      a.download = file;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        try {
          await axios.post('/delete', null, {
            params: {
              filename: file
            }
          });
          fetchFiles();
        } catch (error) {
          console.error('Delete failed:', error);
        }
      });
      li.appendChild(a);
      li.appendChild(deleteButton);
      resourceList.appendChild(li);
    });
  } catch (error) {
    console.error('Fetch files failed:', error);
  }
};

// 页面加载时获取文件列表
fetchFiles();
