import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [error, setError] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        {
          method: 'GET',
          headers: { 
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-5AytKis5zxo5dm784ZU4PSED'
          }
        }
      );
      const data = await res.json();
      console.log("Coin Data:", data); // 👈 Debug
      if (data.error) throw new Error(data.error);
      setCoinData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name.toLowerCase()}&days=10&interval=daily`,
        {
          method: 'GET',
          headers: { 
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-5AytKis5zxo5dm784ZU4PSED'
          }
        }
      );
      const data = await res.json();
      console.log("Historical Data:", data); // 👈 Debug
      if (data.error) throw new Error(data.error);
      setHistoricalData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency, coinId]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (coinData && historicalData) {
    return (
      <div className='coin'>
        <div className='coin-name'>
          <img src={coinData.image?.large} alt={coinData.name || "Coin"} /> 
          <p><b>{coinData.name} ({coinData.symbol?.toUpperCase()})</b></p>
        </div>
        <div className="coin-chart">
          <LineChart historicalData={historicalData} />
        </div>
           <div className="coin-info">
            <ul>
              <li>
                Crypto Market Rank
              </li>
              <li> {coinData.market_cap_rank}</li>
            </ul>
            <ul>
              <li>
                Current Price
              </li>
              <li>{currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}</li>
            </ul>

             <ul>
              <li>
                Market cap
              </li>
              <li>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
            </ul>

             <ul>
              <li>
               24 Hour high
              </li>
              <li>{currency.symbol} {coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
            </ul>


              <ul>
              <li>
               24 Hour low
              </li>
              <li>{currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
            </ul>


           </div>

      </div>
    );
  }

  return (
    <div className='spinner'>
      <div className='spin'></div>
    </div>
  );
};

export default Coin;
