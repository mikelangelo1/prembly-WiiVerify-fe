import axios from "../plugins/axios";

class UploadFilesService {
  static async getPresignedUrl(config) {
    const uploadConfig = await axios
      .get("v1/merchant/document/", config)
      .then((res) => {
        return {
          url: res.data.url,
          key: res.data.key,
        };
      });
    return uploadConfig;
  }

  static async uploadFile(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    let url = uploadConfig.url;

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress,
    });
  }

  // upload(file, onUploadProgress) {
  //   let formData = new FormData();

  //   formData.append("file", file);

  //   return axios.post("/upload", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data"
  //     },
  //     onUploadProgress
  //   });
  // }
}

export default new UploadFilesService();
