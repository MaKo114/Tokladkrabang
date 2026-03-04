import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getUserReport = async(token:string) => {
    try{
        const res = await axios.get(`${API}/admin/reports`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res
    }catch(err){
        console.log(err);
    }
}