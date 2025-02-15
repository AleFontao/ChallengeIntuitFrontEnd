import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, TextField, Button, Box, IconButton, Snackbar, Alert } from '@mui/material';
import userService from '../../services/user.service';
import CloseIcon from '@mui/icons-material/Close';
import { UserUpdateDTO } from '../../shared/DTOs/Request/UserUpdateDTO';
import './UserModal.component.scss';

interface UserModalProps {
    open: boolean;
    onClose: () => void;
    userToEditId?: number;
}

const UserModal = ({ open, onClose, userToEditId }: UserModalProps) => {
    const [userData, setUserData] = useState<UserUpdateDTO>({
        Id: 0,
        firstName: '',
        lastName: '',
        cuit: '',
        email: '',
        birthDate: '',
        address: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState<any>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({ ...prevState, [name]: value }));
    };

    const validateFields = () => {
        const newErrors: any = {};
        
        const cuitRegex = /^\d{2}-\d{8}-\d$/;
        if (!cuitRegex.test(userData.cuit)) {
            newErrors.cuit = 'El CUIT debe tener el formato XX-XXXXXXXX-X';
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(userData.email)) {
            newErrors.email = 'Formato de email invalido';
        }

        if (!userData.firstName || !userData.lastName) {
            newErrors.name = 'El nombre y apellido son obligatorios';
        }

        if (userData.birthDate && isNaN(Date.parse(userData.birthDate))) {
            newErrors.birthDate = 'La fecha de nacimiento no es válida';
        }

        return Object.keys(newErrors).length === 0 ? true : newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validateFields();
        if (validationErrors === true) {
            setErrors({});  
            try {
                if (userToEditId) {
                    await userService.updateUser(userData);
                } else {
                    await userService.createUser(userData);
                }
                setSnackbarOpen(true); 
                onClose();
            } catch (error) {
                console.error('Error al guardar el usuario:', error);
            }
        } else {
            setErrors(validationErrors);  
        }
    };
    

    const handleClose = () => {
        setErrors({});  
        onClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        setUserData({
            Id: 0,
            firstName: '',
            lastName: '',
            cuit: '',
            email: '',
            birthDate: '',
            address: '',
            phoneNumber: ''
        });
        const fetchUserData = async () => {
            if (userToEditId) {
                try {
                    const response = await userService.getUserData(userToEditId);
                    setUserData({
                        address: response.address,
                        Id: response.id,
                        firstName: response.firstName,
                        lastName: response.lastName,
                        cuit: response.cuit,
                        email: response.email,
                        birthDate: response.birthDate ? response.birthDate.split('T')[0] : '',
                    });
                } catch (error) {
                    console.error('Error al obtener los datos del usuario:', error);
                }
            }
        };
        fetchUserData();
    }, [userToEditId]);

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <div className="header-form">
                    <p>{userToEditId ? 'Editar Usuario' : 'Crear Usuario'}</p>
                    <IconButton
                        color="inherit"
                        aria-label={"close"}
                        onClick={handleClose}
                        edge="start"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <DialogContent style={{
                    overflowY: "auto",
                    padding: "0",
                    height: "100%",
                    scrollbarWidth: "none",
                }}>
                    <Box display="flex" flexDirection="column" gap={2} style={{ padding: '20px' }}>
                        <TextField
                            label="Nombre"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Apellido"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Fecha de Nacimiento"
                            name="birthDate"
                            type="date"
                            value={userData.birthDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate}
                        />
                        <TextField
                            label="CUIT"
                            name="cuit"
                            value={userData.cuit}
                            fullWidth
                            onChange={handleChange}
                            error={!!errors.cuit}
                            helperText={errors.cuit}
                        />
                        <TextField
                            label="Dirección"
                            name="address"
                            value={userData.address || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Teléfono"
                            name="phoneNumber"
                            value={userData.phoneNumber || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}  variant="outlined" color="error" >
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}   variant="outlined" color="primary">
                        {userToEditId ? 'Guardar cambios' : 'Crear usuario'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    ¡Operación realizada con éxito!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UserModal;
