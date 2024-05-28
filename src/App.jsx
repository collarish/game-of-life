import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

const COLUMNS = 40;
const ROWS = 40;
const DELAY = 50;
const NEIGHBOR_POSITIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
];

const preset = [
  { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 6 },
  { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 },
  { x: 12, y: 4 }, { x: 12, y: 8 },
  { x: 13, y: 3 }, { x: 13, y: 9 },
  { x: 14, y: 3 }, { x: 14, y: 9 },
  { x: 15, y: 6 },
  { x: 16, y: 4 }, { x: 16, y: 8 },
  { x: 17, y: 5 }, { x: 17, y: 6 }, { x: 17, y: 7 },
  { x: 18, y: 6 },
  { x: 21, y: 3 }, { x: 21, y: 4 }, { x: 21, y: 5 },
  { x: 22, y: 3 }, { x: 22, y: 4 }, { x: 22, y: 5 },
  { x: 23, y: 2 }, { x: 23, y: 6 },
  { x: 25, y: 1 }, { x: 25, y: 2 }, { x: 25, y: 6 }, { x: 25, y: 7 },
  { x: 35, y: 3 }, { x: 35, y: 4 },
  { x: 36, y: 3 }, { x: 36, y: 4 },
];

const DragContext = createContext({
  isDragging: false,
  startDragging: () => {},
  stopDragging: () => {}
});

function App() {
  const [grid, setGrid] = useState(emptyGrid());
  const [running, setRunning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = {
    isDragging,
    startDragging: () => setIsDragging(true),
    stopDragging: () => setIsDragging(false),
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (running) moveToNextStep(setGrid);
    }, DELAY);
    return () => clearInterval(intervalId);
  }, [running]);

  const handleCellInteraction = (toggleCell) => {
    setRunning(false);
    toggleCell();
  };

  return (
    <DragContext.Provider value={dragState}>
      <div className="App">
        <div className='grid' style={{ display: 'grid', gridTemplateColumns: `repeat(${COLUMNS}, 20px)` }}>
          {grid.map((row, x) => row.map((cell, y) => (
            <Cell key={`${x}-${y}`} x={x} y={y} setGrid={setGrid} isAlive={cell.isAlive} onInteraction={handleCellInteraction} />
          )))}
        </div>
        <button onClick={() => setGrid(applyPreset)}>use preset</button>
        <button onClick={() => setRunning(!running)}>{running ? "stop" : "start"}</button>
        <button onClick={() => setGrid(emptyGrid)}>clear</button>
      </div>
    </DragContext.Provider>
  );
}

function moveToNextStep(setGrid) {
  setGrid(currentGrid => {
    const nextGeneration = currentGrid.map((row, x) =>
      row.map((cell, y) => {
        const neighbors = NEIGHBOR_POSITIONS.map(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          return (nx >= 0 && nx < COLUMNS && ny >= 0 && ny < ROWS) ? currentGrid[nx][ny] : null;
        }).filter(n => n);
        const aliveNeighbors = neighbors.filter(n => n.isAlive).length;
        const shouldLive = cell.isAlive ? (aliveNeighbors === 2 || aliveNeighbors === 3) : aliveNeighbors === 3;
        return { ...cell, isAlive: shouldLive };
      })
    );
    return nextGeneration;
  });
}

function emptyGrid() {
  return Array.from({ length: COLUMNS }, () => Array.from({ length: ROWS }, () => ({ isAlive: false })));
}

function applyPreset(currentGrid) {
  return currentGrid.map((row, x) => row.map((cell, y) => {
    return preset.some(p => p.x === x && p.y === y) ? { ...cell, isAlive: true } : cell;
  }));
}

function Cell({ x, y, setGrid, isAlive, onInteraction }) {
  const { isDragging, startDragging, stopDragging } = useContext(DragContext);

  const toggleCell = () => {
    setGrid(currentState => {
      return currentState.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          if (rowIndex === x && colIndex === y) {
            return { ...cell, isAlive: !cell.isAlive };
          }
          return cell;
        });
      });
    });
  };

  return (
    <div
      className='cell'
      onMouseDown={(e) => {
        e.preventDefault(); 
        startDragging();
        onInteraction(toggleCell);
      }}
      onMouseEnter={() => {
        if (isDragging) {
          onInteraction(toggleCell);
        }
      }}
      onMouseUp={() => stopDragging()}
      onDragStart={(e) => e.preventDefault()} 
      style={{ cursor: 'pointer' }}
    >
      {isAlive ? "⭐" : "."}
    </div>
  );
}

export default App;
