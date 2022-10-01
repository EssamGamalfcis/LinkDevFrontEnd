import axios from 'axios'

export default () => {
  const instance = axios.create({
    baseURL: "https://localhost:44394/",
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + window.localStorage.getItem('token')
    }
  });
  instance.interceptors.response.use(
    response => response,
    error => {
      console.log(error.response)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.href = '/login';
        //    this.$router.push("/login");
      }
      return Promise.reject(error.response);
    },
  );
  return instance
}