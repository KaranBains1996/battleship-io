$(() => {
  const socket = io();
  const boardState = initBoardState();

  initBoardState();
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
        rowHTML += `<td class="tile" data-x=${i} data-y=${j}></td>`
      }
      rowHTML += '</tr>'
      $('.board').append(rowHTML);
    }
  }

  $('.tile').on('click', e => {
    const tile = $(e.currentTarget);
    const x = tile.data('x');
    const y = tile.data('y');
    if (!tile.hasClass('hit')) {
      tile.addClass('hit');
    } else {
      tile.removeClass('hit');
    }
  });
});
