import { Outlet, Link, useLocation } from "react-router-dom";
import {ConfigProvider, Menu, MenuProps} from "antd";
import styles from "../Main/Main.module.scss";
import LogoutButton from "../RegistartionLayot/LogoutButton.tsx";
import { useAuthContext } from "./AuthProvider.tsx";
import { Roles } from "../../types/types.ts";
import { useProfile } from "../../hooks/useUser.ts";

const MainLayout: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuthContext();
    const { data: profile } = useProfile();
    const isAdmin = profile?.roles.includes(Roles.ADMIN);

    const menuItems: MenuProps["items"] = [
        {
            label: <Link to="/">Список Задач</Link>,
            key: "/",
        },
        isAdmin && {
            label: <Link to="/admin">Админка</Link>,
            key: "/admin",
        },
        !isAdmin && {
            label: <Link to="/profile">Профиль</Link>,
            key: "/profile",
        },
        isAuthenticated
            ? {
                label: <LogoutButton />,
                key: "logout",
                itemPaddingInline: 0,
            }
            : {
                label: <Link to="/login">Войти</Link>,
                key: "/login",
            },
    ].filter(Boolean) as MenuProps["items"];

    return (
        <>
            <div className={styles.menu}>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                itemPaddingInline: 0,
                            },
                        },
                    }}
                >
                    <Menu
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                    />
                </ConfigProvider>
            </div>
            <Outlet />
        </>
    );
};

export default MainLayout;
