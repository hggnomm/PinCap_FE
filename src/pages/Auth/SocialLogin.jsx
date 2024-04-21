import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginBySocial } from "../../api";
import jwtDecode from "jwt-decode";

const SocialLogin = () => {
    const location = useLocation()
    const [dataUser, setDataUser] = useState({})

    useEffect(() => {  
        const searchParams = new URLSearchParams(location.search);
        const accessToken = searchParams.get('access_token');
        const dataDecode = jwtDecode(accessToken)
        console.log(dataDecode)
        localStorage.setItem('token', accessToken)
        setDataUser
        ({
            name: dataDecode.sub,
            email: dataDecode.email,
            role: 0
        })

    }, [location])
    useEffect(() => {

        if(dataUser) {
            loginBySocial(dataUser)
            .then(result => {
                console.log("Save database success" + result)
                window.location.reload(true)
            })
            .catch(e => console.log(e))
        }
    }, [dataUser])
    return (
        <></>
    )
}
export default SocialLogin;