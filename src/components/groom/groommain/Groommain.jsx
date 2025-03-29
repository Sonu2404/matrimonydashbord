import React, { useState, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import style from "./Groommain.module.css";
import { Link, useNavigate } from "react-router-dom";

const Groommain = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // mode: "dark",
        },
      }),
    []
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/v1/bride-groom?gender=male"
      );
      setData(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch grooms.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleThreeDotsClick = (event, row) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX,
    });
    setPopupVisible(!popupVisible);
    setSelectedRow(row.original);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRow(null);
  };

  const handleView = () => {
    if (selectedRow) {
      navigate(`/profile/${selectedRow._id}`);
      closePopup();
    }
  };

  const handleEdit = () => {
    if (selectedRow) {
      // Pass the selected row data to Stepmain via navigation state
      navigate(`/editprofile/${selectedRow._id}`, { state: { profileData: selectedRow } });
      closePopup();
    }
  };

  const handleDelete = async () => {
    if (selectedRow) {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/bride-groom/${selectedRow._id}`
        );
        fetchData(); // Refresh data after delete
        closePopup();
      } catch (err) {
        console.error("Error deleting profile:", err);
      }
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "fullName", header: "Name" },
      { accessorKey: "mobileNumber", header: "Mobile Number" },
      {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      },
      { accessorKey: "city", header: "Location" },
      {
        accessorKey: "annualIncome",
        header: "Annual Income",
        Cell: ({ cell }) => (cell.getValue() ? `$${cell.getValue()}` : "N/A"),
      },
      {
        accessorKey: "profilePhoto",
        header: "Image",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <img src={cell.getValue()} alt="Groom" className={style.imagemain} />
          ) : (
            "No Image"
          ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div
            className={style.actionsContainer}
            onClick={(event) => handleThreeDotsClick(event, row)}
          >
            <button className={style.threeDotsButton}>...</button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className={style.table_container}>
      <ThemeProvider theme={theme}>
        <div className={style.main}>
          <h2 className={style.titlebride}>Groom</h2>
          <h2 className={style.add}>
            <Link to="/addprofile">Add Groom</Link>
          </h2>
        </div>
        {isLoading ? (
          <div className={style.loader}>
            <CircularProgress />
          </div>
        ) : error ? (
          <div className={style.error}>
            <p>{error}</p>
          </div>
        ) : (
          <div className={style.table_wrapper}>
            <MaterialReactTable columns={columns} data={data} className={style.tablemain} />
          </div>
        )}
        {popupVisible && popupPosition && (
          <div
            className={style.popup}
            style={{ top: popupPosition.top, left: popupPosition.left }}
          >
            <div className={style.popupOption} onClick={handleView}>
              View
            </div>
            <div className={style.popupOption} onClick={handleEdit}>
              Edit
            </div>
            <div className={style.popupOption} onClick={handleDelete}>
              Delete
            </div>
          </div>
        )}
        {popupVisible && <div className={style.overlay} onClick={closePopup}></div>}
      </ThemeProvider>
    </div>
  );
};

export default Groommain;