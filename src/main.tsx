import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.scss";
import MainPage from "./components/pages/MainPage.tsx";
import ProfilePage from "./components/pages/ProfilePage.tsx";
import styles from "./components/Main/Main.module.scss";
import LoginForm from "./components/RegistartionLayot/LoginForm.tsx";
import RegistrationForm from "./components/RegistartionLayot/RegistrationForm.tsx";
import MainLayout from "./components/provider/MainLayout.tsx";
import PrivateRoute from "./components/provider/PrivateRoute.tsx";
import {AuthProvider} from "./components/provider/AuthProvider.tsx";
import AuthLayout from "./components/provider/AuthLayout.tsx";
import Error from "./components/Error/Error.tsx";

const queryClient = new QueryClient();

const Root: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <div className={styles.app}>
                    <Router>
                        <Routes>
                            <Route element={<PrivateRoute />}>
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={<MainPage />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Route>
                            </Route>
                            <Route element={<AuthLayout />}>
                                <Route path="/registration" element={<RegistrationForm />} />
                                <Route path="/login" element={<LoginForm />} />
                            </Route>
                            <Route>
                                <Route path="/*" element={<Error />} />
                            </Route>
                        </Routes>
                    </Router>
                </div>
            </AuthProvider>
        </QueryClientProvider>
    );
};

createRoot(document.getElementById("root")!).render(<Root />);
