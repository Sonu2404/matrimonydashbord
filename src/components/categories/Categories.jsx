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
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Categories.module.css"; // Ensure correct path

const Data = {
  themeOptions: {
    light: "light",
    dark: "dark",
    custom: "custom",
  },
};

const SanchalakMain = () => {
  const [sanchalaks, setSanchalaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeMode, setThemeMode] = useState(Data.themeOptions.light);
  const [selectedSanchalak, setSelectedSanchalak] = useState(null);
  const [dialogType, setDialogType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuSanchalak, setMenuSanchalak] = useState(null);
  const navigate = useNavigate();

  // Fetching Sanchalaks from the backend
  const fetchSanchalaks = async () => {
    try {
      const response = await axios.get("https://matrimonybackend-nd5n.onrender.com/api/v1/sanchalak");
      setSanchalaks(response.data.data);  // Assuming the response contains `data`
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch Sanchalaks.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSanchalaks();
  }, []);

  // Handling Dialog Open
  const handleDialogOpen = (type, sanchalak) => {
    if (type === "edit") {
      navigate(`/editsanchalak/${sanchalak._id}`); // Navigate to the form for editing
    } else if (type === "view") {
      navigate(`/sanchalakdetail/${sanchalak._id}`);
    } else {
      setDialogType(type);
      setSelectedSanchalak(sanchalak);
      setIsDialogOpen(true);
      setMenuAnchorEl(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedSanchalak(null);
    setDialogType("");
  };

  // Handling the deletion of a Sanchalak
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://matrimonybackend-nd5n.onrender.com/api/v1/sanchalak/${selectedSanchalak._id}`);
      setSanchalaks(sanchalaks.filter((s) => s._id !== selectedSanchalak._id));
      handleDialogClose();
    } catch (err) {
      alert("Failed to delete Sanchalak. Please try again.");
    }
  };

  const handleMenuOpen = (event, selected) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuSanchalak(selected);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuSanchalak(null);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "profilePic",
        header: "Profile Pic",
        Cell: ({ cell }) => (
          cell.getValue() ? (
            <img
              src={cell.getValue()}
              alt="Profile"
              className={styles.image}
            />
          ) : (
            "No Image"
          )
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <>
            <IconButton onClick={(e) => handleMenuOpen(e, row.original)} className={styles.actionButton}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl && menuSanchalak === row.original)}
              onClose={handleMenuClose}
              className={styles.menu}
            >
              <MenuItem onClick={() => handleDialogOpen("view", row.original)}>
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
    [sanchalaks, menuAnchorEl, menuSanchalak]
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

  if (loading) return <CircularProgress />;  // Show loading spinner while data is being fetched
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sanchalaks</h2>
        <button className={styles.buttonadd}>
          <Link to="/addsanchalak">Add Sanchalak</Link>
        </button>
      </div>
      <div className={styles.table_container}>
        <ThemeProvider theme={theme}>
          <MaterialReactTable columns={columns} data={sanchalaks} />
        </ThemeProvider>
      </div>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        {dialogType === "delete" ? (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this Sanchalak?</p>
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

export default SanchalakMain;
