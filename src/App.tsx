// src/App.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline, Container } from "@mui/material";

import {store} from "./store/store";
import AppRoutes from "./routes";
import { APP_NAME } from "./utils/constants";
import Header from "./components/Header"; // Припустимо, у тебе є компонент Header

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          <AppRoutes />
        </Container>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
