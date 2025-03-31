import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Vendormain.module.css";

const Data = {
  themeOptions: {
    light: "light",
    dark: "dark",
    custom: "custom",
  },
};

const VendorMain = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeMode, setThemeMode] = useState(Data.themeOptions.light);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dialogType, setDialogType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuVendor, setMenuVendor] = useState(null);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/vendors");
      setVendors(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch vendors.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    if (
      selectedMode === Data.themeOptions.light ||
      selectedMode === Data.themeOptions.dark
    ) {
      setThemeMode(selectedMode);
      document.body.setAttribute("data-bg", "");
    } else {
      setThemeMode(Data.themeOptions.light);
      document.body.setAttribute("data-bg", selectedMode);
    }
  };

  const handleDialogOpen = (type, vendor) => {
    if (type === "edit") {
      navigate(`/editvendor/${vendor._id}`, { state: { profileData: vendor } });
    } else if (type === "view") {
      navigate(`/vendordetail/${vendor._id}`);
    } else if (type === "delete") {
      setDialogType(type);
      setSelectedVendor(vendor);
      setIsDialogOpen(true);
      setMenuAnchorEl(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedVendor(null);
    setDialogType("");
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/vendors/${selectedVendor._id}`);
      setVendors(vendors.filter((v) => v._id !== selectedVendor._id));
      handleDialogClose();
    } catch (err) {
      alert("Failed to delete vendor. Please try again.");
    }
  };

  const handleMenuOpen = (event, selected) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuVendor(selected);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuVendor(null);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Vendor Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "services", header: "Services" },
      {
        accessorKey: "profilePicUrl",
        header: "Profile Picture",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <img src={cell.getValue()[0]} alt="Vendor" className={styles.image} />
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
              open={Boolean(menuAnchorEl && menuVendor === row.original)}
              onClose={handleMenuClose}
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
    [vendors, menuAnchorEl, menuVendor]
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

  if (loading) return <p>Loading vendors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Vendors</h2>
        <button className={styles.add}>
          <Link to="/addvendor">Add Vendor</Link>
        </button>
      </div>
      <div className={styles.table_container}>
        <ThemeProvider theme={theme}>
          <MaterialReactTable columns={columns} data={vendors} />
        </ThemeProvider>
      </div>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        {dialogType === "delete" && (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this vendor?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default VendorMain;