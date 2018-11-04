var player, opponent
var fire = {}
var opponent_Last_Move

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
firebase.database().ref('game/p1').set(0)
firebase.database().ref('game/p2').set(0)

dbRef.on('value', snap => {
  fire = snap.val()
  console.log(snap.val(), fire[opponent])

  if (fire.turn === opponent) {
    if (fire[opponent] == '0') {
      console.log(opponent,  fire[opponent])
      handleKeyUp(null, opponent_Last_Move)
    } else {
      handleKeyDown(null, parseInt(fire[opponent]))
      opponent_Last_Move = parseInt(fire[opponent])
    }
  }

})

function selectPlayer(event, color, p){
  player = p
  opponent = p === 'p1' ? 'p2' : 'p1'
  console.log(player, opponent)
  multiPlayerConsole.style.color = color
  multiPlayerConsole.innerHTML = "Player 1: "+event.srcElement.textContent
}
