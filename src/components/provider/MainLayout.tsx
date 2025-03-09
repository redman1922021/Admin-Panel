import { Outlet, Link } from "react-router-dom";
import styles from "../Main/Main.module.scss";
import LogoutButton from "../RegistartionLayot/LogoutButton.tsx";
import {useAuthContext} from "./AuthProvider.tsx";

const MainLayout: React.FC = () => {
    const { isAuthenticated } = useAuthContext();

    return (
        <>
            <div className={styles.menu}>
                <ul>
                    <li><Link to="/">Список Задач</Link></li>
                    <li><Link to="/profile">Профиль</Link></li>
                    <li><Link to="/admin">Админка</Link></li>
                    {isAuthenticated ? (
                        <LogoutButton />
                    ) : (
                        <li><Link to="/login">Войти</Link></li>
                    )}
                </ul>
            </div>
            <Outlet />
        </>
    );
};

export default MainLayout;
