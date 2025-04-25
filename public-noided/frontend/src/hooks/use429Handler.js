import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../utils"

export default function use429Handler(){

    const navigate = useNavigate();
    

    useEffect( () => {
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 429) {

                    navigate('/error', { state: {details: ['429: Too many requests', 'Take a break, maybe?']}});
                    return new Promise(() => {});
                }
                return Promise.reject(error);
            }
        );
      
        return () => {
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate]);
}