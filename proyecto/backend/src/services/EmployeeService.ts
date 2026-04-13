import EmployeeModel from "@models/EmployeeModel";

class EmployeeService {
    static async getByBranchId(branchId: string) {
        return await EmployeeModel.getByBranchId(branchId);
    }

    static async getAll() {
        return await EmployeeModel.getAll();
    }

    static async getById(id: string) {
        return await EmployeeModel.getById(id);
    }

    static async create(branchId: string, fullName: string, specialty: string | null, isActive: boolean = true, age: number, email: string) {
        return await EmployeeModel.create(branchId, fullName, specialty, isActive, age, email);
    }

    static async update(id: string, branchId: string, fullName: string, specialty: string | null, isActive: boolean, age: number, email: string) {
        return await EmployeeModel.update(id, branchId, fullName, specialty, isActive, age, email);
    }

    static async delete(id: string) {
        return await EmployeeModel.delete(id);
    }
}

export default EmployeeService;
