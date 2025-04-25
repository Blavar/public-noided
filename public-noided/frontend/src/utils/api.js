import axiosInstance from './axiosInstance.js';

//i should really think about abstracting away a mechanism
//for mapping errors types into ui
const ErrorWrapper = (obj, method) => {

    return async (...args) => {
        try{
            let res = await method.call(obj, ...args);
            return [res, null]; 
        } catch(error) {
            let err = {};
            if ( error.response ){
                err = {
                    status: error.response.status,
                    uiFeedback: error.response?.data?.uiFeedback
                }
            } else {
                err = {
                    data: "Trouble sending data, try again later"
                }
            }
            return [null, err]
        }
    }
}

const api = {};

api.get     = ErrorWrapper( axiosInstance, axiosInstance.get );
api.post    = ErrorWrapper( axiosInstance, axiosInstance.post );
api.put     = ErrorWrapper( axiosInstance, axiosInstance.put );
api.delete  = ErrorWrapper( axiosInstance, axiosInstance.delete );


export default api;