"use client";
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { DataCategories } from "../Data";
import { useRouter } from "next/navigation";


const Category = () => {
  const [categories, setCategories] = React.useState("");
  const router = useRouter()

  const handleChange = (event: SelectChangeEvent) => {
    setCategories(event.target.value);
  };
  return (
    <div className="px-2  flex justify-between items-center">
      <div className="flex items-center justify-center">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">
            All Categories
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={categories}
            onChange={handleChange}
            label="All Categories"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {DataCategories.map((cat) => (
              <MenuItem
              onClick={()=> router.push(`/products/${cat.slug}`) }
              key={cat.title} value={cat.title}>
                {cat.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className=" justify-between gap-3 items-center hidden lg:flex">
        {DataCategories.map((but) => (
          <Button
          onClick={()=> router.push(`/products/${but.slug}`) }
            key={but.title}
            variant="outlined"
            sx={{
                fontSize: '0.55rem',
              borderColor: "green",
              color: "green",
              "&:hover": { backgroundColor: "rgba(0, 128, 0, 0.1)" },
            }}
          >
            {but.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Category;
