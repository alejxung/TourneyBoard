const MAX_PLAYERS = 1000;

// Call the function to generate rounds and brackets
document.addEventListener('DOMContentLoaded', () => {
  setFirstRoundCompetitors();
  addDragAndDropEventListeners();
  addBracketClickListeners();
});

// Update player styles based on the height of competitors
function updatePlayerStyles() {
  const competitorHeight = document.querySelector('.competitor').clientHeight - 1;
  console.log(competitorHeight);
  
  document.querySelectorAll('.player').forEach(player => {
    if (player.parentElement.classList.contains('player-list')) {
      player.style.height = '30px';
    } else if (competitorHeight < 30) {
      player.style.height = `${competitorHeight}px`;
    } else {
      player.style.height = '30px';
    }

    const playerHeight = parseFloat(getComputedStyle(player).height);
    const fontSize = playerHeight * 0.5;
    player.style.fontSize = `${fontSize}px`;
  });
}

// Generate players based on the given number
function generatePlayers(numPlayers) {
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = '';
  for (let i = 1; i <= numPlayers; i++) {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.id = `player${i}`;
    playerDiv.draggable = true;
    playerDiv.textContent = `Player ${i}`;
    
    playerList.appendChild(playerDiv);
  }
  updatePlayerStyles();
  addDragAndDropEventListeners();
}

// Set the number of players and generate them
function setPlayers() {
  let numPlayers = parseInt(document.getElementById('numPlayers').value, 10);
  numPlayers = Math.min(numPlayers, MAX_PLAYERS);
  document.getElementById('numPlayers').value = numPlayers;
  generatePlayers(numPlayers);

  addDragAndDropEventListeners();
  addBracketClickListeners();
}

// Set the first round competitors
function setFirstRoundCompetitors() {
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = ''; // Reset the player-list
  const firstRoundCompetitors = parseInt(document.getElementById('firstRoundCompetitors').value, 10);
  generateRoundsAndBrackets(firstRoundCompetitors);
}

// Generate rounds and brackets based on the number of first round competitors
function generateRoundsAndBrackets(firstRoundCompetitors) {
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = '';
 
  let numCompetitors = firstRoundCompetitors;
  let roundCounter = 1;

  while (numCompetitors >= 1) {
    const roundDiv = document.createElement('div');
    roundDiv.className = 'round';
    roundDiv.id = `round${roundCounter}`;
    mainContent.appendChild(roundDiv);

    const numMatches = numCompetitors / 2;

    for (let i = 0; i < numMatches; i++) {
      const matchDiv = document.createElement('div');
      matchDiv.className = 'match';
      matchDiv.id = `round${roundCounter}-match${i + 1}`;
      
      const competitor1 = document.createElement('div');
      competitor1.className = 'competitor';
      competitor1.id = `round${roundCounter}-match${i + 1}-competitor1`;

      const competitor2 = document.createElement('div');
      competitor2.className = 'competitor';
      competitor2.id = `round${roundCounter}-match${i + 1}-competitor2`;

      matchDiv.appendChild(competitor1);
      matchDiv.appendChild(competitor2);
      roundDiv.appendChild(matchDiv);
    }

    if (numCompetitors > 1) {
      const bracketsDiv = document.createElement('div');
      bracketsDiv.className = 'brackets';
      bracketsDiv.id = `brackets${roundCounter}`;
      mainContent.appendChild(bracketsDiv);

      let numBrackets = numCompetitors / 2;
      for (let j = 0; j < numBrackets; j++) {
        const bracketDiv = document.createElement('div');
        bracketDiv.className = 'bracket';
        bracketDiv.id = `brackets${roundCounter}-bracket${j + 1}`;

        const brDiv1 = document.createElement('div');
        brDiv1.className = 'br top';
        brDiv1.id = `brackets${roundCounter}-bracket${j + 1}-br1`;

        const brDiv2 = document.createElement('div');
        brDiv2.className = 'br bottom';
        brDiv2.id = `brackets${roundCounter}-bracket${j + 1}-br2`;

        const matchCompete1 = document.createElement('div');
        matchCompete1.className = 'match-compete';

        const matchCompete2 = document.createElement('div');
        matchCompete2.className = 'match-compete';

        const matchWinner = document.createElement('div');
        matchWinner.className = 'match-winner';

        brDiv1.appendChild(matchCompete1);
        brDiv1.appendChild(matchWinner);
        bracketDiv.appendChild(brDiv1);

        brDiv2.appendChild(matchCompete2);
        brDiv2.appendChild(matchWinner.cloneNode(true));
        bracketDiv.appendChild(brDiv2);

        bracketsDiv.appendChild(bracketDiv);
      }
    }

    numCompetitors = numMatches;
    roundCounter++;
  }

  // Adjust the last match in the last round to have only one competitor
  const lastRound = document.getElementById(`round${roundCounter - 1}`);
  const lastMatch = lastRound.querySelector('.match:last-child');
  if (lastMatch) {
    const competitors = lastMatch.querySelectorAll('.competitor');
    competitors[1].remove(); // Remove the second competitor
  }

  // Add event listeners to all newly created competitor elements
  addDragAndDropEventListeners();
}

