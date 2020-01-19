$(() => {
  // let socket;
  const socket = io({
    query: {
      username: `GUEST#${Math.floor(Math.random()*(999-100+1)+100)}`,
    }
  });

  const boardState = initBoardState();
  const SHIPS = [
    {
      index: 0,
      name: 'Patrol Boat',
      size: 2,
      placed: false
    },
    {
      index: 1,
      name: 'Submarine',
      size: 3,
      placed: false
    },
    {
      index: 2,
      name: 'Destroyer',
      size: 3,
      placed: false
    },
    {
      index: 3,
      name: 'Battleship',
      size: 4,
      placed: false
    },
    {
      index: 4,
      name: 'Aircraft Carrier',
      size: 5,
      placed: false
    },
  ];
  let currentShip = null;
  let orientation = 'horizontal';
  let placeable = false;

  let opponent = {};

  renderBoard('board', 'tile');

  function initBoardState() {
    const boardState = {};
    for (let i = 0; i < 10; i += 1) {
      boardState[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    return boardState;
  }

  function renderBoard(boardClass, tileClass) {
    for (let i = 0; i < 10; i += 1) {
      let rowHTML = '<tr>';
      for (let j = 0; j < 10; j += 1) {
        rowHTML += `<td class="${tileClass}" data-pos="${i},${j}"></td>`
      }
      rowHTML += '</tr>'
      $(`.${boardClass}`).append(rowHTML);
    }
  }

  function isPlaceable(axis, size, offAxis) {
    if (!(axis <= (10 - size))) {
      return false;
    }

    for (let i = axis; i < (axis + size); i += 1) {
      if (orientation === 'vertical') {
        if ($(`.tile[data-pos="${i},${offAxis}"]`).hasClass('placed')) {
          return false;
        }
      } else if (orientation === 'horizontal') {
        if ($(`.tile[data-pos="${offAxis},${i}"]`).hasClass('placed')) {
          return false;
        }
      }
    }

    return true;
  }

  function toggleOrientation() {
    if (orientation === 'horizontal') {
      orientation = 'vertical';
    } else if (orientation === 'vertical') {
      orientation = 'horizontal';
    }
  }

  function resetReadyBtn() {
    const btn = $('.ready-btn');
    btn.find('.spinner-border').addClass('d-none');
    btn.find('.text').text('Ready');
    btn.prop('disabled', false);
  }

  function allShipsPlaced() {
    for (const ship of SHIPS) {
      if (!ship.placed) {
        return false;
      }
    }

    return true;
  }

  function addBtnLoadingUI(btn) {
    btn.find('.spinner-border').removeClass('d-none');
    btn.find('.text').text('Loading...');
    btn.prop('disabled', true);
  }

  function initEnemy() {
    enemyBoard = $('.enemy-board');
    enemyBoard.removeClass('d-none');
    $('.ready-ctn').addClass('d-none');
    renderBoard('enemy-board', 'enemy-tile');
  }

  function showNotReadyError() {
    $('.ready-err').fadeIn();
    setTimeout(() => {
      $('.ready-err').fadeOut();
    }, 5000);
  }

  function connectToServer() {
    // socket = io({
    //   query: {
    //     username: 'Karan',
    //   }
    // });
    lookForPlayers();
  }

  function lookForPlayers() {
    socket.emit('look for players', boardState);
  }

  /**
   * OPPONENT FOUND SOCKET EVENT HANDLER
   */
  socket.on('opponent found', opponent => {
    console.log('OPPONENT:');
    console.log(opponent);
    resetReadyBtn();
    initEnemy();
    opponent = opponent;
  });

  /**
   * TILE CLICK HANDLER
   */
  $('.tile').on('click', e => {
    if (currentShip) {
      const tile = $(e.currentTarget);
      const pos = tile.data('pos').split(',');
      const x = parseInt(pos[0]);
      const y = parseInt(pos[1]);
      if (placeable) {
        if (orientation === 'vertical') {
          // place ship on hovered tiles
          for (let i = x; i < (x + currentShip.size); i += 1) {
            $(`.tile[data-pos="${i},${y}"]`).addClass('placed');
            boardState[i][y] = 1;
          }
        } else if (orientation === 'horizontal') {
          // place ship on hovered tiles
          for (let i = y; i < (y + currentShip.size); i += 1) {
            $(`.tile[data-pos="${x},${i}"]`).addClass('placed');
            boardState[x][i] = 1;
          }
        }
        $(`.ships button[data-index="${currentShip.index}"]`).prop('disabled', true);
        SHIPS[currentShip.index].placed = true;
        currentShip = null;
      }
    }
  });

  /**
   * TILE HOVER HANDLER
   */
  $('.tile').hover(
    // mouseenter event handler
    e => {
      if (currentShip) {
        const tile = $(e.currentTarget);
        const pos = tile.data('pos').split(',');
        const x = parseInt(pos[0]);
        const y = parseInt(pos[1]);
        if (orientation === 'vertical') {
          // check if ship is placeable in current tile
          placeable = isPlaceable(x, currentShip.size, y);

          if (placeable) {
            // highlight placeable tiles
            for (let i = x; i < (x + currentShip.size); i += 1) {
              $(`.tile[data-pos="${i},${y}"]`).addClass('hover-place');
            }
          } else {
            tile.addClass('not-placeable');
          }
        } else if (orientation === 'horizontal') {
          // check if ship is placeable in current tile
          placeable = isPlaceable(y, currentShip.size, x);

          if (placeable) {
            // highlight placeable tiles
            for (let i = y; i < (y + currentShip.size); i += 1) {
              $(`.tile[data-pos="${x},${i}"]`).addClass('hover-place');
            }
          } else {
            tile.addClass('not-placeable');
          }
        }
      }
    },
    // mouseleave event handler
    () => {
      $('.tile').removeClass('hover-place');
      $('.tile').removeClass('not-placeable');
    }
  );

  /**
   * TOGGLE ORIENTATION ON RIGHT CLICK
   */
  $(document).on('contextmenu', e => {
    e.preventDefault();
    toggleOrientation();
  });

  /**
   * TOGGLE ORIENTATION BUTTON HANDLER
   */
  $('.toggle-orientation').on('click', toggleOrientation);

  /**
   * SHIPS BUTTON GROUP CLICK HANDLER
   */
  $('.ships button').on('click', e => {
    $('.ships button').removeClass('active-btn');
    const btn = $(e.currentTarget);
    const shipIndex = parseInt(btn.data('index'));
    currentShip = SHIPS[shipIndex];
    btn.addClass('active-btn');
  });

  /**
   * READT BUTTON CLICK HANDLER
   */
  $('.ready-btn').on('click', e => {
    const isReady = allShipsPlaced();
    if (isReady) {
      const btn = $(e.currentTarget);
      addBtnLoadingUI(btn);
      connectToServer();
    } else {
      showNotReadyError();
    }
  });

});
