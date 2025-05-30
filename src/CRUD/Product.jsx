import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAuth } from "../Auth/authContext";
import Api from "../api/axiossetup";

function ProductForm() {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [edit, setEdit] = useState(false);
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    category: "",
    price: "",
    inStock: "",
  });

  const getProducts = async () => {
    try {
      const res = await Api.get("http://localhost:5000/Product/get-Product");
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const { productId, name, category, price, inStock } = product;

    if (!productId || !name || !category || !price || !inStock) {
      alert("All fields are required.");
      return false;
    }

    if (isNaN(price) || Number(price) < 0) {
      alert("Price must be a number.");
      return false;
    }

    if (isNaN(inStock) || Number(inStock) < 0) {
      alert("Stock must be a number.");
      return false;
    }

    const trimmedName = name.trim();
    const nameRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;

    if (!nameRegex.test(trimmedName)) {
      alert("Name should be valid!!");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formatted = {
      productId: product.productId.trim(),
      name: product.name.trim(),
      category: product.category.trim(),
      price: Number(product.price),
      inStock: Number(product.inStock),
    };

    try {
      await Api.post("http://localhost:5000/Product/post-Product", formatted);
      alert("Product added successfully!");
      setProduct({
        productId: "",
        name: "",
        category: "",
        price: "",
        inStock: "",
      });
      getProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    const formatted = {
      productId: product.productId.trim(),
      name: product.name.trim(),
      category: product.category.trim(),
      price: Number(product.price),
      inStock: Number(product.inStock),
    };

    try {
      await Api.put("http://localhost:5000/Product/put-Product", formatted);
      alert("Product updated successfully!");
      setProduct({
        productId: "",
        name: "",
        category: "",
        price: "",
        inStock: "",
      });
      setEdit(false);
      getProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await Api.delete("http://localhost:5000/Product/delete-Product", {
        data: { productId },
      });
      alert("Product deleted successfully!");
      getProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 gap-10 min-h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-full max-w-3xl bg-white p-6 rounded-xl shadow-md">
        <TextField
          label="Product ID"
          name="productId"
          value={product?.productId}
          onChange={handleChange}
          fullWidth
          disabled={edit}
        />
        <TextField
          label="Name"
          name="name"
          value={product?.name}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={product?.category}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Furniture">Furniture</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Price"
          name="price"
          value={product?.price}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Stock Quantity"
          name="inStock"
          value={product?.inStock}
          onChange={handleChange}
          fullWidth
        />
        <div className="flex justify-end gap-4">
          {edit ? (
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-blue-200">
                <TableCell>Product ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">In Stock</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((pro, idx) => (
                <TableRow key={idx}>
                  <TableCell>{pro?.productId || ""}</TableCell>
                  <TableCell align="center">{pro?.name || ""}</TableCell>
                  <TableCell align="center">{pro?.category || ""}</TableCell>
                  <TableCell align="center">{pro?.price || ""}</TableCell>
                  <TableCell align="center">{pro?.inStock || ""}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setProduct({
                          productId: pro?.productId || "",
                          name: pro?.name || "",
                          category: pro?.category || "",
                          price: pro?.price || "",
                          inStock: pro?.inStock || "",
                        });
                        setEdit(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(pro?.productId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ProductForm;
