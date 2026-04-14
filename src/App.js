import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

// 🔊 Sounds
import coinSound from "./assets/coin.mp3";
import hitSound from "./assets/hit.mp3";
// jumpSound removed (unused error avoid)

// 🖼️ Images
import playerImg from "./assets/player.png";
import carImg from "./assets/car.png";
import barrierImg from "./assets/barrier.png";

function App() {
  // 🎮 Player
  const [lane, setLane] = useState(1);
  const [isJumping, setIsJumping] = useState(false);

  // 🚧 Obstacle
  const [obstacleLane, setObstacleLane] = useState(1);
  const [obstacleTop, setObstacleTop] = useState(-60);
  const [obstacleType, setObstacleType] = useState(carImg);

  // 🪙 Coins
  const [coinLane, setCoinLane] = useState(1);
  const [coinTop, setCoinTop] = useState(-120);
  const [coins, setCoins] = useState(0);

  // ⚡ Power Ups
  const [powerLane, setPowerLane] = useState(1);
  const [powerTop, setPowerTop] = useState(-180);
  const [hasShield, setHasShield] = useState(false);
  const [isSpeedBoost, setIsSpeedBoost] = useState(false);

  // 🎯 Game
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const PLAYER_SIZE = 50;
  const OBJECT_SIZE = 50;

  // 🦘 Jump (FIXED with useCallback)
  const jump = useCallback(() => {
    if (isJumping || isGameOver) return;

    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 400);
  }, [isJumping, isGameOver]);

  // 🎮 Keyboard Controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "ArrowLeft" && lane > 0) setLane((p) => p - 1);
      if (e.code === "ArrowRight" && lane < 2) setLane((p) => p + 1);
      if (e.code === "Space") jump();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lane, jump]);

  // 📱 Swipe Controls
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50 && lane > 0) setLane((p) => p - 1);
        else if (diffX < -50 && lane < 2) setLane((p) => p + 1);
      } else {
        if (diffY > 50) jump();
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [lane, jump]);

  // 🚧 Obstacle movement
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setObstacleTop((prev) => {
        if (prev > 400) {
          setScore((s) => s + 1);
          setObstacleLane(() => Math.floor(Math.random() * 3));
          setObstacleType(Math.random() > 0.5 ? carImg : barrierImg);
          return -60;
        }
        return prev + (isSpeedBoost ? 15 : 10);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameOver, isSpeedBoost]);

  // 🪙 Coin movement
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setCoinTop((prev) => {
        if (prev > 400) {
          setCoinLane(Math.floor(Math.random() * 3));
          return -120;
        }
        return prev + 8;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameOver]);

  // ⚡ Power movement
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setPowerTop((prev) => {
        if (prev > 400) {
          setPowerLane(Math.floor(Math.random() * 3));
          return -180;
        }
        return prev + 7;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isGameOver]);

  // 🪙 Coin collision
  useEffect(() => {
    const playerBottom = isJumping ? 120 : 0;
    const playerTop = playerBottom + PLAYER_SIZE;

    const coinBottom = 400 - coinTop;
    const coinTopPos = coinBottom + OBJECT_SIZE;

    const isTouching =
      coinLane === lane &&
      coinBottom < playerTop &&
      coinTopPos > playerBottom;

    if (isTouching && !isGameOver) {
      new Audio(coinSound).play();
      setCoins((c) => c + 1);
      setCoinTop(-120);
    }
  }, [coinTop, coinLane, lane, isJumping, isGameOver]);

  // ⚡ Power collision
  useEffect(() => {
    const playerBottom = isJumping ? 120 : 0;
    const playerTop = playerBottom + PLAYER_SIZE;

    const powerBottom = 400 - powerTop;
    const powerTopPos = powerBottom + OBJECT_SIZE;

    const isTouching =
      powerLane === lane &&
      powerBottom < playerTop &&
      powerTopPos > playerBottom;

    if (isTouching && !isGameOver) {
      if (Math.random() > 0.5) {
        setHasShield(true);
        setTimeout(() => setHasShield(false), 5000);
      } else {
        setIsSpeedBoost(true);
        setTimeout(() => setIsSpeedBoost(false), 5000);
      }
      setPowerTop(-180);
    }
  }, [powerTop, powerLane, lane, isJumping, isGameOver]);

  // 💥 Obstacle collision
  useEffect(() => {
    const playerBottom = isJumping ? 120 : 0;
    const playerTop = playerBottom + PLAYER_SIZE;

    const obstacleBottom = 400 - obstacleTop;
    const obstacleTopPos = obstacleBottom + OBJECT_SIZE;

    const isTouching =
      obstacleLane === lane &&
      obstacleBottom < playerTop &&
      obstacleTopPos > playerBottom;

    if (isTouching && !isGameOver) {
      if (hasShield) {
        setHasShield(false);
      } else {
        new Audio(hitSound).play();
        setIsGameOver(true);
      }
    }
  }, [obstacleTop, obstacleLane, lane, isJumping, isGameOver, hasShield]);

  // 🔄 Restart
  const restartGame = () => {
    setLane(1);
    setObstacleTop(-60);
    setCoinTop(-120);
    setPowerTop(-180);
    setCoins(0);
    setScore(0);
    setHasShield(false);
    setIsSpeedBoost(false);
    setIsGameOver(false);
  };

  return (
    <div className="game">
      <div className="score">
        Score: {score} | Coins: {coins}
      </div>

      <div className="status">
        {hasShield && "🛡️ Shield "}
        {isSpeedBoost && "⚡ Speed"}
      </div>

      {/* Player */}
      <img
        src={playerImg}
        alt="player"
        className="player"
        style={{
          left: `${lane * 33 + 10}%`,
          bottom: isJumping ? "120px" : "0px",
        }}
      />

      {/* Obstacle */}
      <img
        src={obstacleType}
        alt="obstacle"
        className="obstacle"
        style={{
          left: `${obstacleLane * 33 + 10}%`,
          top: obstacleTop + "px",
        }}
      />

      {/* Coin */}
      <div
        className="coin"
        style={{
          left: `${coinLane * 33 + 10}%`,
          top: coinTop + "px",
        }}
      ></div>

      {/* Power */}
      <div
        className="power"
        style={{
          left: `${powerLane * 33 + 10}%`,
          top: powerTop + "px",
        }}
      ></div>

      {isGameOver && (
        <div className="game-over">
          <h2>Game Over </h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default App;