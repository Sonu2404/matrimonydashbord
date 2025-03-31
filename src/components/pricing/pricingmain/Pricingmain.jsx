import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Pricingmain.module.css";

const PricingMain = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dialogType, setDialogType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuPlan, setMenuPlan] = useState(null);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/pricing");
      setPlans(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch pricing plans.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDialogOpen = (type, plan) => {
    if (type === "edit") {
      navigate(`/editpricing/${plan._id}`);
    } else if (type === "view") {
      navigate(`/viewpricing/${plan._id}`);
    } else {
      setDialogType(type);
      setSelectedPlan(plan);
      setIsDialogOpen(true);
      setMenuAnchorEl(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPlan(null);
    setDialogType("");
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/pricing/${selectedPlan._id}`);
      setPlans(plans.filter((p) => p._id !== selectedPlan._id));
      handleDialogClose();
    } catch (err) {
      alert("Failed to delete pricing plan. Please try again.");
    }
  };

  const handleMenuOpen = (event, selected) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuPlan(selected);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuPlan(null);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "title", header: "Plan Title" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "duration", header: "Duration" },
      {
        accessorKey: "description",
        header: "Description",
        // Apply ellipsis to the Description column
        Cell: ({ cell }) => (
          <div className={styles.ellipsis}>
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "features",
        header: "Features",
        // Apply ellipsis to the Features column
        Cell: ({ cell }) => (
          <div className={styles.ellipsis}>
            {cell.getValue().join(", ")}
          </div>
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
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl && menuPlan === row.original)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleDialogOpen("view", row.original)}>View</MenuItem>
              <MenuItem onClick={() => handleDialogOpen("edit", row.original)}>Edit</MenuItem>
              <MenuItem onClick={() => handleDialogOpen("delete", row.original)}>Delete</MenuItem>
            </Menu>
          </>
        ),
      },
    ],
    [plans, menuAnchorEl, menuPlan]
  );

  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);

  if (loading) return <p>Loading pricing plans...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Pricing Plans</h2>
        <button className={styles.add}>
          <Link to="/addpricing">Add Plan</Link>
        </button>
      </div>

      <div className={styles.table_container}>
        <ThemeProvider theme={theme}>
          <MaterialReactTable columns={columns} data={plans} />
        </ThemeProvider>
      </div>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        {dialogType === "delete" ? (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this pricing plan?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </div>
  );
};

export default PricingMain;
