

export function sGet(url,params){
  let args = [];
  for (let key in params) args.push(key + '=' + params[key])
  return new Promise((resolve, reject) => {
    fetch(url+'?'+args.join('&'))
      .then(response => response.json())
      .then(resolve)
      .catch(reject)
  })
}
