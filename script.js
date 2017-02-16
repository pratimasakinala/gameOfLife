var tableHolder = document.getElementById('table');

// Create a grid and randomly assign 1 or 0 to each cell
var grid = function (rows) {
  var gridView = document.createElement('table'),
    arr = [];
  tableHolder.appendChild(gridView);

  for (var i = 0; i<rows; i++) {
    arr[i] = [];
    gridView.insertRow(i);

    for (var j=0; j < rows; j++) {
      gridView.firstChild.childNodes[i].insertCell(j);
      arr[i][j] = ( Math.round(Math.random()) ) ? 1 : 0;
    }
  }

  // arr[1][26] = 1;
  // arr[2][24] = arr[2][26] = 1;
  // arr[3][14] = arr[3][15] = arr[3][22] = arr[3][23] = arr[3][36] = arr[3][37] = 1;
  // arr[4][13] = arr[4][17] = arr[4][22] = arr[4][23] = arr[4][36] = arr[4][37] = 1;
  // arr[5][1] = arr[5][2] = arr[5][12] = arr[5][18] = arr[4][22] = arr[4][23] = 1;
  // arr[6][1] = arr[6][2] = arr[5][12] = arr[5][16] = arr[5][18] = arr[5][19] = arr[5][24] = arr[5][26] = 1;
  // arr[7][12] = arr[7][18] = arr[5][26] = 1;
  // arr[8][13] = arr[8][17] = 1;
  // arr[9][14] = arr[9][15] = 1;

  return arr;
}(40);

// Show the grid on the window
function drawGrid() {
  grid.forEach(function(row, index) {
    row.forEach(function(cell, cellIndex) {
      if (cell) tableHolder.firstChild.firstChild.childNodes[index].childNodes[cellIndex].classList.add('live');
      else tableHolder.firstChild.firstChild.childNodes[index].childNodes[cellIndex].classList.remove('live');
    })
  });
}

function checkNeighbors(index, cellIndex) {
  var totalNeighbors = 0,
    position = 1,
    newIndex = index,
    cellIndex = cellIndex;

    while(position < 9) {
      switch (position) {
        case 1:
          // If current row is the first row then check top left neighbor in last row
          newIndex = (index === 0) ? (grid.length - 1) : (index - 1);
          // If current cell is first column then check top left neighbor in last column
          newCellIndex = (cellIndex === 0) ? (grid.length - 1) : cellIndex - 1;
          break;
        case 2:
          // If current row is the first row then check top center neighbor in last row
          newIndex = (index === 0) ? (grid.length - 1) : (index - 1);
          newCellIndex = cellIndex;
          break;
        case 3:
          // If current row is the first row then check top right neighbor in last row
          newIndex = (index === 0) ? (grid.length - 1) : (index - 1);
          // If current cell is last column then check top right neighbor in first column
          newCellIndex = (cellIndex === grid.length - 1) ? 0 : (cellIndex + 1);
          break;
        case 4:
          newIndex = index;
          // If current cell is first column then check left neighbor in last column
          newCellIndex = (cellIndex === 0) ? (grid.length - 1) : (cellIndex - 1);
          break;
        case 5:
          newIndex = index;
          // If current cell is last column then check right neighbor in first column
          newCellIndex = (cellIndex === grid.length - 1) ? 0 : (cellIndex + 1);
          break;
        case 6:
          // If current row is the last row then check bottom left neighbor in first row
          newIndex = (index === grid.length - 1) ? 0 : (index + 1);
          // If current cell is first column then check bottom left neighbor in last column
          newCellIndex = (cellIndex === 0) ? (grid.length - 1) : (cellIndex - 1);
          break;
        case 7:
          // If current row is the last row then check bottom center neighbor in first row
          newIndex = (index === grid.length - 1) ? 0 : (index + 1);
          newCellIndex = cellIndex;
          break;
        case 8:
          // If current row is the last row then check bottom center neighbor in first row
          newIndex = (index === grid.length - 1) ? 0 : (index + 1);
          // If current cell is last column then check bottom left neighbor in first column
          newCellIndex = (cellIndex === grid.length - 1) ? 0 : (cellIndex + 1);
          break;
      }

      // console.log({position, newIndex, newCellIndex});
      totalNeighbors += grid[newIndex][newCellIndex];
      position++;
    }
    return totalNeighbors;
}

// Check if cell is alive
function checkIfAlive() {
  // Create a copy of original grid
  var updateGrid = JSON.parse(JSON.stringify(grid));

  grid.forEach(function(row, index) {
    row.forEach(function(cell, cellIndex) {
      // console.log("current cell: [" + index + ", " + cellIndex + "]");

      // Check for number of neighbors
      var totalNeighbors = checkNeighbors(index, cellIndex);

      // Check if cell's status
      // console.log("totalNeighbors: " + totalNeighbors);
      // console.log(grid[index][cellIndex]);
      // If cell is currently dead
      if (!grid[index][cellIndex]) {
        // console.log("currently dead. needs 3 live neighbors.");
        if (totalNeighbors === 3) {
          // console.log("comes to life");
          updateGrid[index][cellIndex] = 1;
        } else {
          // console.log("remains dead");
          updateGrid[index][cellIndex] = 0;
        }
      } else { // If cell is currently alive
        // console.log("currently alive. needs 2 or 3 live neighbors to stay alive.");
        switch (totalNeighbors) {
          case 0:
          case 1:
            // console.log("dies due to underpopulation.");
            updateGrid[index][cellIndex] = 0; // dead cell
            break;
          case 2:
          case 3:
            // console.log("stays alive");
            updateGrid[index][cellIndex] = 1; // live cell
            break;
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
            // console.log("dies due to overpopulation.");
            updateGrid[index][cellIndex] = 0; // dead cell
            break;
          default:
            updateGrid[index][cellIndex] = 0; // dead cell
            break;
        }
      }
    });
  });

  // console.log("updating grid");
  grid = updateGrid;
}

drawGrid();
setInterval(loop, 200);

function loop() {
  checkIfAlive();
  drawGrid();
  // requestAnimationFrame(loop);
}
