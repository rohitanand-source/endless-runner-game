import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [lane, setLane] = useState(1); // 0 left, 1 center, 2 right
  const [isJumping, setIsJumping] = useState(false);
  const [obstacleLane, setObstacleLane] = useState(1);
  const [obstacleTop, setObstacleTop] = useState(-50);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Move Left/Right
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "ArrowLeft" && lane > 0) {
        setLane((prev) => prev - 1);
      }
      if (e.code === "ArrowRight" && lane < 2) {
        setLane((prev) => prev + 1);
      }
      if (e.code === "Space") {
        jump();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lane]);

  // Jump
  const jump = () => {
    if (isJumping) return;
    setIsJumping(true);

    setTimeout(() => setIsJumping(false), 400);
  };

  // Obstacle Movement
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setObstacleTop((prev) => {
        if (prev > 350) {
          setScore((s) => s + 1);
          setObstacleLane(Math.floor(Math.random() * 3));
          return -50;
        }
        return prev + 10;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameOver]);

  // Collision
  useEffect(() => {
    if (
      obstacleTop > 250 &&
      obstacleTop < 300 &&
      obstacleLane === lane &&
      !isJumping
    ) {
      setIsGameOver(true);
    }
  }, [obstacleTop, lane, isJumping]);

  // Restart
  const restartGame = () => {
    setLane(1);
    setObstacleTop(-50);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="game">
      <h1>🏃 Subway Runner</h1>
      <h2>Score: {score}</h2>

      {/* Player */}
      <div
        className="player"
        style={{
          left: `${lane * 33 + 10}%`,
          bottom: isJumping ? "120px" : "0px",
        }}
      ></div>

      {/* Obstacle */}
      <div
        className="obstacle"
        style={{
          left: `${obstacleLane * 33 + 10}%`,
          top: obstacleTop + "px",
        }}
      ></div>

      {isGameOver && (
        <div className="game-over">
          <h2>Game Over 😢</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default App;