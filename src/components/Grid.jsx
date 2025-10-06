import React, { useState, useEffect } from "react";
import styles from "../styles/App.module.css";
import getLinePoints from "../utils/getLinePoints.js";

function Grid() {
    const size = 8;

    const [grid, setGrid] = useState(
        Array.from({ length: size }, () => Array(size).fill(false))
    );

    const [points, setPoints] = useState([]);
    const [preview, setPreview] = useState([]);

    useEffect(() => {
        if (points.length === 2) {
            const [p1, p2] = points;
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(row => [...row]);
                const cells = getLinePoints(p1, p2);
                cells.forEach(([r, c]) => {
                    newGrid[r][c] = true;
                });
                return newGrid;
            });
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

export default Grid;
