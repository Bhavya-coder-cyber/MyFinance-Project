import { Portfolio } from "@/models/User"
export interface ApiResponse{
    success: boolean,
    message: string
    portfolios?: Array<Portfolio>
}