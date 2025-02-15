import { Box, Button, Checkbox, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import './UsersTable.component.scss';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import { SORTBY } from '../../shared/enums/sortBy';
import { UserDataDTO } from '../../shared/DTOs/Response/UserDataDTO';
import { PaginatedResponse } from '../../shared/Utils/PaginatedResponse';
import userService from '../../services/user.service';
import EditIcon from '@mui/icons-material/Edit';

interface TableUserProps {
  needsHeaderBlue: boolean;
  onViewDetailRow: (id: number) => void;
}

function TableUser({ needsHeaderBlue, onViewDetailRow }: TableUserProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<SORTBY>(SORTBY.ASC);
  const [orderBy, setOrderBy] = useState<string>('');
  const [tableData, setTableData] = useState<PaginatedResponse<UserDataDTO>>({ items: [], totalItems: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await userService.getAllUsers({
          limit: rowsPerPage,
          skip: page * rowsPerPage,
          sortBy: sortBy,
          columnFilter: "FirstName",
          includeInactive: false,
          searchValue: searchQuery
        });
        setTableData(result);
        setIsLoading(false);
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    };
    getUsers();
  }, [page, rowsPerPage, sortBy, orderBy, searchQuery]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && sortBy === SORTBY.ASC;
    setSortBy(isAsc ? SORTBY.DESC : SORTBY.ASC);
    setOrderBy(property);
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  return (
    <div>
      <Box mb={2}>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>
      <div className="table-container">
        <TableContainer className="table" style={{ overflowX: 'auto' }}>
          <Table align='center'>
            <TableHead className={needsHeaderBlue ? "table-header table-header-blue" : "table-header"}>
              <TableRow className="table-row">
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Nombre</TableCell>
                <TableCell align="left">Apellido</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Fecha de Nacimiento</TableCell>
                <TableCell align="left">Ver</TableCell>
                
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {['id', 'firstName', 'lastName', 'email', 'birthDate'].map((field, cellIndex) => (
                      <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                        <Skeleton variant="rounded" height={10} />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton variant="rounded" height={10} />
                    </TableCell>
                  </TableRow>
                ))
              ) : hasError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <p>No existen datos para mostrar</p>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.items.map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`}>
                    <TableCell align="left">{row.id || "-"}</TableCell>
                    <TableCell align="left">{row.firstName || "-"}</TableCell>
                    <TableCell align="left">{row.lastName || "-"}</TableCell>
                    <TableCell align="left">{row.email || "-"}</TableCell>
                    <TableCell align="left">
                      {row.birthDate ? new Date(row.birthDate).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : "-"}
                    </TableCell>
                    <TableCell align="left">
                      <IconButton className="table-edit-button" onClick={() => onViewDetailRow(row.id)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={tableData.totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
          />
        </TableContainer>
      </div>
    </div>
  );
}

export default TableUser;
