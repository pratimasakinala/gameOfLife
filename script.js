var tableHolder = document.getElementById('table'),
  gun = document.querySelectorAll('button')[0],
  starOscillator = document.querySelectorAll('button')[1],
  koksOscillator = document.querySelectorAll('button')[2],
  oscillator328P4 = document.querySelectorAll('button')[3],
  oscillator37P = document.querySelectorAll('button')[4],
  random = document.querySelectorAll('button')[5],
  reset = document.querySelectorAll('button')[6],
  color = document.querySelectorAll('button')[7],
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

function loop() {
  checkIfAlive();
  drawGrid();
  // requestAnimationFrame(loop);
}

drawGrid();

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

  grid[65][79] = grid[65][80] = 1
  grid[66][79] = grid[66][81] = 1;
  grid[67][81] = 1;
  grid[68][81] = grid[68][82] = 1;

  drawGrid();
  interval = setInterval(loop, 200);
});

// Create a star oscillator
starOscillator.addEventListener('click', function() {
  isGosperGun = false;
  clearGrid();

  /*--------- First Column ----------*/
  grid[1][7] = 1;
  grid[2][7] = 1;
  grid[3][5] = grid[3][6] = grid[3][8] = grid[3][9] = 1;
  grid[5][3] = grid[5][5] = grid[5][9] = grid[5][11] = 1;
  grid[6][3] = grid[6][11] = 1;
  grid[7][1] = grid[7][2] = grid[7][12] = grid[7][13] = 1;
  grid[8][3] = grid[8][11] = 1;
  grid[9][3] = grid[9][5] = grid[9][9] = grid[9][11] = 1;
  grid[11][5] = grid[11][6] = grid[11][8] = grid[11][9] = 1;
  grid[12][7] = 1;
  grid[13][7] = 1;

  grid[17][7] = 1;
  grid[18][7] = 1;
  grid[19][5] = grid[19][6] = grid[19][8] = grid[19][9] = 1;
  grid[21][3] = grid[21][5] = grid[21][9] = grid[21][11] = 1;
  grid[22][3] = grid[22][11] = 1;
  grid[23][1] = grid[23][2] = grid[23][12] = grid[23][13] = 1;
  grid[24][3] = grid[24][11] = 1;
  grid[25][3] = grid[25][5] = grid[25][9] = grid[25][11] = 1;
  grid[27][5] = grid[27][6] = grid[27][8] = grid[27][9] = 1;
  grid[28][7] = 1;
  grid[29][7] = 1;

  grid[33][7] = 1;
  grid[34][7] = 1;
  grid[35][5] = grid[35][6] = grid[35][8] = grid[35][9] = 1;
  grid[37][3] = grid[37][5] = grid[37][9] = grid[37][11] = 1;
  grid[38][3] = grid[38][11] = 1;
  grid[39][1] = grid[39][2] = grid[39][12] = grid[39][13] = 1;
  grid[40][3] = grid[40][11] = 1;
  grid[41][3] = grid[41][5] = grid[41][9] = grid[41][11] = 1;
  grid[43][5] = grid[43][6] = grid[43][8] = grid[43][9] = 1;
  grid[44][7] = 1;
  grid[45][7] = 1;

  grid[49][7] = 1;
  grid[50][7] = 1;
  grid[51][5] = grid[51][6] = grid[51][8] = grid[51][9] = 1;
  grid[53][3] = grid[53][5] = grid[53][9] = grid[53][11] = 1;
  grid[54][3] = grid[54][11] = 1;
  grid[55][1] = grid[55][2] = grid[55][12] = grid[55][13] = 1;
  grid[56][3] = grid[56][11] = 1;
  grid[57][3] = grid[57][5] = grid[57][9] = grid[57][11] = 1;
  grid[59][5] = grid[59][6] = grid[59][8] = grid[59][9] = 1;
  grid[60][7] = 1;
  grid[61][7] = 1;
  /*--------- End of First Column ----------*/

  /*--------- Second  Column ----------*/
  grid[10][25] = 1;
  grid[11][24] = grid[11][25] = grid[11][26] = 1;
  grid[12][22] = grid[12][23] = grid[12][24] = grid[12][26] = grid[12][27] = grid[12][28] = 1;
  grid[13][22] = grid[13][28] = 1;
  grid[14][21] = grid[14][22] = grid[14][28] = grid[14][29] = 1;
  grid[15][20] = grid[15][21] = grid[15][29] = grid[15][30] = 1;
  grid[16][21] = grid[16][22] = grid[16][28] = grid[16][29] = 1;
  grid[17][22] = grid[17][28] = 1;
  grid[18][22] = grid[18][23] = grid[18][24] = grid[18][26] = grid[18][27] = grid[18][28] = 1;
  grid[19][24] = grid[19][25] = grid[19][26] = 1;
  grid[20][25] = 1;

  grid[26][25] = 1;
  grid[27][24] = grid[27][25] = grid[27][26] = 1;
  grid[28][22] = grid[28][23] = grid[28][24] = grid[28][26] = grid[28][27] = grid[28][28] = 1;
  grid[29][22] = grid[29][28] = 1;
  grid[30][21] = grid[30][22] = grid[30][28] = grid[30][29] = 1;
  grid[31][20] = grid[31][21] = grid[31][29] = grid[31][30] = 1;
  grid[32][21] = grid[32][22] = grid[32][28] = grid[32][29] = 1;
  grid[33][22] = grid[33][28] = 1;
  grid[34][22] = grid[34][23] = grid[34][24] = grid[34][26] = grid[34][27] = grid[34][28] = 1;
  grid[35][24] = grid[35][25] = grid[35][26] = 1;
  grid[36][25] = 1;

  grid[42][25] = 1;
  grid[43][24] = grid[43][25] = grid[43][26] = 1;
  grid[44][22] = grid[44][23] = grid[44][24] = grid[44][26] = grid[44][27] = grid[44][28] = 1;
  grid[45][22] = grid[45][28] = 1;
  grid[46][21] = grid[46][22] = grid[46][28] = grid[46][29] = 1;
  grid[47][20] = grid[47][21] = grid[47][29] = grid[47][30] = 1;
  grid[48][21] = grid[48][22] = grid[48][28] = grid[48][29] = 1;
  grid[49][22] = grid[49][28] = 1;
  grid[50][22] = grid[50][23] = grid[50][24] = grid[50][26] = grid[50][27] = grid[50][28] = 1;
  grid[51][24] = grid[51][25] = grid[51][26] = 1;
  grid[52][25] = 1;
  /*--------- End of Second Column ----------*/

  /*--------- Third  Column ----------*/
  grid[18][42] = grid[18][43] = grid[18][44] = 1;
  grid[20][40] = grid[20][42] = grid[20][44] = grid[20][46] = 1;
  grid[22][38] = grid[22][40] = grid[22][46] = grid[22][48] = 1;
  grid[23][38] = grid[23][48] = 1;
  grid[24][38] = grid[24][40] = grid[24][46] = grid[24][48] = 1;
  grid[26][40] = grid[26][42] = grid[26][44] = grid[26][46] = 1;
  grid[28][42] = grid[28][43] = grid[28][44] = 1;

  grid[34][42] = grid[34][43] = grid[34][44] = 1;
  grid[36][40] = grid[36][42] = grid[36][44] = grid[36][46] = 1;
  grid[38][38] = grid[38][40] = grid[38][46] = grid[38][48] = 1;
  grid[39][38] = grid[39][48] = 1;
  grid[40][38] = grid[40][40] = grid[40][46] = grid[40][48] = 1;
  grid[42][40] = grid[42][42] = grid[42][44] = grid[42][46] = 1;
  grid[44][42] = grid[44][43] = grid[44][44] = 1;
  /*--------- End of Third Column ----------*/

  /*--------- Third Last Column ----------*/
  grid[18][95] = grid[18][96] = grid[18][97] = 1;
  grid[20][93] = grid[20][95] = grid[20][97] = grid[20][99] = 1;
  grid[22][91] = grid[22][93] = grid[22][99] = grid[22][101] = 1;
  grid[23][91] = grid[23][101] = 1;
  grid[24][91] = grid[24][93] = grid[24][99] = grid[24][101] = 1;
  grid[26][93] = grid[26][95] = grid[26][97] = grid[26][99] = 1;
  grid[28][95] = grid[28][96] = grid[28][97] = 1;

  grid[34][95] = grid[34][96] = grid[34][97] = 1;
  grid[36][93] = grid[36][95] = grid[36][97] = grid[36][99] = 1;
  grid[38][91] = grid[38][93] = grid[38][99] = grid[38][101] = 1;
  grid[39][91] = grid[39][101] = 1;
  grid[40][91] = grid[40][93] = grid[40][99] = grid[40][101] = 1;
  grid[42][93] = grid[42][95] = grid[42][97] = grid[42][99] = 1;
  grid[44][95] = grid[44][96] = grid[44][97] = 1;
  /*--------- End of Third Last Column ----------*/

  /*--------- Second Last Column ----------*/
  grid[10][114] = 1;
  grid[11][113] = grid[11][114] = grid[11][115] = 1;
  grid[12][111] = grid[12][112] = grid[12][113] = grid[12][115] = grid[12][116] = grid[12][117] = 1;
  grid[13][111] = grid[13][117] = 1;
  grid[14][110] = grid[14][111] = grid[14][117] = grid[14][118] = 1;
  grid[15][109] = grid[15][110] = grid[15][118] = grid[15][119] = 1;
  grid[16][110] = grid[16][111] = grid[16][117] = grid[16][118] = 1;
  grid[17][111] = grid[17][117] = 1;
  grid[18][111] = grid[18][112] = grid[18][113] = grid[18][115] = grid[18][116] = grid[18][117] = 1;
  grid[19][113] = grid[19][114] = grid[19][115] = 1;
  grid[20][114] = 1;

  grid[26][114] = 1;
  grid[27][113] = grid[27][114] = grid[27][115] = 1;
  grid[28][111] = grid[28][112] = grid[28][113] = grid[28][115] = grid[28][116] = grid[28][117] = 1;
  grid[29][111] = grid[29][117] = 1;
  grid[30][110] = grid[30][111] = grid[30][117] = grid[30][118] = 1;
  grid[31][109] = grid[31][110] = grid[31][118] = grid[31][119] = 1;
  grid[32][110] = grid[32][111] = grid[32][117] = grid[32][118] = 1;
  grid[33][111] = grid[33][117] = 1;
  grid[34][111] = grid[34][112] = grid[34][113] = grid[34][115] = grid[34][116] = grid[34][117] = 1;
  grid[35][113] = grid[35][114] = grid[35][115] = 1;
  grid[36][114] = 1;

  grid[42][114] = 1;
  grid[43][113] = grid[43][114] = grid[43][115] = 1;
  grid[44][111] = grid[44][112] = grid[44][113] = grid[44][115] = grid[44][116] = grid[44][117] = 1;
  grid[45][111] = grid[45][117] = 1;
  grid[46][110] = grid[46][111] = grid[46][117] = grid[46][118] = 1;
  grid[47][109] = grid[47][110] = grid[47][118] = grid[47][119] = 1;
  grid[48][110] = grid[48][111] = grid[48][117] = grid[48][118] = 1;
  grid[49][111] = grid[49][117] = 1;
  grid[50][111] = grid[50][112] = grid[50][113] = grid[50][115] = grid[50][116] = grid[50][117] = 1;
  grid[51][113] = grid[51][114] = grid[51][115] = 1;
  grid[52][114] = 1;
  /*--------- End of Second Last Column ----------*/

  /*--------- Last Column ----------*/
  grid[1][132] = 1;
  grid[2][132] = 1;
  grid[3][130] = grid[3][131] = grid[3][133] = grid[3][134] = 1;
  grid[5][128] = grid[5][130] = grid[5][134] = grid[5][136] = 1;
  grid[6][128] = grid[6][136] = 1;
  grid[7][126] = grid[7][127] = grid[7][137] = grid[7][138] = 1;
  grid[8][128] = grid[8][136] = 1;
  grid[9][128] = grid[9][130] = grid[9][134] = grid[9][136] = 1;
  grid[11][130] = grid[11][131] = grid[11][133] = grid[11][134] = 1;
  grid[12][132] = 1;
  grid[13][132] = 1;

  grid[17][132] = 1;
  grid[18][132] = 1;
  grid[19][130] = grid[19][131] = grid[19][133] = grid[19][134] = 1;
  grid[21][128] = grid[21][130] = grid[21][134] = grid[21][136] = 1;
  grid[22][128] = grid[22][136] = 1;
  grid[23][126] = grid[23][127] = grid[23][137] = grid[23][138] = 1;
  grid[24][128] = grid[24][136] = 1;
  grid[25][128] = grid[25][130] = grid[25][134] = grid[25][136] = 1;
  grid[27][130] = grid[27][131] = grid[27][133] = grid[27][134] = 1;
  grid[28][132] = 1;
  grid[29][132] = 1;

  grid[33][132] = 1;
  grid[34][132] = 1;
  grid[35][130] = grid[35][131] = grid[35][133] = grid[35][134] = 1;
  grid[37][128] = grid[37][130] = grid[37][134] = grid[37][136] = 1;
  grid[38][128] = grid[38][136] = 1;
  grid[39][126] = grid[39][127] = grid[39][137] = grid[39][138] = 1;
  grid[40][128] = grid[40][136] = 1;
  grid[41][128] = grid[41][130] = grid[41][134] = grid[41][136] = 1;
  grid[43][130] = grid[43][131] = grid[43][133] = grid[43][134] = 1;
  grid[44][132] = 1;
  grid[45][132] = 1;

  grid[49][132] = 1;
  grid[50][132] = 1;
  grid[51][130] = grid[51][131] = grid[51][133] = grid[51][134] = 1;
  grid[53][128] = grid[53][130] = grid[53][134] = grid[53][136] = 1;
  grid[54][128] = grid[54][136] = 1;
  grid[55][126] = grid[55][127] = grid[55][137] = grid[55][138] = 1;
  grid[56][128] = grid[56][136] = 1;
  grid[57][128] = grid[57][130] = grid[57][134] = grid[57][136] = 1;
  grid[59][130] = grid[59][131] = grid[59][133] = grid[59][134] = 1;
  grid[60][132] = 1;
  grid[61][132] = 1;
  /*--------- End of Last Column ----------*/

  drawGrid();
  interval = setInterval(loop, 500);
});

