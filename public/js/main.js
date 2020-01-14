$(() => {
  const socket = io();
  const boardState = initBoardState();
  const SHIPS = [
    {
      name: 'Patrol Boat',
      size: 2
    },
    {
      name: 'Submarine',
      size: 3
    },
    {
      name: 'Destroyer',
      size: 3
    },
    {
      name: 'Battleship',
      size: 4
    },
    {
      name: 'Aircraft Carrier',
      size: 5
    },
  ];
  let orientation = 'horizontal';
  let placeable = false;
  let currentShip = SHIPS[1];

  renderBoard();

  function initBoardState() {
    const boardState = {};
    for (let i = 0; i < 10; i += 1) {
      boardState[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    return boardState;
  }

  function renderBoard() {
    for (let i = 0; i < 10; i += 1) {
      let rowHTML = '<tr>';
      for (let j = 0; j < 10; j += 1) {
        rowHTML += `<td class="tile" data-pos="${i},${j}"></td>`
      }
      rowHTML += '</tr>'
      $('.board').append(rowHTML);
    }
  }

  /**
   * TILE CLICK HANDLER
   */
  $('.tile').on('click', e => {
    debugger;
    const tile = $(e.currentTarget);
    const pos = tile.data('pos').split(',');
    const x = parseInt(pos[0]);
    const y = parseInt(pos[1]);
    if (placeable) {
      if (orientation === 'vertical') {
        // place ship on hovered tiles
        for (let i = x; i < (x + currentShip.size); i += 1) {
          $(`.tile[data-pos="${i},${y}"]`).addClass('placed');
        }
      } else if (orientation === 'horizontal') {
        // place ship on hovered tiles
        for (let i = y; i < (y + currentShip.size); i += 1) {
          $(`.tile[data-pos="${x},${i}"]`).addClass('placed');
        }
      }
    }
  });

  /**
   * TILE HOVER HANDLER
   */
  $('.tile').hover(
    // mouseenter event handler
    e => {
      const tile = $(e.currentTarget);
      const pos = tile.data('pos').split(',');
      const x = parseInt(pos[0]);
      const y = parseInt(pos[1]);
      if (orientation === 'vertical') {
        // check if ship is placeable in current tile
        if (x <= (10 - currentShip.size)) {
          placeable = true;
        } else {
          placeable = false;
        }
        if (placeable) {
          // highlight placeable tiles
          for (let i = x; i < (x + currentShip.size); i += 1) {
            $(`.tile[data-pos="${i},${y}"]`).addClass('hover-place');
          }
        }
      } else if (orientation === 'horizontal') {
        // check if ship is placeable in current tile
        if (y <= (10 - currentShip.size)) {
          placeable = true;
        } else {
          placeable = false;
        }
        if (placeable) {
          // highlight placeable tiles
          for (let i = y; i < (y + currentShip.size); i += 1) {
            $(`.tile[data-pos="${x},${i}"]`).addClass('hover-place');
          }
        }
      }
    },
    // mouseleave event handler
    () => {
      $('.tile').removeClass('hover-place');
    });

  /**
   * TOGGLE ORIENTATION BUTTON HANDLER
   */
  $('.toggle-orientation').on('click', () => {
    if (orientation === 'horizontal') {
      orientation = 'vertical';
    } else if (orientation === 'vertical') {
      orientation = 'horizontal';
    }
  });
});
