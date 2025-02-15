import axiosInstance from "./axios-config";
import { PaginatedResponse } from "../shared/Utils/PaginatedResponse";
import { UserDataDTO } from "../shared/DTOs/Response/UserDataDTO";
import { FilterDTO } from "../shared/DTOs/Request/FilterDTO";

const userService = {

    async getAllUsers(filter: FilterDTO): Promise<PaginatedResponse<UserDataDTO>> {
        try {
            const response = await axiosInstance.get<PaginatedResponse<UserDataDTO>>('api/user', {
                params: filter
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    async getUserData(userId: number): Promise<UserDataDTO> {
        try {
            const response = await axiosInstance.get<any>(`api/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    },

    async updateUser(userUpdateDTO: any): Promise<any> {
        try {
            const response = await axiosInstance.patch<any>('api/user', userUpdateDTO);
            return response.data;
        } catch (error) {
            console.error('Error updating roles of user:', error);
            throw error;
        }
    }, 

    async createUser(userCreateDTO: any): Promise<any> {
        try {
            const response = await axiosInstance.post<any>('api/user', userCreateDTO);
            return response.data;
        } catch (error) {
            console.error('Error updating roles of user:', error);
            throw error;
        }
    }, 
}

export default userService;