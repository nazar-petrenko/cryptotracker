import React from "react";
import { TextField } from "@mui/material";

interface Props {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <TextField
      label="Search cryptocurrency..."
      variant="outlined"
      fullWidth
      size="small" 
      value={value}
      onChange={onChange}
      sx={{
        m: 0,
        "& .MuiOutlinedInput-root": {
          height: "40px",
        },
      }}
    />

  );
};

export default SearchBar;
