var tableHolder = document.getElementById('table'),
  gun = document.querySelectorAll('button')[0],
  random = document.querySelectorAll('button')[1],
  reset = document.querySelectorAll('button')[2],
  color = document.querySelectorAll('button')[3],
  gen = document.getElementById('generation'),
  count = document.getElementById('cell-count'),
  interval,
  cellCount = 0,
  generation = -1,
  isGosperGun = false,
  gridHeight = 70,
  gridWidth = 140;

var grid = createGrid(gridHeight, gridWidth);

// Create a grid and randomly assign 1 or 0 to each cell
function createGrid(rows, cols) {
  var gridView = document.createElement('table'),
    arr = [];
  tableHolder.appendChild(gridView);
  tableHolder.firstChild.classList.add('color-scheme1');

  for (var i = 0; i < rows; i++) {
    arr[i] = [];
    gridView.insertRow(i);

    for (var j = 0; j < cols; j++) {
      gridView.firstChild.childNodes[i].insertCell(j);
      arr[i][j] = 0;
    }
  }
  return arr;
}

// Show the grid on the window
function drawGrid() {
  cellCount = 0;
  grid.forEach(function(row, index) {
    row.forEach(function(cell, cellIndex) {
      if (cell) {
          tableHolder.firstChild.firstChild.childNodes[index].childNodes[cellIndex].classList.remove('was-live');
          tableHolder.firstChild.firstChild.childNodes[index].childNodes[cellIndex].classList.add('live');
          cellCount++;
      } else {
          if (tableHolder.firstChild.firstChild.childNodes[index].childNodes[cellIndex].classList.contains('live')) {
            tableHolder.firstChild.firstChild.childNodes[index].childNodes[cellIndex].classList.remove('live');
            tableHolder.firstChild.firstChild.childNodes[index].childNodes[cellIndex].classList.add('was-live');
          }
      }
    })
  });
  count.innerHTML = cellCount;
  generation++;
  gen.innerHTML = generation;
}

function clearGrid() {
  clearInterval(interval);
  tableHolder.removeChild(tableHolder.childNodes[0]);

  // Reset live cell count and generation to 0
  cellCount = 0;
  count.innerHTML = cellCount;
  generation = -1;
  gen.innerHTML = generation + 1;

  // Create a new grid
  grid = createGrid(gridHeight, gridWidth);
}

