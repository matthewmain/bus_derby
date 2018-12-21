function multiplayer_key_swap (key, dir) {

  [ hash, name ] = document.location.hash.split(/[ #=]+/).filter(Boolean)
  console.log('keycode,',key)
  if (["p1","p2"].includes(hash))  {
    const keySwap = {
      "p2": {
        80: 38,
        222: 39,
        168: 40,
        76: 37,
      }
    }
    if (hash === 'p1') {
      console.log('player1', hash, key, dir)
    } else if(hash === 'p2') {
      console.log('player2', hash, key, dir)
    }
  } else {
    console.log('no multi')
    return key
  }

}
