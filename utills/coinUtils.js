export const COIN_TYPES = ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '검정', '흰색'];

export function generateRandomCoins(count = 10) {
  const coins = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * COIN_TYPES.length);
    coins.push(COIN_TYPES[randomIndex]);
  }
  return coins;
}