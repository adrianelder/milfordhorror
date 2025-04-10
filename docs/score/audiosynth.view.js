function AudioSynthView(score) {
  let startTime = null;
  let playingSong = false;
  let stopping = false;
  var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
  if(isMobile) { var evtListener = ['touchstart', 'touchend']; } else { var evtListener = ['mousedown', 'mouseup']; }

  var __audioSynth = new AudioSynth();
  __audioSynth.setVolume(0.5);
  var __octave = 4;

  // Key bindings, notes to keyCodes.
  var keyboard = {

    /* 2 */
    50: 'C#,-1',

    /* 3 */
    51: 'D#,-1',

    /* 5 */
    53: 'F#,-1',

    /* 6 */
    54: 'G#,-1',

    /* 7 */
    55: 'A#,-1',

    /* 9 */
    57: 'C#,0',

    /* 0 */
    48: 'D#,0',

    /* + */
    187: 'F#,0',
    61: 'F#,0',

    /* Q */
    81: 'C,-1',

    /* W */
    87: 'D,-1',

    /* E */
    69: 'E,-1',

    /* R */
    82: 'F,-1',

    /* T */
    84: 'G,-1',

    /* Y */
    89: 'A,-1',

    /* U */
    85: 'B,-1',

    /* I */
    73: 'C,0',

    /* O */
    79: 'D,0',

    /* P */
    80: 'E,0',

    /* [ */
    219: 'F,0',

    /* ] */
    221: 'G,0',

    /* A */
    65: 'G#,0',

    /* S */
    83: 'A#,0',

    /* F */
    70: 'C#,1',

    /* G */
    71: 'D#,1',

    /* J */
    74: 'F#,1',

    /* K */
    75: 'G#,1',

    /* L */
    76: 'A#,1',

    /* Z */
    90: 'A,0',

    /* X */
    88: 'B,0',

    /* C */
    67: 'C,1',

    /* V */
    86: 'D,1',

    /* B */
    66: 'E,1',

    /* N */
    78: 'F,1',

    /* M */
    77: 'G,1',

    /* , */
    188: 'A,1',

    /* . */
    190: 'B,1'

  };

  var reverseLookupText = {};
  var reverseLookup = {};

  // Create a reverse lookup table.
  for(var i in keyboard) {

    var val;

    switch(i|0) {

      case 187:
	val = 61;
	break;

      case 219:
	val = 91;
	break;

      case 221:
	val = 93;
	break;

      case 188:
	val = 44;
	break;

      case 190:
	val = 46;
	break;

      default:
	val = i;
	break;

    }

    reverseLookupText[keyboard[i]] = val;
    reverseLookup[keyboard[i]] = i;

  }

  // Keys you have pressed down.
  var keysPressed = [];
  var visualKeyboard = null;
  var selectSound = null;

  var fnCreateKeyboard = function(keyboardElement) {
    // Generate keyboard
    // This is our main keyboard element! It's populated dynamically based on what you've set above.
    visualKeyboard = document.getElementById('keyboard');
    selectSound = document.getElementById('sound');

    var iKeys = 0;
    var iWhite = 0;
    var notes = __audioSynth._notes;

    for(var i=-1;i<=1;i++) {
      for(var n in notes) {
	if(n[2]!='b') {
	  var thisKey = document.createElement('div');
	  if(n.length>1) {
	    thisKey.className = 'black key';
	    thisKey.style.width = '30px';
	    thisKey.style.height = '40%'; // '120px';
	    thisKey.style.left = (40 * (iWhite - 1)) + 25 + 'px';
	  } else {
	    thisKey.className = 'white key';
	    thisKey.style.width = '40px';
	    thisKey.style.height = '100%'; // '200px';
	    thisKey.style.left = 40 * iWhite + 'px';
	    iWhite++;
	  }
	  // var label = document.createElement('div');
	  // label.className = 'label';
	  // label.innerHTML = '<b>' + String.fromCharCode(reverseLookupText[n + ',' + i]) + '</b>' + '<br /><br />' + n.substr(0,1) +
	  // 	'<span name="OCTAVE_LABEL" value="' + i + '">' + (__octave + parseInt(i)) + '</span>' + (n.substr(1,1)?n.substr(1,1):'');
	  // thisKey.appendChild(label);
	  thisKey.setAttribute('ID', 'KEY_' + n + ',' + i);
	  thisKey.addEventListener(evtListener[0], (function(keyCode) {
	    return function() {
	      fnPlayKeyboard({keyCode});
	      if (keyboard[keyCode]) {
		score.pending.push([keyboard[keyCode], Date.now() - startTime]);
	      }
	    }
	  })(reverseLookup[n + ',' + i]));
	  visualKeyboard[n + ',' + i] = thisKey;
	  visualKeyboard.appendChild(thisKey);
	  iKeys++;
	}
      }
    }

    visualKeyboard.style.width = iWhite * 40 + 'px';

    window.addEventListener(evtListener[1], function() { n = keysPressed.length; while(n--) { fnRemoveKeyBinding({keyCode:keysPressed[n]}); } });

  };

  // Creates our audio player
  var fnPlayNote = function(note, octave) {

    src = __audioSynth.generate(selectSound.value, note, octave, 2);
    container = new Audio(src);
    container.addEventListener('ended', function() { container = null; });
    container.addEventListener('loadeddata', function(e) { e.target.play(); });
    container.autoplay = false;
    container.setAttribute('type', 'audio/wav');
    container.load();
    return container;

  };

  // Detect keypresses, play notes.

  var fnPlayKeyboard = function(e) {

    var i = keysPressed.length;
    while(i--) {
      if(keysPressed[i]==e.keyCode) {
	return false;
      }
    }
    keysPressed.push(e.keyCode);

    if(keyboard[e.keyCode]) {
      if(visualKeyboard[keyboard[e.keyCode]]) {
	visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '#ff0000';
	visualKeyboard[keyboard[e.keyCode]].style.marginTop = '5px';
	visualKeyboard[keyboard[e.keyCode]].style.boxShadow = 'none';
      }
      var arrPlayNote = keyboard[e.keyCode].split(',');
      var note = arrPlayNote[0];
      var octaveModifier = arrPlayNote[1]|0;
      fnPlayNote(note, __octave + octaveModifier);
    } else {
      return false;
    }

  }

  // Remove key bindings once note is done.

  var fnRemoveKeyBinding = function(e) {

    var i = keysPressed.length;
    while(i--) {
      if(keysPressed[i]==e.keyCode) {
	if(visualKeyboard[keyboard[e.keyCode]]) {
	  visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '';
	  visualKeyboard[keyboard[e.keyCode]].style.marginTop = '';
	  visualKeyboard[keyboard[e.keyCode]].style.boxShadow = '';
	}
	keysPressed.splice(i, 1);
      }
    }

  }

  let playWholeSong = function(arr) {
    if (playingSong) return;
    playingSong = true;
    startTime = Date.now();
    fnPlaySong(arr);
  }

  var fnPlaySong = function(arr) {
    if(arr.length>0 && !stopping) {
      const head = arr.shift();
      const nextNoteTime = head[1] + startTime;
      setTimeout(function(array){
	return function() {
	  const def = (head[0] instanceof Array) ? head[0] : [head[0]];
	  var i = def.length;
	  var keys = [];
	  while(i--) {
	    keys.unshift(reverseLookup[def[i]]);
	    fnPlayKeyboard({keyCode:keys[0]});
	  }
	  setTimeout(function(array, val){
	    return function() {
	      var i = val.length;
	      while(i--) {
		fnRemoveKeyBinding({keyCode:val[i]});
	      }
	    }
	  }(arr, keys), 125);
	  fnPlaySong(array);
	}
      }(arr), nextNoteTime - Date.now());
    } else {
      playingSong = false;
      stopping = false;
    }
  };

  let fnStartPlayback = function() {
    const tmp = [...score.commited, ...score.pending];
    tmp.sort(function (a, b) {
      return a[1] - b[1];
    });
    score.commited = tmp;
    score.pending = [];
    playWholeSong([...score.commited]);
  };

  let fnStopPlayback = function() {
    if (playingSong) {
      stopping = true;
    }
  };


  // Set up global event listeners
  window.addEventListener('keydown', fnPlayKeyboard);
  window.addEventListener('keyup', fnRemoveKeyBinding);
  Object.defineProperty(this, 'draw', {
    value: fnCreateKeyboard
  });

  Object.defineProperty(this, 'start', {
    value: fnStartPlayback
  });

  Object.defineProperty(this, 'stop', {
    value: fnStopPlayback
  });

}
