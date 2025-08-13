import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { toggleTheme } from "../features/theme/themeSlice";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = useTheme();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Watchlist", path: "/watchlist" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor:
          mode === "dark"
            ? "rgba(18,18,18,0.85)"
            : "rgba(255,255,255,0.75)",
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${
          mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)"
        }`,
        boxShadow:
          mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Логотип */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            fontWeight: 700,
            letterSpacing: 0.5,
            background: theme.palette.primary.main,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            transition: "opacity 0.3s ease",
            "&:hover": { opacity: 0.8 },
          }}
        >
          CryptoTracker
        </Typography>

        {/* Навігація */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={{
                  position: "relative",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  px: 2,
                  color: active
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                  },
                  "&::after": active
                    ? {
                        content: '""',
                        position: "absolute",
                        left: "50%",
                        bottom: 4,
                        transform: "translateX(-50%)",
                        width: "50%",
                        height: "2px",
                        borderRadius: "1px",
                        backgroundColor: theme.palette.primary.main,
                      }
                    : {},
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>

        {/* Перемикач теми */}
        <IconButton
          onClick={() => dispatch(toggleTheme())}
          sx={{
            ml: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.primary.main,
              transform: "rotate(20deg)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
