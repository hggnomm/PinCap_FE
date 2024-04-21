import axios from "axios"

const baseUrl = "https://test-campaign-management-api.dps-fpt.vn"
// const baseUrl = "https://localhost:44302"

export const register = async (data) => {
    const config = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
        },          
        data: data,
        url: `${baseUrl}/api/Account/register`
      };
    
      try {
        const response = await axios(config);
        console.log(response.data);
      } catch (error) {
        console.log('error', error);

      }
}
export const login = async (data) => {
    var config = {
        method: 'post',
        url: `${baseUrl}/api/Account/login`,
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
export const loginBySocial = async (data) => {
    var config = {
        method: 'post',
        url: `${baseUrl}/api/Account/social-login`,
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
// get all
export const getAllCampaigns = async () => {
  const token = localStorage.getItem('token')

  const config = {
    method: 'get',
    url: `${baseUrl}  `,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    }
  }
  try {
    const res = await axios(config)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
// create update
export const createAndUpdateCampaign = async (data, token) => {

  const config = {
    method: 'post',
    url: `${baseUrl}/api/Campaign`,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    },
    data : data
  }
  
  try {
    const res = await axios(config)
    console.log(JSON.stringify(res.data));
    return res.data
  } catch (error) {
    console.log(error)
  }
}
// delete
export const deleteCampaign = async (id, token) => {
  const config = {
    method: 'DELETE',
    url: `${baseUrl}/api/Campaign/${id}`,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    },
  }
  try {
    const res = await axios(config)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getCampaignById = async (id, token) => {
  const config = {
    method: 'get',
    url: `${baseUrl}/api/Campaign/${id}`,
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    },
  }
  try {
    const res = await axios(config)
    return res.data
  } catch (error) {
    console.log(error)
  }
}