// Create a kok's gallaxy oscillator
koksOscillator.addEventListener('click', function() {
  isGosperGun = false;
  clearGrid();

  grid[17][17] = grid[17][18] = grid[17][20] = grid[17][21] = grid[17][22] = grid[17][23] = grid[17][24] = grid[17][25] = 1;
  grid[18][17] = grid[18][18] = grid[18][20] = grid[18][21] = grid[18][22] = grid[18][23] = grid[18][24] = grid[18][25] = 1;
  grid[19][17] = grid[19][18] = 1;
  grid[20][17] = grid[20][18] = grid[20][24] = grid[20][25] = 1;
  grid[21][17] = grid[21][18] = grid[21][24] = grid[21][25] = 1;
  grid[22][17] = grid[22][18] = grid[22][24] = grid[22][25] = 1;
  grid[23][24] = grid[23][25] = 1;
  grid[24][17] = grid[24][18] = grid[24][19] = grid[24][20] = grid[24][21] = grid[24][22] = grid[24][24] = grid[24][25] = 1;
  grid[25][17] = grid[25][18] = grid[25][19] = grid[25][20] = grid[25][21] = grid[25][22] = grid[25][24] = grid[25][25] = 1;

  drawGrid();
  interval = setInterval(loop, 500);
});

// Create a 328P4 oscillator
oscillator328P4.addEventListener('click', function() {
  isGosperGun = false;
  clearGrid();

  grid[14][55] = grid[14][56] = grid[14][61] = grid[14][62] = grid[14][76] = grid[14][77] = grid[14][82] = grid[14][83] = 1;
  grid[15][55] = grid[15][57] = grid[15][62] = grid[15][76] = grid[15][81] = grid[15][83] = 1;
  grid[16][57] = grid[16][58] = grid[16][59] = grid[16][62] = grid[16][64] = grid[16][65] = grid[16][73] = grid[16][74] = grid[16][76] = grid[16][79] = grid[16][80] = grid[16][81] = 1;
  grid[17][52] = grid[17][53] = grid[17][56] = grid[17][60] = grid[17][62] = grid[17][64] = grid[17][65] = grid[17][73] = grid[17][74] = grid[17][76] = grid[17][78] = grid[17][82] = grid[17][85] = grid[17][86] = 1;
  grid[18][52] = grid[18][55] = grid[18][57] = grid[18][60] = grid[18][62] = grid[18][63] = grid[18][75] = grid[18][76] = grid[18][78] = grid[18][81] = grid[18][83] = grid[18][86] = 1;
  grid[19][53] = grid[19][54] = grid[19][56] = grid[19][59] = grid[19][62] = grid[19][76] = grid[19][79] = grid[19][82] = grid[19][84] = grid[19][85] = 1;
  grid[20][54] = grid[20][59] = grid[20][60] = grid[20][61] = grid[20][77] = grid[20][78] = grid[20][79] = grid[20][84] = 1;
  grid[21][54] = grid[21][57] = grid[21][58] = grid[21][59] = grid[21][60] = grid[21][61] = grid[21][77] = grid[21][78] = grid[21][79] = grid[21][80] = grid[21][81] = grid[21][84] = 1;
  grid[22][55] = grid[22][56] = grid[22][58] = grid[22][59] = grid[22][63] = grid[22][64] = grid[22][69] = grid[22][74] = grid[22][75] = grid[22][79] = grid[22][80] = grid[22][82] = grid[22][83] = 1;
  grid[23][52] = grid[23][58] = grid[23][59] = grid[23][62] = grid[23][63] = grid[23][65] = grid[23][68] = grid[23][70] = grid[23][73] = grid[23][75] = grid[23][76] = grid[23][79] = grid[23][80] = grid[23][86] = 1;
  grid[24][52] = grid[24][53] = grid[24][54] = grid[24][55] = grid[24][56] = grid[24][57] = grid[24][61] = grid[24][62] = grid[24][65] = grid[24][66] = grid[24][67] = grid[24][68] = grid[24][70] = grid[24][71] = grid[24][72] = grid[24][73] = grid[24][76] = grid[24][77] = grid[24][81] = grid[24][82] = grid[24][83] = grid[24][84] = grid[24][85] = grid[24][86] = 1;
  grid[25][56] = grid[25][60] = grid[25][61] = grid[25][65] = grid[25][68] = grid[25][70] = grid[25][73] = grid[25][77] = grid[25][78] = grid[25][82] = 1;
  grid[26][54] = grid[26][55] = grid[26][60] = grid[26][66] = grid[26][72] = grid[26][78] = grid[26][83] = grid[26][84] = 1;
  grid[27][54] = grid[27][55] = grid[27][61] = grid[27][62] = grid[27][63] = grid[27][66] = grid[27][72] = grid[27][75] = grid[27][76] = grid[27][77] = grid[27][83] = grid[27][84] = 1;
  grid[28][62] = grid[28][64] = grid[28][65] = grid[28][73] = grid[28][74] = grid[28][76] = 1;
  grid[29][62] = grid[29][68] = grid[29][69] = grid[29][70] = grid[29][76] = 1;
  grid[30][61] = grid[30][62] = grid[30][63] = grid[30][67] = grid[30][71] = grid[30][75] = grid[30][76] = grid[30][77] = 1;

  grid[31][60] = grid[31][67] = grid[31][71] = grid[31][78] = 1;

  grid[32][61] = grid[32][62] = grid[32][63] = grid[32][67] = grid[32][71] = grid[32][75] = grid[32][76] = grid[32][77] = 1;
  grid[33][62] = grid[33][68] = grid[33][69] = grid[33][70] = grid[33][76] = 1;
  grid[34][62] = grid[34][64] = grid[34][65] = grid[34][73] = grid[34][74] = grid[34][76] = 1;
  grid[35][54] = grid[35][55] = grid[35][61] = grid[35][62] = grid[35][63] = grid[35][66] = grid[35][72] = grid[35][75] = grid[35][76] = grid[35][77] = grid[35][83] = grid[35][84] = 1;
  grid[36][54] = grid[36][55] = grid[36][60] = grid[36][66] = grid[36][72] = grid[36][78] = grid[36][83] = grid[36][84] = 1;
  grid[37][56] = grid[37][60] = grid[37][61] = grid[37][65] = grid[37][68] = grid[37][70] = grid[37][73] = grid[37][77] = grid[37][78] = grid[37][82] = 1;
  grid[38][52] = grid[38][53] = grid[38][54] = grid[38][55] = grid[38][56] = grid[38][57] = grid[38][61] = grid[38][62] = grid[38][65] = grid[38][66] = grid[38][67] = grid[38][68] = grid[38][70] = grid[38][71] = grid[38][72] = grid[38][73] = grid[38][76] = grid[38][77] = grid[38][81] = grid[38][82] = grid[38][83] = grid[38][84] = grid[38][85] = grid[38][86] = 1;
  grid[39][52] = grid[39][58] = grid[39][59] = grid[39][62] = grid[39][63] = grid[39][65] = grid[39][68] = grid[39][70] = grid[39][73] = grid[39][75] = grid[39][76] = grid[39][79] = grid[39][80] = grid[39][86] = 1;
  grid[40][55] = grid[40][56] = grid[40][58] = grid[40][59] = grid[40][63] = grid[40][64] = grid[40][69] = grid[40][74] = grid[40][75] = grid[40][79] = grid[40][80] = grid[40][82] = grid[40][83] = 1;
  grid[41][54] = grid[41][57] = grid[41][58] = grid[41][59] = grid[41][60] = grid[41][61] = grid[41][77] = grid[41][78] = grid[41][79] = grid[41][80] = grid[41][81] = grid[41][84] = 1;
  grid[42][54] = grid[42][59] = grid[42][60] = grid[42][61] = grid[42][77] = grid[42][78] = grid[42][79] = grid[42][84] = 1;
  grid[43][53] = grid[43][54] = grid[43][56] = grid[43][59] = grid[43][62] = grid[43][76] = grid[43][79] = grid[43][82] = grid[43][84] = grid[43][85] = 1;
  grid[44][52] = grid[44][55] = grid[44][57] = grid[44][60] = grid[44][62] = grid[44][63] = grid[44][75] = grid[44][76] = grid[44][78] = grid[44][81] = grid[44][83] = grid[44][86] = 1;
  grid[45][52] = grid[45][53] = grid[45][56] = grid[45][60] = grid[45][62] = grid[45][64] = grid[45][65] = grid[45][73] = grid[45][74] = grid[45][76] = grid[45][78] = grid[45][82] = grid[45][85] = grid[45][86] = 1;
  grid[46][57] = grid[46][58] = grid[46][59] = grid[46][62] = grid[46][64] = grid[46][65] = grid[46][73] = grid[46][74] = grid[46][76] = grid[46][79] = grid[46][80] = grid[46][81] = 1;
  grid[47][55] = grid[47][57] = grid[47][62] = grid[47][76] = grid[47][81] = grid[47][83] = 1;
  grid[48][55] = grid[48][56] = grid[48][61] = grid[48][62] = grid[48][76] = grid[48][77] = grid[48][82] = grid[48][83] = 1;

  drawGrid();
  interval = setInterval(loop, 500);
});

