const _server = 'http://127.0.0.1:8081'
let xhr = new XMLHttpRequest()

function stream(queryString) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', _server+'?'+queryString, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        _set_request(JSON.parse(xhr.responseText))
      }
    }
  }
  xhr.send(null)
}
