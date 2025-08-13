// src/pages/Watchlist.tsx

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { Box, CircularProgress, Typography } from "@mui/material";
import { type RootState } from "../store/store";
import { getCoinDetails } from "../api/coingecko";
import CryptoTable from "../components/CryptoTable";
import { toggleWatchlist  } from "../features/watchlist/watchlistSlice"; 

const Watchlist: React.FC = () => {
  const watchlistIds = useSelector((state: RootState) => state.watchlist.ids);
  const dispatch = useDispatch(); 

  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!watchlistIds.length) {
      setCoins([]);
      return;
    }

    setLoading(true);
    Promise.all(watchlistIds.map((id) => getCoinDetails(id)))
      .then((results) => setCoins(results))
      .finally(() => setLoading(false));
  }, [watchlistIds]);

  const handleToggleWatchlist = (id: string) => {
    dispatch(toggleWatchlist (id)); 
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Watchlist
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : coins.length ? (
        <CryptoTable
          coins={coins.map((c) => ({
            id: c.id,
            name: c.name,
            symbol: c.symbol,
            image: c.image.thumb, 
            current_price: c.market_data.current_price.usd,
            market_cap: c.market_data.market_cap.usd,
            price_change_percentage_24h: c.market_data.price_change_percentage_24h,
          }))}
          watchlist={watchlistIds}
          toggleWatchlist={handleToggleWatchlist}
        />
      ) : (
        <Typography color="text.secondary">Your watchlist is empty</Typography>
      )}
    </Box>
  );
};

export default Watchlist;