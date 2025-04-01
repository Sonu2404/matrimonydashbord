import React, { useState, useMemo, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import style from "./Product.module.css";
import { Link, useNavigate } from "react-router-dom";

const Product = () => {
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
        "https://matrimonybackend-nd5n.onrender.com/api/v1/bride-groom?gender=female"
      );
      setData(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch brides.");
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
          `https://matrimonybackend-nd5n.onrender.com/api/v1/bride-groom/${selectedRow._id}`
        );
        fetchData();
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
            <img
              src={cell.getValue()}
              alt="Bride"
              className={style.imagemain}
            />
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
          <h2 className={style.titlebride}>Brides</h2>
          <h2 className={style.add}>
            <Link to="/addprofile">Add Bride</Link>
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
          <MaterialReactTable columns={columns} data={data} className={style.tablemain} />
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

export default Product;