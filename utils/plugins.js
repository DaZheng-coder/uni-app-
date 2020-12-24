exports.debounce = (method,delay) => {
    let timer = null;
    return function () {
        let self = this,
            args = arguments;
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            method.apply(self,args);
        },delay);
    }
}