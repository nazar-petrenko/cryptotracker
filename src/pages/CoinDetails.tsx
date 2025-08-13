import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoinDetailsThunk, selectCoinById } from "../features/coins/coinsSlice";
import { getCoinMarketChart } from "../api/coingecko";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import type { RootState } from "../store/store";

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const theme = useTheme();

  const coinState = useSelector((state: RootState) => selectCoinById(state, id || ""));
  const coin = coinState?.data;
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!coin) {
          dispatch(fetchCoinDetailsThunk(id));
        }

        const marketChart = await getCoinMarketChart(id, days);
        if (!isMounted) return;

        const formatted = marketChart.prices.map((p: [number, number], i: number) => ({
          date: new Date(p[0]).toLocaleDateString(),
          price: p[1],
          volume: marketChart.total_volumes[i][1],
          marketCap: marketChart.market_caps[i][1],
        }));

        setChartData(formatted);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        if (isMounted) setError("Failed to load data. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, days, dispatch]);

  const priceColor = useMemo(
    () => (coin?.market_data?.price_change_percentage_24h > 0 ? "#00e676" : "#ff1744"),
    [coin]
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: theme.palette.mode === "dark" ? "#1c1c28" : "#fff",
            p: 1.5,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {payload[0].name}: ${payload[0].value.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const renderChart = (dataKey: string, color: string, label: string) => (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 5, height: "100%" }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {label}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={["dataMin", "dataMax"]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#gradient-${dataKey})`}
            strokeWidth={3}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );

  if (loading && !coin) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!coin) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="textSecondary">
          No coin data found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <img src={coin.image?.large} alt={coin.name} width={60} />
        <Typography variant="h4" fontWeight={700}>
          {coin.name} ({coin.symbol.toUpperCase()})
        </Typography>
        <Typography variant="h5" color="primary">
          ${coin.market_data?.current_price?.usd?.toLocaleString()}
        </Typography>
      </Stack>

      {/* Перемикач періодів */}
      <ToggleButtonGroup
        color="primary"
        value={days}
        exclusive
        onChange={(e, v) => v && setDays(v)}
        sx={{ mb: 4 }}
      >
        <ToggleButton value={7}>7d</ToggleButton>
        <ToggleButton value={30}>30d</ToggleButton>
        <ToggleButton value={90}>90d</ToggleButton>
      </ToggleButtonGroup>

      {/* Статистика */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: "Market Cap", value: coin.market_data?.market_cap?.usd },
          { label: "24h Volume", value: coin.market_data?.total_volume?.usd },
          {
            label: "Price Change (24h)",
            value: `${coin.market_data?.price_change_percentage_24h?.toFixed(2)}%`,
            color: priceColor,
          },
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 5,
                textAlign: "center",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(145deg, #1e1e2f, #2a2a3b)"
                    : "linear-gradient(145deg, #ffffff, #f9f9f9)",
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                {stat.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
                color={stat.color || "textPrimary"}
              >
                {typeof stat.value === "number"
                  ? `$${stat.value.toLocaleString()}`
                  : stat.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Графіки */}
      <Grid container spacing={4} direction="column">
        <Grid item xs={12}>
          {renderChart("price", priceColor, `Price (Last ${days} Days)`)}
        </Grid>
        <Grid item xs={12}>
          {renderChart("volume", "#00bcd4", "Trading Volume")}
        </Grid>
        <Grid item xs={12}>
          {renderChart("marketCap", "#9c27b0", "Market Capitalization")}
        </Grid>
      </Grid>

      {/* Де купити */}
      {coin.links?.homepage && coin.links.homepage[0] && (
        <>
          <Typography variant="h6" mt={5} gutterBottom>
            Where to Buy
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {coin.links.homepage
              .filter((link: string) => link)
              .map((link: string, idx: number) => (
                <Button
                  key={idx}
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                  color="primary"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy on {coin.name}
                </Button>
              ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default CoinDetails;
