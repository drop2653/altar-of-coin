import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { COIN_TYPES } from '../utils/coinUtils';
import TradeMarket from './TradeMarket';
import { groupByCoinType } from '../utils/coinUtils';

const getRandomTribute = (round) => {
  const tribute = [];
  for (let i = 0; i < round; i++) {
    const rand = Math.floor(Math.random() * COIN_TYPES.length);
    tribute.push(COIN_TYPES[rand]);
  }
  return tribute;
};

const GameRoom = ({ players, playerData, setPlayerData }) => {
  const [round, setRound] = useState(1);
  const [seconds, setSeconds] = useTimer(180, () => handleRoundEnd());
  const [auctionItems, setAuctionItems] = useState([]); // 경매 풀
  const [tributes, setTributes] = useState({});
  const [trades, setTrades] = useState([]);
  const [currentAuctionIndex, setCurrentAuctionIndex] = useState(0); // 경매 중인 아이템 번호
const [bidders, setBidders] = useState([]); // 아직 경매에 참여 중인 플레이어 id
const [currentBid, setCurrentBid] = useState(0); // 현재 입찰 금액
const [currentBidderId, setCurrentBidderId] = useState(null); // 현재 최고 입찰자
const [turnIndex, setTurnIndex] = useState(0); // 경매 턴 진행 순서 인덱스


const nextTurn = () => {
  setTurnIndex((prev) => (prev + 1) % bidders.length);
};
useEffect(() => {
  if (auctionItems.length > 0 && currentAuctionIndex < auctionItems.length) {
    const item = auctionItems[currentAuctionIndex];
    console.log(`🎯 경매 시작: ${item.type} ${item.count}개`);
  }
}, [currentAuctionIndex]);

  // 라운드 시작 시 공물 재설정
  useEffect(() => {
    const newTributes = {};
    players.forEach((p) => {
      newTributes[p.id] = getRandomTribute(round);
    });
    setTributes(newTributes);
  }, [round]);

  const handleRoundEnd = () => {
    console.log(`⛩️ 라운드 ${round} 종료 - 공물 결산 시작`);
    const updatedData = { ...playerData };
    const collectedTributes = [];

    players.forEach((player) => {
      const pid = player.id;
      const tribute = tributes[pid];
      const coins = updatedData[pid].coins;
      const newCoins = [...coins];
      let canPay = true;

      // 공물 납부 처리
      tribute.forEach((type) => {
        const index = newCoins.findIndex((c) => c === type);
        if (index !== -1) {
          newCoins.splice(index, 1); // 납부 성공 → 제거
          collectedTributes.push(type); // 제단에 수거
        } else {
          canPay = false; // 낼 수 없는 경우
        }
      });

      if (canPay) {
        updatedData[pid].coins = newCoins;
        console.log(`🙏 ${player.nickname} 공물 납부 완료`);
      } else {
        updatedData[pid].alive = false;
        updatedData[pid].coins = [];
        console.log(`💀 ${player.nickname} 탈락`);
      }
    });

    setPlayerData(updatedData);

    const survivors = players.filter((p) => updatedData[p.id].alive !== false);

    if (survivors.length <= 1) {
      const winner = survivors[0];
      setTimeout(() => {
        alert(winner ? `🎉 ${winner.nickname} 승리!` : '모두 탈락했습니다!');
      }, 100);
      return;
    }

    // 다음 라운드로 전환
    setRound((r) => r + 1);
    setSeconds(180);

    // collectedTributes → 경매 아이템으로 변환
const auctionList = groupByCoinType(collectedTributes);
setAuctionItems(auctionList);

// 경매 준비 중 메시지 띄울 수도 있음
console.log('📦 이번 라운드 경매 아이템:', auctionList);

// 경매 초기화
setAuctionItems(auctionList);
setCurrentAuctionIndex(0);
setBidders(
  players.filter((p) => updatedPlayerData[p.id].alive !== false).map((p) => p.id)
);
setCurrentBid(0);
setCurrentBidderId(null);
setTurnIndex(0);

  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🌀 라운드 {round}</h2>
      <h3>⏱️ 남은 시간: {seconds}초</h3>

      <h4>⛩️ 제단의 공물</h4>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.nickname}: {tributes[p.id]?.join(', ') || '생성 중...'}
          </li>
        ))}
      </ul>

      <h4>🎒 보유 코인</h4>
      <ul>
        {players.map((p) => {
          const pdata = playerData[p.id];
          return (
            <li key={p.id}>
              {p.nickname} - {pdata?.alive === false ? '💀 탈락' : `${pdata?.coins.length || 0}개`}
            </li>
          );
        })}
      </ul>

      <h4>📦 이번 라운드 경매 예정 아이템</h4>
