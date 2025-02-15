export interface UserUpdateDTO {
    Id: number;
    firstName: string;
    lastName: string;
    birthDate?: string;
    cuit: string;
    address?: string;
    phoneNumber?: string;
    email: string;
}