import { useEffect, useRef, useState } from 'react';
import { createChart, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { CandlestickSeries } from 'lightweight-charts';

import Box from '@mui/material/Box';
import RealTimePrice from '../../components/realTimePrice/RealTimePrice';
import SingleComponentStack from '../../assets/elements/CustomStack';
import StackTitle from '../buildingBlocks/StackTitle';

interface TimeSeriesDataPoint {
    time: string;
    first: number;
    high: number;
    low: number;
    last: number;
}

const Chart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartRef = useRef<any>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [historicalData, setHistoricalData] = useState<CandlestickData[]>([]);

    // Fetch historical data and set up chart
    useEffect(() => {
        if (chartContainerRef.current && !chartRef.current) {
            const chartOptions = {
                layout: {
                    textColor: 'black',

                    borderRadius: 3,
                },
            };
            const chart = createChart(chartContainerRef.current, chartOptions);
            chartRef.current = chart;

            const candlestickSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });
            candlestickSeriesRef.current = candlestickSeries;

            fetch('https://api.universe-bank.com/time-series/timeseries?instrument-id=NVDA&price-source=cboe&start-date=2023-05-24T22:00&end-date=2030-12-25T23:00&granularity=1d')
                .then(response => response.json())
                .then(data => {
                    const candlestickData = data.map((item: TimeSeriesDataPoint) => ({
                        time: item.time.split(' ')[0],
                        open: item.first,
                        high: item.high,
                        low: item.low,
                        close: item.last,
                    }));

                    candlestickData.sort((a: { time: string }, b: { time: string }) =>
                        new Date(a.time).getTime() - new Date(b.time).getTime()
                    );

                    setHistoricalData(candlestickData);
                    candlestickSeries.setData(candlestickData);
                });
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    // WebSocket connection and real-time updates
    useEffect(() => {
        const ws = new WebSocket('wss://api.universe-bank.com/market-data/ws');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
            ws.send(JSON.stringify({ action: 'subscribe', instrument: 'NVDA' }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.body?.NVDA_cboe?.last) {
                const newPrice = data.body.NVDA_cboe.last;

                // Update the last candle or create a new one
                if (candlestickSeriesRef.current && historicalData.length > 0) {
                    const currentDate = new Date().toISOString().split('T')[0];
                    const lastCandle = historicalData[historicalData.length - 1];

                    if (lastCandle.time === currentDate) {
                        // Update the last candle
                        const updatedCandle = {
                            ...lastCandle,
                            close: newPrice,
                            high: Math.max(lastCandle.high, newPrice),
                            low: Math.min(lastCandle.low, newPrice)
                        };

                        const updatedData = [...historicalData.slice(0, -1), updatedCandle];
                        setHistoricalData(updatedData);
                        candlestickSeriesRef.current.update(updatedCandle);
                    } else {
                        // Create a new candle for the current day
                        const newCandle = {
                            time: currentDate,
                            open: lastCandle.close,
                            high: newPrice,
                            low: newPrice,
                            close: newPrice
                        };

                        const updatedData = [...historicalData, newCandle];
                        setHistoricalData(updatedData);
                        candlestickSeriesRef.current.update(newCandle);
                    }
                }
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, [historicalData]);

    return (
        <Box sx={{

        }}>
            <SingleComponentStack height={500}
            >
                <StackTitle
                    title='Market' />
                <RealTimePrice />
                <div
                    ref={chartContainerRef}
                    style={{
                        display: 'flex',
                        justifyContent: 'right',
                        alignItems: 'center',
                        maxWidth: '90vw',
                        height: '100%',
                        marginTop: 8,

                    }}
                />
            </SingleComponentStack>
        </Box>
    );
};

export default Chart;