<ul>
  {auctionItems.map((item, idx) => (
    <li key={idx}>
      {item.type} x {item.count}개
    </li>
  ))}
</ul>

      {/* 현재 사용자: 첫 번째 플레이어로 가정 */}
      {players[0] && playerData[players[0].id]?.alive !== false && (
        <TradeMarket
          playerId={players[0].id}
          trades={trades}
          setTrades={setTrades}
          playerData={playerData}
          setPlayerData={setPlayerData}
        />
      )}
      {auctionItems.length > 0 && currentAuctionIndex < auctionItems.length && (
  <div style={{ marginTop: '2rem', border: '2px dashed #aaa', padding: '1rem' }}>
    <h3>⚔️ 경매 중: {auctionItems[currentAuctionIndex].type} x {auctionItems[currentAuctionIndex].count}개</h3>
    <p>💰 현재 입찰가: {currentBid} (by #{currentBidderId || '없음'})</p>
    <p>🎯 턴: {players.find(p => p.id === bidders[turnIndex])?.nickname || '---'}</p>

    {/* 현재 턴인 유저만 입찰 UI 표시 */}
    {players[0]?.id === bidders[turnIndex] && (
      <div>
     <button
  onClick={() => {
    const myCoins = playerData[players[0].id].coins.length;
    if (myCoins <= currentBid) {
      alert('입찰할 수 없습니다. 코인 부족!');
      return;
    }

    const newBid = currentBid + 1;

    setCurrentBid(newBid);
    setCurrentBidderId(players[0].id);
    console.log(`💰 현재 입찰가: ${newBid} by ${players[0].nickname}`);

    nextTurn();
  }}
>
  ➕ 입찰 (+1)
        </button>
        <button
          onClick={() => {
            const newBidders = bidders.filter((id) => id !== players[0].id);
            setBidders(newBidders);

            // 입찰자가 1명 남았으면 낙찰
            if (newBidders.length === 1) {
              const winnerId = newBidders[0];
              const winner = playerData[winnerId];

              const newCoins = [
  ...winner.coins.slice(0, winner.coins.length - currentBid),
  ...Array(auctionItems[currentAuctionIndex].count).fill(auctionItems[currentAuctionIndex].type)
];
              setPlayerData((prev) => ({
                ...prev,
                [winnerId]: { ...winner, coins: newCoins },
              }));

              alert(
                `🎉 ${players.find((p) => p.id === winnerId).nickname}님이 ${auctionItems[currentAuctionIndex].type} ${auctionItems[currentAuctionIndex].count}개를 낙찰받았습니다!`
              );

              if (currentAuctionIndex + 1 >= auctionItems.length) {
  // 경매 종료 → 다음 라운드
  console.log('📦 모든 경매 종료 → 다음 라운드 시작');

  setTimeout(() => {
    setRound((r) => r + 1);
    setSeconds(180); // 3분 타이머 재시작
    setAuctionItems([]);
    setCurrentAuctionIndex(0);
    setBidders([]);
    setCurrentBid(0);
    setCurrentBidderId(null);
    setTurnIndex(0);
  }, 500);
} else {
  // 다음 아이템 경매로 이동
  setCurrentAuctionIndex((i) => i + 1);
  setCurrentBid(0);
  setCurrentBidderId(null);
  setBidders(
    players.filter((p) => playerData[p.id]?.alive !== false).map((p) => p.id)
  );
  setTurnIndex(0);
}


              // 다음 경매 아이템으로 넘어감
              setCurrentAuctionIndex((i) => i + 1);
              setCurrentBid(0);
              setCurrentBidderId(null);
              setBidders(
                players.filter((p) => playerData[p.id]?.alive !== false).map((p) => p.id)
              );
              setTurnIndex(0);
            } else {
              nextTurn();
            }
          }}
        >
          ❌ 패스
        </button>
      </div>
    )}
  </div>
)}

      
    </div>
  );
};

export default GameRoom;