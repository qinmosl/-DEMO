//封装jsonp
const jsonp = (url, data) => {
    if (!url)
        throw new Error('url is necessary')

    const headEle = document.getElementsByTagName('head')[0]

    // const callback = 'CALLBACK' + Math.random().toString().substr(9,18)
    const callback = 'search'
    const JSONP = document.createElement('script')
    JSONP.setAttribute('type', 'text/javascript')
    // let ret = '';
    // if(data){
    //     if(typeof data === 'string')
    //         ret = '&' + data;
    //     else if(typeof data === 'object') {
    //         for(let key in data)
    //             ret += '&' + key + '=' + encodeURIComponent(data[key]);
    //     }
    //     ret += '&_time=' + Date.now();
    // }
    JSONP.src = `${url}&cb=${callback}`;

    return new Promise((resolve, reject) => {
        
        window[callback] = r => {
            resolve(r)
            headEle.removeChild(JSONP)
            delete window[callback]
        }
       
        headEle.appendChild(JSONP)

    })
}
export { jsonp }      //统一暴露