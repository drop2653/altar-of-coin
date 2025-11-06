import React, { useState } from 'react';
import { COIN_TYPES } from '../utils/coinUtils';

const TradeMarket = ({ playerId, trades, setTrades, playerData, setPlayerData }) => {
  const [sellType, setSellType] = useState(COIN_TYPES[0]);
  const [sellCount, setSellCount] = useState(1);
  const [buyType, setBuyType] = useState(COIN_TYPES[1]);
  const [buyCount, setBuyCount] = useState(1);

  const handleAddTrade = () => {
    const seller = playerData[playerId];
    const sellerHas = seller.coins.filter(c => c === sellType).length;

    if (sellCount > sellerHas) {
      alert(`등록 실패: ${sellType} 코인을 ${sellCount}개 가지고 있지 않습니다.`);
      return;
    }

    const newTrade = {
      id: Date.now(),
      sellerId: playerId,
      sell: { type: sellType, count: sellCount },
      buy: { type: buyType, count: buyCount },
    };

    setTrades((prev) => [...prev, newTrade]);
  };

  const handleAcceptTrade = (trade) => {
    const buyer = playerData[playerId];
    const seller = playerData[trade.sellerId];

    const buyerHas = buyer.coins.filter(c => c === trade.buy.type).length;
    const sellerHas = seller.coins.filter(c => c === trade.sell.type).length;

    if (buyerHas < trade.buy.count) {
      alert('수락 실패: 구매자가 원하는 코인을 가지고 있지 않습니다.');
      return;
    }

    if (sellerHas < trade.sell.count) {
      alert('수락 실패: 판매자가 이미 코인을 잃어버렸습니다.');
      return;
    }

    const newBuyerCoins = [
      ...buyer.coins.filter(c => c !== trade.buy.type).slice(0, buyer.coins.length - trade.buy.count),
      ...Array(trade.sell.count).fill(trade.sell.type)
    ];

    const newSellerCoins = [
      ...seller.coins.filter(c => c !== trade.sell.type).slice(0, seller.coins.length - trade.sell.count),
      ...Array(trade.buy.count).fill(trade.buy.type)
    ];

    setPlayerData(prev => ({
      ...prev,
      [playerId]: { ...buyer, coins: newBuyerCoins },
      [trade.sellerId]: { ...seller, coins: newSellerCoins },
    }));

    setTrades(prev => prev.filter(t => t.id !== trade.id));
  };

  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginTop: '1rem' }}>
      <h3>🛒 거래소</h3>

      <div>
        <h4>📤 내 거래 등록</h4>
        <label>
          판매 코인:
          <select value={sellType} onChange={(e) => setSellType(e.target.value)}>
            {COIN_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" min="1" value={sellCount} onChange={(e) => setSellCount(Number(e.target.value))} />
        </label>

        <label>
          원하는 코인:
          <select value={buyType} onChange={(e) => setBuyType(e.target.value)}>
            {COIN_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" min="1" value={buyCount} onChange={(e) => setBuyCount(Number(e.target.value))} />
        </label>

        <button onClick={handleAddTrade}>등록</button>
      </div>

      <div>
        <h4>📃 현재 거래 목록</h4>
        <ul>
          {trades.map((t) => (
            <li key={t.id}>
              판매자 #{t.sellerId} →
              {t.sell.type} {t.sell.count}개 ↔ {t.buy.type} {t.buy.count}개
              {t.sellerId !== playerId && (
                <button onClick={() => handleAcceptTrade(t)}>수락</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TradeMarket;