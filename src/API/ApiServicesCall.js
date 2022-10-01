import Api from './API'

export default {

    PostCallService: (url,parms) =>
    new Promise(function (resolve, reject) {
        Api().post('/api/' + url,parms).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err);
            });
    }),
    GetCallService: (getUrl) =>
    new Promise(function (resolve, reject) {
        Api().get('/api/' + getUrl).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err);
            });
    }),
}