// Find neighbors
function checkNeighbors(index, cellIndex) {
  var totalNeighbors = 0,
    position = 1,
    newIndex = index,
    cellIndex = cellIndex;

  // console.log({isGosperGun});
  while(position < 9) {
    switch (position) {
      case 1:
        if (isGosperGun) {
          newIndex = index - 1;
          newCellIndex = cellIndex - 1;
        } else {
          // If current row is the first row then check top left neighbor in last row
          newIndex = (index === 0) ? (gridHeight - 1) : (index - 1);
          // If current cell is first column then check top left neighbor in last column
          newCellIndex = (cellIndex === 0) ? (gridWidth - 1) : cellIndex - 1;
        }

        break;
      case 2:
        if (isGosperGun) {
          newIndex = index - 1;
        } else {
          // If current row is the first row then check top center neighbor in last row
          newIndex = (index === 0) ? (gridHeight - 1) : (index - 1);
        }
        newCellIndex = cellIndex;

        break;
      case 3:
        if (isGosperGun) {
          newIndex = index - 1;
          newCellIndex = cellIndex + 1;
        } else {
          // If current row is the first row then check top right neighbor in last row
          newIndex = (index === 0) ? (gridHeight - 1) : (index - 1);
          // If current cell is last column then check top right neighbor in first column
          newCellIndex = (cellIndex === gridWidth - 1) ? 0 : (cellIndex + 1);
        }

        break;
      case 4:
        newIndex = index;

        if (isGosperGun) {
          newCellIndex = cellIndex - 1;
        } else {
          // If current cell is first column then check left neighbor in last column
          newCellIndex = (cellIndex === 0) ? (gridWidth - 1) : (cellIndex - 1);
        }

        break;
      case 5:
        newIndex = index;

        if (isGosperGun) {
          newCellIndex = cellIndex + 1;
        } else {
          // If current cell is last column then check right neighbor in first column
          newCellIndex = (cellIndex === gridWidth - 1) ? 0 : (cellIndex + 1);
        }

        break;
      case 6:
        if (isGosperGun) {
          newIndex = index + 1;
          newCellIndex = cellIndex - 1;
        } else {
          // If current row is the last row then check bottom left neighbor in first row
          newIndex = (index === gridHeight - 1) ? 0 : (index + 1);
          // If current cell is first column then check bottom left neighbor in last column
          newCellIndex = (cellIndex === 0) ? (gridWidth - 1) : (cellIndex - 1);
        }

        break;
      case 7:
        if (isGosperGun) {
          newIndex = index + 1;
        } else {
          // If current row is the last row then check bottom center neighbor in first row
          newIndex = (index === gridHeight - 1) ? 0 : (index + 1);
        }
        newCellIndex = cellIndex;

        break;
      case 8:
        if (isGosperGun) {
          newIndex = index + 1;
          newCellIndex = cellIndex + 1;
        } else {
          // If current row is the last row then check bottom center neighbor in first row
          newIndex = (index === gridHeight - 1) ? 0 : (index + 1);
          // If current cell is last column then check bottom left neighbor in first column
          newCellIndex = (cellIndex === gridWidth - 1) ? 0 : (cellIndex + 1);
        }

        break;
    }

    // console.log({position, newIndex, newCellIndex});
    if (newIndex >= 0 && newIndex < gridHeight && newCellIndex >= 0 && newCellIndex < gridWidth) {
      // console.log("valid indices");
      // if (grid[newIndex][newCellIndex]) console.log("found a live neighbor");
      // else console.log("dead neighbor");
      totalNeighbors += grid[newIndex][newCellIndex];
    }
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
  drawGrid();
}

drawGrid();

function loop() {
  checkIfAlive();
  drawGrid();
  // requestAnimationFrame(loop);
}

// Create gosper's glider gun
gun.addEventListener('click', function() {
  isGosperGun = true;
  clearGrid();

  grid[1][25] = 1;
  grid[2][23] = grid[2][25] = 1;
  grid[3][13] = grid[3][14] = grid[3][21] = grid[3][22] = grid[3][35] = grid[3][36] = 1;
  grid[4][12] = grid[4][16] = grid[4][21] = grid[4][22] = grid[4][35] = grid[4][36] = 1;
  grid[5][1] = grid[5][2] = grid[5][11] = grid[5][17] = grid[5][21] = grid[5][22] = 1;
  grid[6][1] = grid[6][2] = grid[6][11] = grid[6][15] = grid[6][17] = grid[6][18] = grid[6][23] = grid[6][25] = 1;
  grid[7][11] = grid[7][17] = grid[7][25] = 1;
  grid[8][12] = grid[8][16] = 1;
  grid[9][13] = grid[9][14] = 1;

  drawGrid();
  interval = setInterval(loop, 200);
});

// Create a random pattern
random.addEventListener('click', function() {
  isGosperGun = false;
  clearGrid();

  grid.forEach(function(row, i) {
    row.forEach(function(cell, j) {
        grid[i][j] = Math.round(Math.random());
    });
  });

  drawGrid();
  interval = setInterval(loop, 200);
});

reset.addEventListener('click', function() {
  clearGrid();
});

color.addEventListener('click', function() {
  if (tableHolder.firstChild.classList.contains('color-scheme1')) {
    tableHolder.firstChild.classList.remove('color-scheme1');
    tableHolder.firstChild.classList.add('color-scheme2');
  } else if (tableHolder.firstChild.classList.contains('color-scheme2')) {
    tableHolder.firstChild.classList.remove('color-scheme2');
    tableHolder.firstChild.classList.add('color-scheme3');
  } else if (tableHolder.firstChild.classList.contains('color-scheme3')) {
    tableHolder.firstChild.classList.remove('color-scheme3');
    tableHolder.firstChild.classList.add('color-scheme1');
  }
});