// Add drag and drop event listeners
function addDragAndDropEventListeners() {
  const players = document.querySelectorAll('.player');
  const dropZones = document.querySelectorAll('.player-list, .competitor');

  players.forEach(player => {
    player.addEventListener('dragstart', handleDragStart);
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
  });

  document.addEventListener('dragend', handleDragEnd);
}

// Handle drag start event
function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  setTimeout(() => {
    e.target.classList.add('invisible');
  }, 0);
}

// Handle drag over event
function handleDragOver(e) {
  e.preventDefault();
}

// Handle drop event
function handleDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const draggableElement = document.getElementById(id);
  let dropzone = e.target;

  // Adjust dropzone if the target is a player within the player-list
  if (dropzone.classList.contains('player') && dropzone.parentElement.classList.contains('player-list')) {
    dropzone = dropzone.parentElement;
  }

  // Adjust dropzone if the target is a player within a competitor
  if (dropzone.classList.contains('player') && dropzone.parentElement.classList.contains('competitor')) {
    dropzone = dropzone.parentElement;
  }

  let sourceParent = draggableElement.parentElement;

  if (dropzone.classList.contains('competitor')) {
    if (dropzone !== sourceParent) {
      if (dropzone.children.length === 0) {
        dropzone.appendChild(draggableElement);
      } else if (dropzone.children.length === 1 && dropzone.children[0].classList.contains('player')) {
        const existingPlayer = dropzone.children[0];

        // Swap the players
        dropzone.appendChild(draggableElement);
        sourceParent.appendChild(existingPlayer);
      }
    }
  } else if (dropzone.classList.contains('player-list')) {
    if (dropzone !== sourceParent) {
      dropzone.appendChild(draggableElement);
    }
  }

  // If the player was moved to a different place from a competitor, remove subsequent clones
  if (sourceParent.classList.contains('competitor') && dropzone !== sourceParent) {
    // If the player was moved to a different place, the br inside bracket resets to no clicked class
    let brId = sourceParent.id.replace('round', 'brackets').replace('match', 'bracket').replace('competitor', 'br');
    const parts = brId.split('-');
    const bracket = document.getElementById(`${parts[0]}-${parts[1]}`);
    if (bracket) {
      const brElements = bracket.querySelectorAll('.br');
      brElements.forEach(br => br.classList.remove('.br'));
      brElements.forEach(br => br.classList.remove('clicked'));
    }
    removeSubsequentClones(sourceParent.id);
  }

  updatePlayerStyles();

  // Handle adding/removing .show-lines class after drop
  if (sourceParent && sourceParent.classList.contains('competitor')) {
    updateBracketsVisibility(sourceParent);
  }
  if (dropzone.classList.contains('competitor')) {
    updateBracketsVisibility(dropzone);
  }
}

// Handle drag enter event
function handleDragEnter(e) {
  e.preventDefault();
}

// Handle drag leave event
function handleDragLeave(e) {
  e.preventDefault();
}

// Handle drag end event
function handleDragEnd(e) {
  e.target.classList.remove('invisible');
  const competitors = document.querySelectorAll('.competitor');
  competitors.forEach(competitor => {
    updateBracketsVisibility(competitor);
  });
}

// Update brackets visibility based on player presence
function updateBracketsVisibility(competitor) {
  const players = competitor.querySelectorAll('.player');
  let brId = competitor.id.replace('round', 'brackets').replace('match', 'bracket').replace('competitor', 'br');
  const br = document.getElementById(brId);
  if (br) {
    if (players.length > 0) {
      br.classList.add('show-lines');
    } else {
      br.classList.remove('show-lines');
      br.classList.remove('clicked'); // Remove the 'clicked' class
    }
  }
}

// Add click listeners to brackets
function addBracketClickListeners() {
  const brackets = document.querySelectorAll('.br');
  brackets.forEach(bracket => {
    bracket.addEventListener('click', handleBracketClick);
  });
}

