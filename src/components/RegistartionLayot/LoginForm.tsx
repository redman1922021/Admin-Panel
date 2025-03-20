import { Button, Form, Input } from "antd";
import { useLogin } from "../../api/api";
import { useNavigate } from "react-router-dom";
import styles from "./RegistartionLayot.module.scss";
import {useAuthContext} from "../provider/AuthProvider.tsx";
import {AuthData} from "../../types/auth.ts";

const LoginForm: React.FC = () => {
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const mutation = useLogin();

    const onFinish = async (values: AuthData) => {
        try {
            const data = await mutation.mutateAsync(values);
            login(data.accessToken);
            navigate("/");
        } catch (error) {
            console.error("Ошибка авторизации:", error);
        }
    };

    return (
        <div className={styles.wrapperFormList}>
            <img className={styles.wrapperFormListLogo} src="logo.svg" alt="plus"/>
            <div className={styles.login}>
                <div className={styles.topTitle}>
                    <p className={styles.loginTitle}>Login to your Account</p>
                </div>
                <Form layout="vertical" onFinish={onFinish} className={styles.form}>
                    <Form.Item
                        name="login"
                        rules={[{required: true, message: "Введите логин!"}]}
                    >
                        <Input placeholder="Логин"/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{required: true, message: "Введите пароль!"}]}
                    >
                        <Input.Password placeholder="Пароль"/>
                    </Form.Item>

                    <div className={styles.buttonsForm}>
                        <Button className={styles.button} type="primary" htmlType="submit" loading={mutation.isPending}>
                            Login
                        </Button>
                    </div>
                </Form>
            </div>
            <div className={styles.links}>
                <p className={styles.text}>Not Registered Yet?</p>
                <span onClick={() => navigate("/registration")} className={styles.textLink}>Create an account</span>
            </div>
        </div>
    );
};

export default LoginForm;
