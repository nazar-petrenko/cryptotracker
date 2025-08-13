// src/components/CryptoCard.tsx
import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  id: string;
  name: string;
  price: number;
  image: string;
  remove: (id: string) => void;
}

const CryptoCard: React.FC<Props> = ({ id, name, price, image, remove }) => {
  return (
    <Card style={{ maxWidth: 300, margin: 8 }}>
      <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src={image} alt={name} width={30} />
        <Typography>{name}</Typography>
        <Typography>${price.toLocaleString()}</Typography>
        <IconButton onClick={() => remove(id)} color="error">
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;