// Handle bracket click event
function handleBracketClick(e) {
  const clickedBracket = e.currentTarget;

  // Check if the clicked bracket is already clicked
  if (clickedBracket.classList.contains('clicked')) {
    return; // If already clicked, do nothing
  }

  // Toggle the 'clicked' class for the clicked bracket
  clickedBracket.classList.toggle('clicked');

  // Get the parent bracket
  const parentBracket = clickedBracket.closest('.bracket');

  // Remove 'clicked' class from other brackets within the same bracket if present
  if (parentBracket) {
    const siblingBrackets = parentBracket.querySelectorAll('.br.clicked');
    siblingBrackets.forEach(bracket => {
      if (bracket !== clickedBracket) {
        bracket.classList.remove('clicked');
      }
    });
  }

  if (clickedBracket) {
    const competitorId = clickedBracket.id.replace('brackets', 'round').replace('bracket', 'match').replace('br', 'competitor');
    let nextRoundCompetitorId = getNextRoundCompetitorId(competitorId);
    const competitor = document.getElementById(competitorId);
    const winningPlayer = competitor.querySelector('.player');
  
    if (winningPlayer) {
      const clone = winningPlayer.cloneNode(true);
      clone.draggable = false;

      // Get the next round competitor
      let nextRoundCompetitor = document.getElementById(nextRoundCompetitorId);
      // Check if there's already a clone in the next round competitor
      let existingClone = nextRoundCompetitor.querySelector('.player');
      
      if (existingClone) {
        // Replace the existing clone with the new clone
        while (existingClone) {
          let nextRoundCompetitorBracketId = nextRoundCompetitorId.replace('round', 'brackets').replace('match', 'bracket').replace('competitor', 'br');
          let nextRoundCompetitorBracket = document.getElementById(nextRoundCompetitorBracketId);
          if (nextRoundCompetitorBracket && nextRoundCompetitorBracket.classList.contains('clicked')) {
            nextRoundCompetitor.replaceChild(clone.cloneNode(true), existingClone);
            nextRoundCompetitorId = getNextRoundCompetitorId(nextRoundCompetitorId);
            nextRoundCompetitor = document.getElementById(nextRoundCompetitorId)
            existingClone = nextRoundCompetitor.querySelector('.player');
          } else {
            if (nextRoundCompetitor) {
              nextRoundCompetitor.replaceChild(clone.cloneNode(true), existingClone);
            }
            break;
          }
        } 
      } else {
        // Append the clone to the next round competitor if there's no existing clone
        nextRoundCompetitor.appendChild(clone.cloneNode(true));
        // Add show-lines class to the next round competitor's bracket
        const nextRoundCompetitorBracketId = nextRoundCompetitorId.replace('round', 'brackets').replace('match', 'bracket').replace('competitor', 'br');
        const nextRoundCompetitorBracket = document.getElementById(nextRoundCompetitorBracketId);
        if (nextRoundCompetitorBracket) {
          nextRoundCompetitorBracket.classList.add('show-lines');
        }
      }
    }
  }
}

// Remove subsequent clones
function removeSubsequentClones(competitorId) {
  let nextRoundCompetitorId = getNextRoundCompetitorId(competitorId);

  // Reset the original round match bracket
  resetBracket(competitorId);

  // Continue removing clones for each subsequent round
  while (nextRoundCompetitorId) {
    const nextRoundCompetitor = document.getElementById(nextRoundCompetitorId);

    if (nextRoundCompetitor) {
      const clone = nextRoundCompetitor.querySelector('.player');
      if (clone) {
        clone.remove();
        // Remove show-lines class from the next round competitor's bracket
        resetBracket(nextRoundCompetitorId);
      }
    }

    // Get the next round competitor ID
    nextRoundCompetitorId = getNextRoundCompetitorId(nextRoundCompetitorId);
  }

  // Reset the original bracket if there are no more clones in the next round
  if (!nextRoundCompetitorId) {
    resetBracket(competitorId);
  }
}

// Reset bracket to initial state
function resetBracket(competitorId) {
  const bracketId = competitorId.replace('round', 'brackets').replace('match', 'bracket').replace('competitor', 'br');
  const bracket = document.getElementById(bracketId);
  if (bracket) {
    // Remove .br class from both .br elements
    const brElements = bracket.querySelectorAll('.br');
    brElements.forEach(br => br.classList.remove('br'));
    // Remove .clicked class from both .br elements
    brElements.forEach(br => br.classList.remove('clicked'));
  }
}

// Get the ID of the next round's competitor
function getNextRoundCompetitorId(currentCompetitorId) {
  // Parse the current competitor ID to determine the next round's competitor ID
  const parts = currentCompetitorId.split('-');
  const round = parseInt(parts[0].replace('round', ''), 10);
  const match = parseInt(parts[1].replace('match', ''), 10);
  const nextRound = Math.ceil(match / 2);
  const nextRoundCompetitor = (match % 2 === 0) ? 2 : 1;
  const nextRoundCompetitorId = `round${round + 1}-match${nextRound}-competitor${nextRoundCompetitor}`;
  const nextRoundElement = document.getElementById(nextRoundCompetitorId);
  return nextRoundElement ? nextRoundCompetitorId : null;
}
