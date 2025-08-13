import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  image: string;
}

interface Props {
  coins: Crypto[];
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
}

const CryptoTable: React.FC<Props> = ({ coins, watchlist, toggleWatchlist }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflowX: "auto",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 50 }}></TableCell>
            <TableCell>Coin</TableCell>
            <TableCell>Price</TableCell>
            {!isMobile && <TableCell>24h Change</TableCell>}
            {!isMobile && <TableCell>Market Cap</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin) => {
            const isInWatchlist = watchlist.includes(coin.id);
            const priceChangeColor =
              coin.price_change_percentage_24h > 0
                ? theme.palette.success.main
                : theme.palette.error.main;

            return (
              <TableRow key={coin.id} hover>
                {/* Watchlist toggle */}
                <TableCell>
                  <IconButton onClick={() => toggleWatchlist(coin.id)}>
                    {isInWatchlist ? <StarIcon color="warning" /> : <StarBorderIcon />}
                  </IconButton>
                </TableCell>

                {/* Coin info */}
                <TableCell>
                  <Link
                    to={`/coin/${coin.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={coin.image}
                        alt={coin.name}
                        width={24}
                        height={24}
                        style={{ borderRadius: "50%" }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {coin.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {coin.symbol}
                      </Typography>
                    </Box>
                  </Link>
                </TableCell>

                {/* Price */}
                <TableCell>
                  ${coin.current_price.toLocaleString()}
                </TableCell>

                {/* 24h Change */}
                {!isMobile && (
                  <TableCell sx={{ color: priceChangeColor }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>
                )}

                {/* Market Cap */}
                {!isMobile && (
                  <TableCell>
                    ${coin.market_cap.toLocaleString()}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CryptoTable;
