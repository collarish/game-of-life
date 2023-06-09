import React, { useState, useEffect } from 'react'
import './App.css'

const columns = 40;
const rows = 40;
const delay = 50;

function App() {

  const [grid, setGrid] = useState(emptyGrid(columns, rows));
  const [running, setRunning] = useState(false);

  const preset = [
    { x: 21, y: 17, isAlive: true },
    { x: 22, y: 17, isAlive: true },
    { x: 23, y: 17, isAlive: true },
    { x: 23, y: 18, isAlive: true },
    { x: 23, y: 19, isAlive: true },
    { x: 22, y: 19, isAlive: true },
    { x: 21, y: 19, isAlive: true },
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (running)
        moveToNextStep(setGrid);
    }, delay);
    return () => {
      clearInterval(intervalId);
    };
  }, [running]);


  return (
    <div className="App">
      <div className='grid'
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 20px)`
        }}
      >
        {grid.map((row, x) =>
          row.map((cell, y) =>
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              setGrid={setGrid}
              isAlive={cell.isAlive}
            />
          )
        )}

      </div>
      {/* <button onClick={() => { moveToNextStep(setGrid); }
      }
      >next gen
      </button> */}
      <button

        onClick={() => {
          const empty = emptyGrid(columns, rows);
          debugger;
          const presetGrid = empty.map((row, x) =>
            row.map((cell, y) => {
              debugger;
              if (preset.some(presetCell => (presetCell.x == x && presetCell.y == y))) {
                return { ...cell, isAlive: true };
              }
              return cell;
            }
            )
          );
          setGrid(presetGrid);
        }}
      >
        use preset</button>
      <button
        onClick={() => {
          return setRunning(!running)
        }}
      >{running ? "stop" : "start"}</button>
      <button
        onClick={() => {
          setGrid(emptyGrid(columns, rows))
        }}
      >clear</button>
    </div >
  )
}

function moveToNextStep(setGrid) {
  setGrid(currentGrid => {
    //array of elements of type {cell: {isAlive: Boolean}, x: Number, y: Number}
    const cellsToKill = [];

    const nextGeneration =
      currentGrid.map((row, x) =>
        row.map((cell, y) => {

          const neighbors = neighborPositions.map(([x1, y1]) => {
            const x2 = x + x1;
            const y2 = y + y1;
            if (x2 >= 0 && x2 < columns && y2 >= 0 && y2 < rows) {
              return { cell: currentGrid[x2][y2], x: x2, y: y2 };
            }
            return null;
          }).filter(x => x != null);


          const aliveNeighbors = neighbors.filter(n => n.cell.isAlive);
          const aliveNeighborCount = aliveNeighbors.length;


          if (cell.isAlive) {
            // debugger;
            if (aliveNeighborCount === 2) {
              const random = Math.random();
              const killNeighborIndex = random >= 0.5 ? 1 : 0;
              const neighborToKill = aliveNeighbors[killNeighborIndex];

              cellsToKill.push(neighborToKill);
            }
            return aliveNeighborCount === 2 || aliveNeighborCount === 3
              // 1. Pokud v sousedících buňkách kolem organizmu existují dva nebo tři další organizmy, může organizmus přežít
              ? { ...cell, isAlive: true }
              // 2. Pokud v sousedících buňkách kolem organizmu existují čtyři nebo více dalších organizmů, tak organizmus zanikne
              // 3. Pokud v sousedících buňkách kolem organizmu existují méně jak dva další organizmy, tak organizmus zanikne
              : { ...cell, isAlive: false }
          }

          return aliveNeighborCount === 3
            // 4. Pokud obklopují přesně tři organizmy stejnou buňku, tak v ní může vzniknout nový organizmus
            ? { ...cell, isAlive: true }
            // jinak nekromancie nefunguje
            : { ...cell, isAlive: false }
        }
        )
      );

    nextGeneration.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cellsToKill.some((cellsToKillElement) => (cellsToKillElement.x == x && cellsToKillElement.y == y))) {
          //uncomment for CoinFlipDeath rule = Pokud přesně dva organizmy obklopují stejnou buňku, jeden z nich musí zaniknout (náhodný výběr)
          // cell.isAlive = false;
        }
      })
    })

    return nextGeneration;

  });
}

function emptyGrid(columns, rows) {
  const grid = [];

  for (let x = 0; x < columns; x++) {
    grid.push([]);
    for (let y = 0; y < rows; y++) {
      grid[x].push({ isAlive: false })
    }
  }
  return grid
}

function Cell(props) {
  const x = props.x;
  const y = props.y;
  const position = (`x:${x},y:${y}`);
  const setGrid = props.setGrid;
  const isAlive = props.isAlive;

  return (
    <div className='cell'

      onClick={() => {
        // console.log(position);
        setGrid(currentState => {

          const updatedState = currentState.map((row, x1) => {
            return row.map((cell, y1) => {
              return (x1 === x && y1 === y) ? { ...cell, isAlive: !cell.isAlive } : cell

            })
          });
          return updatedState;
        })
      }
      }
    >
      {isAlive ? "⭐" : "."}
    </div >
  )
}



const neighborPositions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
]



export default App
