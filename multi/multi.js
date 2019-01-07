var _usr = { move: {  "38": true, "39": true, "37": false, "40": false }}
var _opp = { move: {  "38": true, "39": true, "37": false, "40": false }}

window.onload = function() {
  _multi_check()
  if (_usr.id) stream(JSON.stringify(_usr))
}

function _set_request(game) {
  for (const plr in game) {
    for (const move in game[plr]) {
      const who = _usr.id == plr ? _usr : _opp
      const key = _key_swap(parseInt(move), who)

      // console.log(game[plr][move], key, who)
      // game[plr][move] ? handleKeyDown(key) : handleKeyUp(key)
      if (game[plr][move]) {
        //console.log('down',plr,key)
        handleKeyDown(key)
      } else {
        //console.log('up',plr,key)
        handleKeyUp(key)
      }
    }
  }
  setTimeout(function(){
    stream(JSON.stringify(_usr))
  },1000)
}

function _multi_check() {
  if (window.location.hash) {
    _usr.id = window.location.hash.split('#')[1]
    _opp.id = _usr.id === '1' ? '2' : '1'
  }
}

function _key_swap (key, who) {
  if (!who) who.id = "0"
  if (who.id === "1") {
    const keySwap = { 87:38, 68:39, 65:37, 83:40, 38:38, 39:39, 37:37, 40:40 }
    return keySwap[parseInt(key)]
  } else if (who.id === "2") {
    const keySwap = { 38:80, 39:222, 37:76, 40:186 }
    return keySwap[parseInt(key)]
  }
  return false
}
