var player, opponent
var fire = {}
var previous_state
var last_update = Date.now()

var config = {
  apiKey: "AIzaSyB6DYmRTHL9_8shibvoiH4FyzTyrFAuCJM",
  authDomain: "bus-derby.firebaseapp.com",
  databaseURL: "https://bus-derby.firebaseio.com",
  projectId: "bus-derby",
  storageBucket: "bus-derby.appspot.com",
  messagingSenderId: "229064166822"
}

firebase.initializeApp(config)

var dbRef = firebase.database().ref().child('game')
firebase.database().ref('game/p1').set({
  action: {
    "37": false,
    "38": false,
    "39": false,
    "40": false
  },
  position: {}
})
firebase.database().ref('game/p2').set({
  action: {
    "76": false,
    "222": false,
    "80": false,
    "186": false
  },
  position: {}
})


dbRef.on('value', snap => {
  fire = snap.val()
  if (fire.turn === opponent) {
    for (const key in fire[opponent].action) {
      if (previous_state[opponent].action[key] !== fire[opponent].action[key]) {
        if (fire[opponent].action[key] === true){
          console.log('down', key)
          handleKeyDown(null, parseInt(key))
        } else {
          console.log('up', key)
          handleKeyUp(null, parseInt(key))
        }
      }
    }
    setPos(opponent)
  }
  previous_state = fire

})

function selectPlayer(event, color, p){
  player = p
  opponent = p === 'p1' ? 'p2' : 'p1'
  multiPlayerConsole.style.color = color
  multiPlayerConsole.innerHTML = "Player 1: "+event.srcElement.textContent
  start_auto_position_checker()
}

function getPos(player){

  const b = player === 'p1' ? busArray[0] : busArray[1]

  return {
    p: [b.frame.position.x, b.frame.position.y, b.frame.position.z],
    r: [b.frame.rotation._x, b.frame.rotation._y, b.frame.rotation._z],
    blp: [b.wheel_bl.position.x, b.wheel_bl.position.y, b.wheel_bl.position.z],
    blr: [b.wheel_bl.rotation._x, b.wheel_bl.rotation._y, b.wheel_bl.rotation._z],
    brp: [b.wheel_br.position.x, b.wheel_br.position.y, b.wheel_br.position.z],
    brr: [b.wheel_br.rotation._x, b.wheel_br.rotation._y, b.wheel_br.rotation._z],
    flp: [b.wheel_fl.position.x, b.wheel_fl.position.y, b.wheel_fl.position.z],
    flr: [b.wheel_fl.rotation._x, b.wheel_fl.rotation._y, b.wheel_fl.rotation._z],
    frp: [b.wheel_fr.position.x, b.wheel_fr.position.y, b.wheel_fr.position.z],
    frr: [b.wheel_fr.rotation._x, b.wheel_fr.rotation._y, b.wheel_fr.rotation._z]
  }

  // b1p = b1.frame.position
  // b1r = b1.frame.rotation
  //
  //
  // b1_blp = b1.wheel_bl.position
  // b1_blr = b1.wheel_bl.rotation
  //
  // b1_brp = b1.wheel_br.position
  // b1_brr = b1.wheel_br.rotation
  //
  // b1_flp = b1.wheel_fl.position
  // b1_flr = b1.wheel_fl.rotation
  //
  // b1_frp = b1.wheel_fr.position
  // b1_frr = b1.wheel_fr.rotation


  // console.log("*")
  // console.log('\n'
  // +'busArray[0].frame.position.set('+b1p.x+','+b1p.y+','+b1p.z+');\n'
  // +'busArray[0].frame.rotation.set('+b1r._x+','+b1r._y+','+b1r._z+');\n'
  // +'busArray[0].wheel_bl.position.set('+b1_blp.x+','+b1_blp.y+','+b1_blp.z+');\n'
  // +'busArray[0].wheel_bl.rotation.set('+b1_blr._x+','+b1_blr._y+','+b1_blr._z+');\n'
  // +'busArray[0].wheel_br.position.set('+b1_brp.x+','+b1_brp.y+','+b1_brp.z+');\n'
  // +'busArray[0].wheel_br.rotation.set('+b1_brr._x+','+b1_brr._y+','+b1_brr._z+');\n'
  //
  // +'busArray[0].wheel_fl.position.set('+b1_flp.x+','+b1_flp.y+','+b1_flp.z+');\n'
  // +'busArray[0].wheel_fl.rotation.set('+b1_flr._x+','+b1_flr._y+','+b1_flr._z+');\n'
  // +'busArray[0].wheel_fr.position.set('+b1_frp.x+','+b1_frp.y+','+b1_frp.z+');\n'
  // +'busArray[0].wheel_fr.rotation.set('+b1_frr._x+','+b1_frr._y+','+b1_frr._z+');\n'
  // )

}

function setPos(player){

  const bus = player === 'p1' ? busArray[0] : busArray[1]
  const pos = fire[player].position

  bus.frame.__dirtyPosition = true;
  bus.frame.__dirtyRotation = true;
  bus.wheel_bl.__dirtyPosition = true;
  bus.wheel_bl.__dirtyRotation = true;
  bus.wheel_br.__dirtyPosition = true;
  bus.wheel_br.__dirtyRotation = true;
  bus.wheel_fl.__dirtyPosition = true;
  bus.wheel_fl.__dirtyRotation = true;
  bus.wheel_fr.__dirtyPosition = true;
  bus.wheel_fr.__dirtyRotation = true;
  bus.frame.position.set(pos.p[0], pos.p[1], pos.p[2]);
  bus.frame.rotation.set(pos.r[0], pos.r[1], pos.r[2]);
  bus.wheel_bl.position.set(pos.blp[0], pos.blp[1], pos.blp[2]);
  bus.wheel_bl.rotation.set(pos.blr[0], pos.blr[1], pos.blr[2]);
  bus.wheel_br.position.set(pos.brp[0], pos.brp[1], pos.brp[2]);
  bus.wheel_br.rotation.set(pos.brr[0], pos.brr[1], pos.brr[2]);
  bus.wheel_fl.position.set(pos.flp[0], pos.flp[1], pos.flp[2]);
  bus.wheel_fl.rotation.set(pos.flr[0], pos.flr[1], pos.flr[2]);
  bus.wheel_fr.position.set(pos.frp[0], pos.frp[1], pos.frp[2]);
  bus.wheel_fr.rotation.set(pos.frr[0], pos.frr[1], pos.frr[2]);

}

function start_auto_position_checker(){
  setInterval(function(){
    const now = Date.now()
    if (now > last_update+100) {
      console.log('update')
      fire.turn = player
      fire[player].position = getPos(player)
      firebase.database().ref('game').set(fire)
      last_update = Date.now() - 10
    }
  }, 100)
}

// NOTES
// Refactor functions in index.js to only have 2 lines  of code in each down/up to call func here.
//
