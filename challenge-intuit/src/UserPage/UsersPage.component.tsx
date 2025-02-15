import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import './UsersPage.component.scss';
import TableUser from '../components/UsersTable/UsersTable.component';
import UserModal from '../components/UsersModal/UserModal.component';
import { UserDataDTO } from '../shared/DTOs/Response/UserDataDTO';

const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [userToEditId, setUserToEditId] = useState<number | undefined>(undefined);

  const toggleForm = () => {
    setOpenModal(true);
    setUserToEditId(undefined);
  };

  const openResponse = (userId: number) => {
    setUserToEditId(userId);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setUserToEditId(undefined); 
  };

  return (
    <Container className="user-principal">
      <h2>ABM Usuarios</h2>
      <Button onClick={toggleForm} variant="contained" color="primary">
        Agregar Usuario
      </Button>
      <div className="table-users-container">
        <TableUser
          needsHeaderBlue={true}
          onViewDetailRow={openResponse}
        />
      </div>
      <UserModal
        open={openModal} 
        onClose={closeModal}
        userToEditId={userToEditId} 
      />
    </Container>
  );
};

export default UsersPage;
