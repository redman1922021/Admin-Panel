import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import {useAuthContext} from "../provider/AuthProvider.tsx";

const LogoutButton = () => {
    const { logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return <Button style={{ width: "100%", height: "100%" }} onClick={handleLogout}>Выйти</Button>;
};

export default LogoutButton;
