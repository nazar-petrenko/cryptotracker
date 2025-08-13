import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Collapse,
  useTheme,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import FilterForm, { type FilterValues } from "../components/FilterForm";
import CryptoTable from "../components/CryptoTable";
import { getMarketCoins } from "../api/coingecko";
import { type RootState } from "../store/store";
import { toggleWatchlist } from "../features/watchlist/watchlistSlice";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

interface CoinFromAPI {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

const Home: React.FC = () => {
  const [coins, setCoins] = useState<CoinFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [currency] = useState("usd");

  const [filters, setFilters] = useState<FilterValues>({
    minPrice: "",
    maxPrice: "",
    minVolume: "",
    onlyGainers: false,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);

  const watchlistIds = useSelector((state: RootState) => state.watchlist.ids);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    getMarketCoins(currency)
      .then((data) => setCoins(data))
      .finally(() => setLoading(false));
  }, [currency]);

  const handleToggleWatchlist = (id: string) => {
    dispatch(toggleWatchlist(id));
  };

  const handleApplyFilters = (values: {
    minPrice?: number;
    maxPrice?: number;
    minVolume?: number;
    onlyGainers: boolean;
  }) => {
    setFilters(values);
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      minVolume: "",
      onlyGainers: false,
    });
  };

  const filteredCoins = coins
    .filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
    )
    .filter((coin) => {
      if (filters.minPrice !== "" && coin.current_price < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice !== "" && coin.current_price > Number(filters.maxPrice)) {
        return false;
      }
      if (filters.minVolume !== "" && coin.total_volume < Number(filters.minVolume)) {
        return false;
      }
      if (filters.onlyGainers && coin.price_change_percentage_24h <= 0) {
        return false;
      }
      return true;
    });

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor:
          mode === "dark" ? theme.palette.background.default : "#f9fafb",
        minHeight: "100vh",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Заголовок */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Cryptocurrency Prices
      </Typography>

      {/* Панель пошуку та кнопка фільтрів */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow:
            mode === "dark"
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch", // однакова висота
              gap: 2,
            }}
          >
            {/* Пошук */}
            <Box sx={{ flex: 1 }}>
              <SearchBar
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ height: "40px" }} // щоб збігалося з кнопкою
              />
            </Box>
          
            {/* Кнопка */}
            <Button
              onClick={() => setFiltersOpen((prev) => !prev)}
              startIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
              sx={{
                height: "40px", // така ж, як SearchBar
                borderRadius: "8px",
                px: 2.5,
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
                boxShadow:
                  mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.4)"
                    : "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              Filters
            </Button>
          </Box>

          {/* Схована секція фільтрів */}
          <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <FilterForm onApply={handleApplyFilters} onClear={handleClearFilters} />
          </Collapse>
        </CardContent>
      </Card>

      {/* Таблиця */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.05)",
            p: 2,
          }}
        >
          <CryptoTable
            coins={filteredCoins}
            watchlist={watchlistIds}
            toggleWatchlist={handleToggleWatchlist}
          />
        </Card>
      )}
    </Box>
  );
};

export default Home;
