import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Blogmain.module.css";

const Data = {
  themeOptions: {
    light: "light",
    dark: "dark",
    custom: "custom",
  },
};

const Blogmain = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeMode, setThemeMode] = useState(Data.themeOptions.light);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [dialogType, setDialogType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuBlog, setMenuBlog] = useState(null);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://matrimonybackend-nd5n.onrender.com/api/v1/blogs");
      setBlogs(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch blogs.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDialogOpen = (type, blog) => {
    if (type === "edit") {
      // Pass the selected blog data to the Blogform page
      navigate(`/addblog/${blog._id}`, { state: { blog } });
    } else if (type === "/viewblog") {
      navigate(`/viewblog/${blog._id}`);
    } else {
      setDialogType(type);
      setSelectedBlog(blog);
      setIsDialogOpen(true);
      setMenuAnchorEl(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedBlog(null);
    setDialogType("");
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://matrimonybackend-nd5n.onrender.com/api/v1/blogs/${selectedBlog._id}`);
      setBlogs(blogs.filter((b) => b._id !== selectedBlog._id));
      handleDialogClose();
    } catch (err) {
      alert("Failed to delete blog. Please try again.");
    }
  };

  const handleMenuOpen = (event, selected) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuBlog(selected);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuBlog(null);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "title", header: "Title" },
      {
        accessorKey: "content",
        header: "Content",
        Cell: ({ cell }) => (
          <div className={styles.contentCell} title={cell.getValue()}>
            {cell.getValue()}
          </div>
        ),
      },
      { accessorKey: "author", header: "Author" },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "blogimageUrl",
        header: "Image",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <img src={cell.getValue()} alt="Blog" className={styles.image} />
          ) : (
            "No Image"
          ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <>
            <IconButton
              onClick={(e) => handleMenuOpen(e, row.original)}
              className={styles.actionButton}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl && menuBlog === row.original)}
              onClose={handleMenuClose}
              className={styles.menu}
            >
              <MenuItem onClick={() => handleDialogOpen("/viewblog", row.original)}>
                View
              </MenuItem>
              <MenuItem onClick={() => handleDialogOpen("edit", row.original)}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDialogOpen("delete", row.original)}>
                Delete
              </MenuItem>
            </Menu>
          </>
        ),
      },
    ],
    [blogs, menuAnchorEl, menuBlog]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Blogs</h2>
        <button className={styles.add}>
          <Link to="/addblog">Add Blog</Link>
        </button>
      </div>

      <div className={styles.table_container}>
        <ThemeProvider theme={theme}>
          <MaterialReactTable columns={columns} data={blogs} />
        </ThemeProvider>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        {dialogType === "delete" ? (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this blog?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </div>
  );
};

export default Blogmain;
