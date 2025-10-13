import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import getLinePoints from "../utils/getLinePoints.js";

function Cell({ position, filled, previewed, onClick, onHover }) {
    const color = filled ? "#cccccc" : previewed ? "#dcdcdc" : "#888888";

    return (
        <mesh
            position={position}
            onClick={onClick}
            onPointerOver={onHover}
        >
            <boxGeometry args={[0.9, 0.9, 0.2]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

function Grid3D() {
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
                cells.forEach(([r, c]) => (newGrid[r][c] = true));
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
        } else setPreview([]);
    };

    const isPreviewed = (row, col) =>
        preview.some(([r, c]) => r === row && c === col);

    // Calculate grid offset so it’s centered
    const offset = (size - 1) / 2;

    return (
        <Canvas
            camera={{ position: [0, 0, 15], fov: 50 }}
            style={{ width: "100vw", height: "100vh", background: "#0f172a" }}
        >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} />
            <OrbitControls enableRotate={false} enablePan={false} />

            {grid.map((row, i) =>
                row.map((col, j) => (
                    <Cell
                        key={`${i}-${j}`}
                        position={[j - offset, offset - i, 0]}
                        filled={col}
                        previewed={isPreviewed(i, j)}
                        onClick={() => handleClick(i, j)}
                        onHover={() => handleHover(i, j)}
                    />
                ))
            )}
        </Canvas>
    );
}

export default Grid3D;