// Creates two 37 period oscillator
oscillator37P.addEventListener('click', function() {
  isGosperGun = false;
  clearGrid();

  // Nicolay's period 37 oscillator
  grid[10][30] = 1;
  grid[11][30] = grid[11][31] = grid[11][32] = 1;
  grid[12][33] = 1;
  grid[13][32] = grid[13][33] = 1;
  grid[14][37] = 1;
  grid[15][35] = grid[15][38] = grid[15][39] = grid[15][44] = grid[15][45] = 1;
  grid[16][35] = grid[16][37] = grid[16][44] = grid[16][45] = 1;
  grid[17][35] = 1;
  grid[19][29] = grid[19][30] = 1;
  grid[20][28] = grid[20][31] = 1;
  grid[21][28] = grid[21][30] = grid[21][35] = grid[21][36] = grid[21][40] = grid[21][41] = grid[21][42] = 1;
  grid[22][29] = grid[22][34] = grid[22][35] = grid[22][36] = grid[22][38] = grid[22][39] = grid[22][40] = grid[22][41] = grid[22][44] = 1;
  grid[23][17] = grid[23][18] = grid[23][35] = grid[23][36] = grid[23][38] = grid[23][39] = grid[23][44] = 1;
  grid[24][17] = grid[24][18] = grid[24][24] = grid[24][25] = grid[24][26] = grid[24][31] = grid[24][36] = grid[24][37] = grid[24][38] = grid[24][39] = grid[24][41] = grid[24][43] = grid[24][44] = 1;
  grid[25][26] = grid[25][30] = grid[25][31] = grid[25][36] = grid[25][37] = grid[25][39] = grid[25][40] = grid[25][41] = grid[25][42] = 1;
  grid[26][23] = grid[26][27] = grid[26][29] = grid[26][33] = grid[26][36] = grid[26][37] = grid[26][38] = grid[26][39] = grid[26][40] = grid[26][41] = grid[26][47] = grid[26][48] = 1;
  grid[27][23] = grid[27][24] = grid[27][26] = grid[27][27] = grid[27][28] = grid[27][30] = grid[27][31] = grid[27][32] = grid[27][33] = grid[27][35] = grid[27][36] = grid[27][38] = grid[27][42] = grid[27][46] = grid[27][49] = 1;
  grid[28][23] = grid[28][24] = grid[28][27] = grid[28][28] = grid[28][31] = grid[28][32] = grid[28][35] = grid[28][41] = grid[28][43] = grid[28][47] = grid[28][49] = grid[28][57] = grid[28][58] = 1;
  grid[29][17] = grid[29][24] = grid[29][25] = grid[29][26] = grid[29][27] = grid[29][28] = grid[29][34] = grid[29][35] = grid[29][40] = grid[29][41] = grid[29][43] = grid[29][44] = grid[29][48] = grid[29][57] = 1;
  grid[30][17] = grid[30][24] = grid[30][25] = grid[30][26] = grid[30][28] = grid[30][29] = grid[30][33] = grid[30][34] = grid[30][35] = grid[30][40] = grid[30][41] = grid[30][55] = grid[30][57] = 1;
  grid[31][16] = grid[31][18] = grid[31][26] = grid[31][27] = grid[31][28] = grid[31][33] = grid[31][34] = grid[31][36] = grid[31][37] = grid[31][38] = grid[31][41] = grid[31][42] = grid[31][55] = grid[31][56] = 1;
  grid[32][23] = grid[32][24] = grid[32][25] = grid[32][26] = grid[32][27] = grid[32][28] = grid[32][29] = grid[32][33] = grid[32][34] = grid[32][36] = grid[32][37] = grid[32][38] = grid[32][39] = grid[32][46] = 1;
  grid[33][17] = grid[33][18] = grid[33][19] = grid[33][23] = grid[33][24] = grid[33][25] = grid[33][29] = grid[33][30] = grid[33][31] = grid[33][32] = grid[33][38] = grid[33][39] = grid[33][40] = grid[33][41] = grid[33][45] = grid[33][46] = grid[33][47] = grid[33][51] = grid[33][52] = grid[33][53] = 1;
  grid[34][24] = grid[34][31] = grid[34][32] = grid[34][33] = grid[34][34] = grid[34][36] = grid[34][37] = grid[34][41] = grid[34][42] = grid[34][43] = grid[34][44] = grid[34][45] = grid[34][46] = grid[34][47] = 1;
  grid[35][14] = grid[35][15] = grid[35][28] = grid[35][29] = grid[35][32] = grid[35][33] = grid[35][34] = grid[35][36] = grid[35][37] = grid[35][42] = grid[35][43] = grid[35][44] = grid[35][52] = grid[35][54] = 1;
  grid[36][13] = grid[36][15] = grid[36][29] = grid[36][30] = grid[36][35] = grid[36][36] = grid[36][37] = grid[36][41] = grid[36][42] = grid[36][44] = grid[36][45] = grid[36][46] = grid[36][53] = 1;
  grid[37][13] = grid[37][22] = grid[37][26] = grid[37][27] = grid[37][29] = grid[37][30] = grid[37][35] = grid[37][36] = grid[37][42] = grid[37][43] = grid[37][44] = grid[37][45] = grid[37][46] = grid[37][53] = 1;
  grid[38][12] = grid[38][13] = grid[38][21] = grid[38][23] = grid[38][27] = grid[38][29] = grid[38][35] = grid[38][38] = grid[38][39] = grid[38][42] = grid[38][43] = grid[38][46] = grid[38][47] = 1;
  grid[39][21] = grid[39][24] = grid[39][28] = grid[39][32] = grid[39][34] = grid[39][35] = grid[39][37] = grid[39][38] = grid[39][39] = grid[39][40] = grid[39][42] = grid[39][43] = grid[39][44] = grid[39][46] = grid[39][47] = 1;
  grid[40][22] = grid[40][23] = grid[40][29] = grid[40][30] = grid[40][31] = grid[40][32] = grid[40][33] = grid[40][34] = grid[40][37] = grid[40][41] = grid[40][43] = grid[40][47] = 1;
  grid[41][28] = grid[41][29] = grid[41][30] = grid[41][31] = grid[41][33] = grid[41][34] = grid[41][39] = grid[41][40] = grid[41][44] = 1;
  grid[42][26] = grid[42][27] = grid[42][29] = grid[42][31] = grid[42][32] = grid[42][33] = grid[42][34] = grid[42][39] = grid[42][44] = grid[42][45] = grid[42][46] = grid[42][52] = grid[42][53] = 1;
  grid[43][26] = grid[43][31] = grid[43][32] = grid[43][34] = grid[43][35] = grid[43][52] = grid[43][53] = 1;
  grid[44][26] = grid[44][29] = grid[44][30] = grid[44][31] = grid[44][32] = grid[44][34] = grid[44][35] = grid[44][36] = grid[44][41] = 1;
  grid[45][28] = grid[45][29] = grid[45][30] = grid[45][34] = grid[45][35] = grid[45][40] = grid[45][42] = 1;
  grid[46][39] = grid[46][42] = 1;
  grid[47][40] = grid[47][41] = 1;
  grid[49][35] = 1;
  grid[50][25] = grid[50][26] = grid[50][33] = grid[50][35] = 1;
  grid[51][25] = grid[51][26] = grid[51][31] = grid[51][32] = grid[51][35] = 1;
  grid[52][33] = 1;
  grid[53][37] = grid[53][38] = 1;
  grid[54][37] = 1;
  grid[55][38] = grid[55][39] = grid[55][40] = 1;
  grid[56][40] = 1;


  // 124P37 Oscillator
  grid[15][95] = grid[15][96] = grid[15][108] = grid[15][109] = 1;
  grid[16][95] = grid[16][96] = grid[16][108] = grid[16][108] = 1;
  grid[19][90] = grid[19][114] = 1;
  grid[20][89] = grid[20][91] = grid[20][97] = grid[20][107] = grid[20][113] = grid[20][115] = 1;
  grid[21][88] = grid[21][91] = grid[21][97] = grid[21][99] = grid[21][100] = grid[21][104] = grid[21][105] = grid[21][107] = grid[21][113] = grid[21][116] = 1;
  grid[22][89] = grid[22][90] = grid[22][101] = grid[22][103] = grid[22][114] = grid[22][115] = 1;
  grid[23][99] = grid[23][101] = grid[23][103] = grid[23][105] = 1;
  grid[24][100] = grid[24][104] = 1;
  grid[26][84] = grid[26][85] = grid[26][119] = grid[26][120] = 1;
  grid[27][84] = grid[27][85] = grid[27][119] = grid[27][120] = 1;
  grid[28][89] = grid[28][90] = grid[28][114] = grid[28][115] = 1;
  grid[30][90] = grid[30][92] = grid[30][112] = grid[30][114] = 1;
  grid[31][90] = grid[31][93] = grid[31][111] = grid[31][114] = 1;
  grid[32][91] = grid[32][92] = grid[32][112] = grid[32][113] = 1;

  grid[34][91] = grid[34][92] = grid[34][112] = grid[34][113] = 1;
  grid[35][90] = grid[35][93] = grid[35][111] = grid[35][114] = 1;
  grid[36][90] = grid[36][92] = grid[36][112] = grid[36][114] = 1;
  grid[38][89] = grid[38][90] = grid[38][114] = grid[38][115] = 1;
  grid[39][84] = grid[39][85] = grid[39][119] = grid[39][120] = 1;
  grid[40][84] = grid[40][85] = grid[40][119] = grid[40][120] = 1;
  grid[42][100] = grid[42][104] = 1;
  grid[43][99] = grid[43][101] = grid[43][103] = grid[43][105] = 1;
  grid[44][89] = grid[44][90] = grid[44][101] = grid[44][103] = grid[44][114] = grid[44][115] = 1;
  grid[45][88] = grid[45][91] = grid[45][97] = grid[45][99] = grid[45][100] = grid[45][104] = grid[45][105] = grid[45][107] = grid[45][113] = grid[45][116] = 1;
  grid[46][89] = grid[46][91] = grid[46][97] = grid[46][107] = grid[46][113] = grid[46][115] = 1;
  grid[47][90] = grid[47][114] = 1;
  grid[50][95] = grid[50][96] = grid[50][108] = grid[50][109] = 1;
  grid[51][95] = grid[51][96] = grid[51][108] = grid[51][109] = 1;


  drawGrid();
  interval = setInterval(loop, 500);
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

// Reset the grid
reset.addEventListener('click', function() {
  clearGrid();
});

// Change color schemes
color.addEventListener('click', function() {
  if (tableHolder.firstChild.classList.contains('color-scheme1')) {
    tableHolder.firstChild.classList.remove('color-scheme1');
    tableHolder.firstChild.classList.add('color-scheme2');
  } else if (tableHolder.firstChild.classList.contains('color-scheme2')) {
    tableHolder.firstChild.classList.remove('color-scheme2');
    tableHolder.firstChild.classList.add('color-scheme3');
  } else if (tableHolder.firstChild.classList.contains('color-scheme3')) {
    tableHolder.firstChild.classList.remove('color-scheme3');
    tableHolder.firstChild.classList.add('color-scheme4');
  } else if (tableHolder.firstChild.classList.contains('color-scheme4')) {
    tableHolder.firstChild.classList.remove('color-scheme4');
    tableHolder.firstChild.classList.add('color-scheme1');
  }
});
