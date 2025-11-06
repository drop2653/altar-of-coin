import React, { useState } from 'react';

const Lobby = ({ players, setPlayers, onStartGame }) => {
  const [nickname, setNickname] = useState('');
  const [isReady, setIsReady] = useState(false);

  const handleJoin = () => {
    if (!nickname) return;
    const newPlayer = {
      id: Date.now(),
      nickname,
      ready: false
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const handleReady = () => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.nickname === nickname ? { ...p, ready: true } : p
      )
    );
    setIsReady(true);
  };

  // 모든 플레이어가 준비 완료 시 게임 시작
  React.useEffect(() => {
    if (players.length > 0 && players.every((p) => p.ready)) {
      onStartGame();
    }
  }, [players]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🔔 알터 오브 코인 - 로비</h2>

      {!nickname && (
        <>
          <input
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={handleJoin}>입장</button>
        </>
      )}

      {nickname && !isReady && (
        <button onClick={handleReady}>✅ 준비 완료</button>
      )}

      <h3>참가자 목록 ({players.length}명)</h3>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.nickname} {p.ready ? '🟢 Ready' : '🔴 대기 중'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;