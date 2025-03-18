import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate to navigate programmatically
import styles from "./Eventmain.module.css";

const Data = {
  themeOptions: {
    light: "light",
    dark: "dark",
    custom: "custom",
  },
};
const Eventmain = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeMode, setThemeMode] = useState(Data.themeOptions.light);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogType, setDialogType] = useState(""); // "view", "edit", "delete"
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuEvent, setMenuEvent] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/events");
      setEvents(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch events.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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
      setThemeMode(Data.themeOptions.light); // Default to light
      document.body.setAttribute("data-bg", selectedMode); // Set custom background
    }
  };

  const handleDialogOpen = (type, event) => {
    if (type === "edit") {
      navigate(`/addevent/${event._id}`);
    } else if (type === "/viewevent") {
      navigate(`/viewevent/${event._id}`);
    } else {
      setDialogType(type);
      setSelectedEvent(event);
      setIsDialogOpen(true);
      setMenuAnchorEl(null); // Close menu when dialog opens
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setDialogType("");
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/events/${selectedEvent._id}`);
      setEvents(events.filter((e) => e._id !== selectedEvent._id)); // Update UI
      handleDialogClose();
    } catch (err) {
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleMenuOpen = (event, selected) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuEvent(selected);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuEvent(null);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Event Name" },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "date",
        header: "Date",
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "organizer", header: "Organizer" },
      {
        accessorKey: "imageUrl",
        header: "Image",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <img
              src={cell.getValue()}
              alt="Event"
              className={styles.image}
            />
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
              open={Boolean(menuAnchorEl && menuEvent === row.original)}
              onClose={handleMenuClose}
              className={styles.menu}
            >
              <MenuItem onClick={() => handleDialogOpen("/viewevent", row.original)}>
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
    [events, menuAnchorEl, menuEvent]
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

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Events</h2>
        <button className={styles.add}>
          <Link to="/addevent">Add Event</Link>
        </button>
      </div>

      <div className={styles.table_container}>
        <ThemeProvider theme={theme}>
          <MaterialReactTable columns={columns} data={events} />
        </ThemeProvider>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        {dialogType === "delete" ? (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this event?</p>
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

export default Eventmain;

