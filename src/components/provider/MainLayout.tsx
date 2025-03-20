import { Outlet, Link } from "react-router-dom";
import styles from "../Main/Main.module.scss";
import LogoutButton from "../RegistartionLayot/LogoutButton.tsx";
import {useAuthContext} from "./AuthProvider.tsx";
import {useProfile} from "../../api/api.ts";
import {Roles} from "../../types/types.ts";

const MainLayout: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    const { data: profile} = useProfile();
    const isAdmin = profile?.roles.includes(Roles.ADMIN);

    return (
        <>
            <div className={styles.menu}>
                <ul>
                    <li><Link to="/">Список Задач</Link></li>
                    <li><Link to="/profile">Профиль</Link></li>
                    {isAdmin && <li><Link to="/admin">Админка</Link></li>}
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
