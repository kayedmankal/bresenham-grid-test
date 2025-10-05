import React, { useState, useEffect } from "react";
import styles from "./App.module.css"; // CSS Module

function App() {
    const size = 8;

    const [grid, setGrid] = useState(
        Array.from({ length: size }, () => Array(size).fill(false))
    );

    const [points, setPoints] = useState([]);
    const [preview, setPreview] = useState([]);

    useEffect(() => {
        if (points.length === 2) {
            const [p1, p2] = points;
            const newGrid = grid.map(row => [...row]);
            const cells = getLinePoints(p1, p2);
            cells.forEach(([r, c]) => {
                newGrid[r][c] = true;
            });
            setGrid(newGrid);
            setPoints([]);
            setPreview([]);
        }
    }, [points]);

    const handleClick = (row, col) => {
        setPoints(prev => {
            if (prev.length === 2) return [[row, col]];
            return [...prev, [row, col]];
        });
        setPreview([]);
    };

    const handleHover = (row, col) => {
        if (points.length === 1) {
            const [p1] = points;
            const cells = getLinePoints(p1, [row, col]);
            setPreview(cells);
        } else {
            setPreview([]);
        }
    };

    const isPreviewed = (row, col) =>
        preview.some(([r, c]) => r === row && c === col);

    return (
        <div className={styles.wrapper}>
            <div className={styles.grid}>
                {grid.map((row, i) =>
                    row.map((col, j) => {
                        const filled = col;
                        const previewed = isPreviewed(i, j);
                        const color = filled
                            ? "#cccccc"
                            : previewed
                                ? "#dcdcdc"
                                : "#aaaaaa";

                        return (
                            <label
                                key={`${i}-${j}`}
                                className={styles.cell}
                                style={{ backgroundColor: color }}
                                onMouseEnter={() => handleHover(i, j)}
                            >
                                <input
                                    type="checkbox"
                                    checked={filled}
                                    className={styles.checkbox}
                                    onChange={() => handleClick(i, j)}
                                />
                            </label>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function getLinePoints([x0, y0], [x1, y1]) {
    const points = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;
    while (true) {
        points.push([x, y]);
        if (x === x1 && y === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
    return points;
}

export default App;
