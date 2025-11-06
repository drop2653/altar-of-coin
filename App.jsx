import React, { useState } from 'react';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import { generateRandomCoins } from './utils/coinUtils';

function App() {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerData, setPlayerData] = useState({});

  const handleStartGame = () => {
    const updatedData = {};
    players.forEach((player) => {
      updatedData[player.id] = {
        coins: generateRandomCoins(10),
        alive: true,
      };
    });

    setPlayerData(updatedData);
    setGameStarted(true);
  };

  return (
    <div>
      {!gameStarted ? (
        <Lobby
          players={players}
          setPlayers={setPlayers}
          onStartGame={handleStartGame}
        />
      ) : (
        <GameRoom
          players={players}
          playerData={playerData}
          setPlayerData={setPlayerData}
        />
      )}
    </div>
  );
}

export default App;