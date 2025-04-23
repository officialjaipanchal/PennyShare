import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getRecentUserExpService } from "../../services/expenseServices";
import AlertBanner from "../AlertBanner";
import Loading from "../loading";
import { convertToCurrency } from "../../utils/helper";
import SearchIcon from "@mui/icons-material/Search";
import { visuallyHidden } from "@mui/utils";

export const MyBalance = ({ sx }) => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [recentExp, setRecentExp] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    const getRecentExp = async () => {
      setLoading(true);
      const userIdJson = {
        user: profile.emailId,
      };
      const recent_exp = await getRecentUserExpService(
        userIdJson,
        setAlert,
        setAlertMessage
      );
      if (recent_exp) {
        setRecentExp(recent_exp?.data?.expense || []);
        setFilteredExpenses(recent_exp?.data?.expense || []);
      }
      setLoading(false);
    };
    getRecentExp();
  }, []);

  useEffect(() => {
    const filtered = recentExp.filter(
      (expense) =>
        expense.expenseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expenseCategory
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredExpenses(filtered);
  }, [searchTerm, recentExp]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedExpenses = filteredExpenses.sort((a, b) => {
    if (orderBy === "date") {
      return order === "asc"
        ? new Date(a.expenseDate) - new Date(b.expenseDate)
        : new Date(b.expenseDate) - new Date(a.expenseDate);
    } else if (orderBy === "amount") {
      return order === "asc"
        ? a.expenseAmount - b.expenseAmount
        : b.expenseAmount - a.expenseAmount;
    } else {
      return order === "asc"
        ? a.expenseName.localeCompare(b.expenseName)
        : b.expenseName.localeCompare(a.expenseName);
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTransactionType = (expense) => {
    if (
      expense.expenseOwner === profile.emailId &&
      expense.expenseMembers.includes(profile.emailId)
    ) {
      return "You created";
    } else if (expense.expenseOwner === profile.emailId) {
      return "You paid";
    } else {
      return "You owe";
    }
  };

  const getStatusColor = (expense) => {
    if (
      expense.expenseOwner === profile.emailId &&
      expense.expenseMembers.includes(profile.emailId)
    ) {
      return "info"; // You created this expense (shared)
    } else if (expense.expenseOwner === profile.emailId) {
      return "success"; // You paid for others
    } else {
      return "error"; // You owe someone
    }
  };

  return (
    <Box sx={{ ...sx }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <AlertBanner
            showAlert={alert}
            alertMessage={alertMessage}
            severity="error"
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              All Transactions
            </Typography>

            <TextField
              size="small"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 300 },
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table aria-label="transaction history table">
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell sortDirection={orderBy === "date" ? order : false}>
                    <TableSortLabel
                      active={orderBy === "date"}
                      direction={orderBy === "date" ? order : "asc"}
                      onClick={() => handleRequestSort("date")}
                    >
                      Date
                      {orderBy === "date" ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Description
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === "amount"}
                      direction={orderBy === "amount" ? order : "asc"}
                      onClick={() => handleRequestSort("amount")}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>People Involved</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedExpenses.length > 0 ? (
                  sortedExpenses.map((expense) => {
                    const statusColor = getStatusColor(expense);
                    const transactionType = getTransactionType(expense);

                    return (
                      <TableRow
                        key={expense._id}
                        hover
                        sx={{
                          "&:nth-of-type(odd)": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                        <TableCell sx={{ fontWeight: "medium" }}>
                          {expense.expenseName}
                          {expense.expenseCategory && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              {expense.expenseCategory}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {expense.expenseCurrency}{" "}
                          {convertToCurrency(Math.abs(expense.expenseAmount))}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: `${statusColor}.lighter`,
                              color: `${statusColor}.dark`,
                              fontWeight: "medium",
                            }}
                          >
                            {transactionType}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {expense.expenseOwner === profile.emailId ? (
                            <Typography variant="body2">
                              Shared with {expense.expenseMembers.length}{" "}
                              {expense.expenseMembers.length === 1
                                ? "person"
                                : "people"}
                            </Typography>
                          ) : (
                            <Typography variant="body2">
                              Paid by {expense.expenseOwner}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm
                          ? "No matching transactions found"
                          : "No transactions yet"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};
