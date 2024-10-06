import axios from "axios"
const baseUrl = import.meta.env.VITE_BASE_API;

export const login = async (data: any) => {

    var config = {
        method: 'post',
        url: `${baseUrl}/api/auth/login`,
        headers: { 
          'Content-Type': 'application/json', 
        },
        data : data
      };
      
      try {
        const response = await axios(config);
        return response.data
      } catch (error) {
        console.log(error);
      }
}

export const register = async (data: any) => {
  
  const config = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
      },          
      data: data,
      url: `${baseUrl}/api/auth/register`
    };
    try {
      const response = await axios(config);
      return response.data
    } catch (error) {
      console.log('error', error);
    }
}