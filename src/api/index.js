import axios from 'axios';
import qs from 'qs';



// 创建axios实例
const instance = axios.create({
    //baseURL: "http://10.32.68.98:9527",
    timeout: 10000 // 请求超时时间  
});

instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 添加request拦截器 
instance.interceptors.request.use(config => {
    if (config.method  === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, error => {
    return Promise.reject(error);
})

// 添加respone拦截器
instance.interceptors.response.use(res => {
    if (!res.data.success) {
      return Promise.resolve(res);
    }
    return res;
}, error => {
    return Promise.reject(error);
})

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get (url, params = {}) {
    return new Promise((resolve,reject) => {
        axios.get(url,{
            params: params
        }).then(response => {
             resolve(response.data);
        }).catch(err => {
            reject(err.data);
        })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url, data= {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data);
        })
    })

}
