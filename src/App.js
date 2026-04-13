import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isJumping, setIsJumping] = useState(false);
  const [position, setPosition] = useState(0);
  const [obstacleLeft, setObstacleLeft] = useState(600);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(10);
  const [highScore, setHighScore] = useState(0);

  // Jump
  const jump = () => {
    if (isJumping || isGameOver) return;

    setIsJumping(true);
    setPosition(120);

    setTimeout(() => {
      setPosition(0);
      setIsJumping(false);
    }, 400);
  };

  // Keyboard control
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") jump();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isJumping, isGameOver]);

  // Obstacle movement + Score
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setObstacleLeft((prev) => {
        if (prev <= -50) {
          setScore((s) => s + 1);
          return 600;
        }
        return prev - speed;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameOver, speed]);

  // Speed increase (FIXED ✅)
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setSpeed((prev) => prev + 1);
    }
  }, [score]);

  // High Score update (FIXED ✅)
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  // Collision detection
  useEffect(() => {
    if (obstacleLeft > 50 && obstacleLeft < 100 && position < 50) {
      setIsGameOver(true);
    }
  }, [obstacleLeft, position]);

  // Restart
  const restartGame = () => {
    setObstacleLeft(600);
    setIsGameOver(false);
    setScore(0);
    setSpeed(10);
  };

  return (
    <div className="game" onClick={jump}>
      <h1>🏃 Runner Game</h1>

      <h2>Score: {score} | High Score: {highScore}</h2>

      <div
        className="character"
        style={{ bottom: position + "px" }}
      ></div>

      <div
        className="obstacle"
        style={{ left: obstacleLeft + "px" }}
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