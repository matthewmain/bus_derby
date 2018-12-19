function multiplayer_key_swap (key, dir) {
  
  [ hash, name ] = document.location.hash.split(/[ #=]+/).filter(Boolean)

  if (["p1","p2"].includes(hash))  {
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
