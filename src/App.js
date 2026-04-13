import React, { useEffect, useState } from "react";
import "./App.css";

import player from "./assets/player.png";
import ob1 from "./assets/ob1.png";
import ob2 from "./assets/ob2.png";

import jumpSound from "./assets/jump.mp3";
import hitSound from "./assets/hit.mp3";

function App() {
  const [isJumping, setIsJumping] = useState(false);
  const [position, setPosition] = useState(0);
  const [obstacleLeft, setObstacleLeft] = useState(600);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(10);
  const [obstacleType, setObstacleType] = useState(ob1);
  const [highScore, setHighScore] = useState(0);

  const jumpAudio = new Audio(jumpSound);
  const hitAudio = new Audio(hitSound);

  // Jump
  const jump = () => {
    if (isJumping || isGameOver) return;

    jumpAudio.play();

    setIsJumping(true);
    setPosition(120);

    setTimeout(() => {
      setPosition(0);
      setIsJumping(false);
    }, 400);
  };

  // Key press
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") jump();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isJumping, isGameOver]);

  // Obstacle movement + random + score
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setObstacleLeft((prev) => {
        if (prev <= -50) {
          setScore((s) => s + 1);

          // random obstacle
          setObstacleType(Math.random() > 0.5 ? ob1 : ob2);

          return 600;
        }
        return prev - speed;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameOver, speed]);

  // Speed increase
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setSpeed((s) => s + 1);
    }
  }, [score]);

  // Collision
  useEffect(() => {
    if (obstacleLeft > 50 && obstacleLeft < 100 && position < 50) {
      hitAudio.play();
      setIsGameOver(true);

      if (score > highScore) {
        setHighScore(score);
      }
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

      <img
        src={player}
        className="character"
        style={{ bottom: position + "px" }}
        alt="player"
      />

      <img
        src={obstacleType}
        className="obstacle"
        style={{ left: obstacleLeft + "px" }}
        alt="obstacle"
      />

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