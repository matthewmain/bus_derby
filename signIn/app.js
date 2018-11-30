window.onload = function(){

  let players_local = {}
  let user;
  let signedIn = false

  firebase.initializeApp(config);

  let dbRef = firebase.database().ref().child('players')

  dbRef.on('value', snap => {
    players_local = snap.val()
    update_user_active(signedIn)
    check_challenges()
  })

  setInterval(function(){
    update_user_active(signedIn)
    if (user) dbRef.child(user+'/lastActive').set(Date.now())
    if (user && players_local[user].challenged) {
      for (const challenged in players_local[user].challenged) {
        dbRef.child(challenged+'/challengedBy/'+user+'/lastActive').set(Date.now())
      }
    }
  }, 2500)

  select_new_player.onclick = function(){
    selectPlayer(newPlayer.value)
  }

  signOut.onclick = function(){
    dbRef.child(user).set({ lastActive: 0 })
    user = ''
    title.textContent = 'Bus Derby Sign In'
    sign_in_container.style.display = ''
    unavailablePlayers.style.display = ''
    active_players_container.style.display = 'none'
    signedIn = false
    while (challenging_players_list.hasChildNodes()){
      challenging_players_list.removeChild(challenging_players_list.lastChild)
    }
    display_available_usernames(players_local, "availablePlayers", signedIn)
  }

  function display_available_usernames(players, parent, signedIn) {
    const id = parent === 'unavailablePlayers' ? 'signedIn-' : 'player-'
    parent = document.getElementById(parent)
    for (const player in players) {
      const pElm = document.getElementById(id+player)
      let active = players[player].lastActive + 5000 < Date.now()
      if (signedIn) active = !active
      if (active && player !== user) {
        if (!document.getElementById(id+player)) {
          let newPlayer = document.createElement('button')
          newPlayer.textContent = player
          newPlayer.id = id+player
          newPlayer.addEventListener('click', function(){
            selectPlayer(player, signedIn)
          })
          newPlayer.className = signedIn ? 'active' : 'available'
          if (id === 'signedIn-') newPlayer.className = 'unavailable'
          parent.appendChild(newPlayer)
        }
      } else if (document.getElementById(id+player)) {
        if (pElm) parent.removeChild(pElm)
      }
    }
  }

  function check_challenges() {
    if (user && players_local[user].challengedBy) {
      for (const challenger in players_local[user].challengedBy) {
        if (document.getElementById('player-'+challenger)
        && !document.getElementById("challengedBy-"+challenger)
        && players_local[user].challengedBy[challenger].lastActive + 5000
        > Date.now()) {
          const challengerElm = document.getElementById('player-'+challenger)
          challengerElm.classList.add('disableActive')
          const challenge = document.createElement('div')
          challenge.id = "challengedBy-"+challenger
          challenge.className = 'challenged'
          challenge.innerHTML = `
            <strong>${challenger}</strong> challenges you
            <button id="reject-${challenger}" class='inLine reject fl'>
              Reject
            </button>
            <button id="accept-${challenger}" class='inLine accept fl'>
              ACCEPT
            </button>
          `
          challenging_players_list.prepend(challenge)
          const reject = document.getElementById('reject-'+challenger)
          reject.addEventListener('click', function(){
            cancelChallenge(user, challenger, 'challengedBy')
          })
          const accept = document.getElementById('accept-'+challenger)
          accept.addEventListener('click', function(){
            launchGame(challenger, user)
          })
        }
      }
    }
    const parent = document.getElementById('challenging_players_list')
    for (const elm of parent.children) {
      const challenger = elm.id.split('challengedBy-')
      const challenged = elm.id.split('challenged-')
      if (challenger.length > 1) {
        const challengers = players_local[user].challengedBy
        if ((!challengers || !challengers[challenger[1]])) {
          parent.removeChild(elm)
          const challengerElm = document.getElementById('player-'+challenger[1])
          if (challenger[1] !== user) {
            challengerElm.classList.remove('disableActive')
          }
        }
      }
      if (challenged.length > 1) {
        const challengers = players_local[user].challenged
        if ((!challengers || !challengers[challenged[1]])) {
          parent.removeChild(elm)
          const challengerElm = document.getElementById('player-'+challenged[1])
          if (challenged[1] !== user) {
            challengerElm.classList.remove('disableActive')
          }
        }
      }
    }
    if (user && players_local[user].accepted) {
      alert(players_local[user].accepted+" accepted YOUR challenge!\n"+
        ".../?p1="+user+"&p2="+players_local[user].accepted)
    }

  }

  function update_user_active(signedIn) {
    display_available_usernames(players_local, "availablePlayers", signedIn)
    display_available_usernames(players_local, "unavailablePlayers", true)
    if (user && players_local[user].challengedBy) {
      for (const challenger in players_local[user].challengedBy) {
        if (players_local[user].challengedBy[challenger].lastActive + 5000
        < Date.now()) {
          const challenge = document.getElementById('challenge-'+challenger)
          if (challenge) challenging_players_list.removeChild(challenge)
          const challengerElm = document.getElementById('player-'+challenger)
          challengerElm.classList.remove('disableActive')
        }
      }
    }
  }

  function selectPlayer(input, challenge){
    if (challenge) {
      const challengerElm = document.getElementById('player-'+input)
      challengerElm.classList.add('disableActive')
      const challenge = document.createElement('div')
      challenge.id = "challenged-"+input
      challenge.className = 'challenged awaiting'
      challenge.innerHTML = `
        You challenged <strong>${input}</strong>, awaiting...
        <button id='cancel-${input}'class='inLine reject fl'>Cancel</button>
      `
      challenging_players_list.prepend(challenge)
      const cancel = document.getElementById('cancel-'+input)
      cancel.addEventListener('click', function(){
        cancelChallenge(input, user, 'challenged-')
      })
      dbRef.child(user+'/challenged/'+input).set({
        challengeTime: Date.now()
      })
      dbRef.child(input+'/challengedBy/'+user).set({
        lastActive: Date.now()
      })
    } else {
      old_user = user
      user = input
      if (user) {
        if (!players_local[user]
        ||  players_local[user].lastActive + 5000 < Date.now()) {
          dbRef.child(user).set({ lastActive: Date.now() })
          display_active_players()
        } else if (old_user !== user){
          alert("! Username is currently in use !\n"
          +"Try again later, or try a different name.")
          user = old_user
        }
      }
    }
  }

  function cancelChallenge(challenged, challenger, preId) {
    const challengerElm = document.getElementById('player-'+challenged)
    if (challenged !== user) challengerElm.classList.remove('disableActive')
    dbRef.child(challenger+'/challenged/'+challenged).remove()
    dbRef.child(challenged+'/challengedBy/'+challenger).remove()
    const challenge = document.getElementById(preId+challenged)
    if (challenge) challenging_players_list.removeChild(challenge)
  }

  function display_active_players(){
    sign_in_container.style.display = 'none'
    unavailablePlayers.style.display = 'none'
    title.innerHTML = `
      <none style="color: #666; font-size: 20px; display: inline-block">User:</none>
      <div style="color: brown; display: inline-block"> ${user} </div>
    `
    active_players_container.style.display = ''
    signedIn = true
    display_available_usernames(players_local, "availablePlayers", signedIn)
  }

  function launchGame(challenger, challenged) {
    dbRef.child(challenger+'/accepted').set(challenged)
    alert('You accepted '+challenger+"'s challenge!\n"+
      ".../?p1="+challenger+"&p2="+challenged)
  }

}
