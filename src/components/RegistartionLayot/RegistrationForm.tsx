import {Button, Checkbox, Form, Input, message} from "antd";
import {useState} from "react";
import {useRegister} from "../../api/api";
import {Link} from "react-router-dom";
import styles from "./RegistartionLayot.module.scss";
import {UserRegistration} from "../../types/types.ts";

const RegistrationForm: React.FC = () => {
    const mutation = useRegister();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const onFinish = async (values: UserRegistration) => {
        try {
            await mutation.mutateAsync(values);
            setRegistrationSuccess(true);
            message.success("Регистрация успешна! Теперь вы можете войти в систему.");
        } catch (error) {
            message.error("Ошибка при регистрации, попробуйте снова.");
            console.error("Ошибка регистрации:", error);
        }
    };

    return (
        <div className={styles.wrapperFormList}>
            {registrationSuccess ? (
                <div className={styles.topTitle}>
                    <p className={styles.loginText}>Регистрация успешна! Теперь вы можете войти в систему: <Link
                        to="/login">Войти</Link></p>
                </div>
            ) : (
                <>
                    <img className={styles.wrapperFormListLogo} src="logo.svg" alt="plus"/>
                    <div className={styles.login}>
                        <div className={styles.topTitle}>
                            <p className={styles.loginTitle}>Создайте аккаунт</p>
                            <p className={styles.loginText}>Присоединяйтесь к нашему сервису</p>
                        </div>
                        <div className={styles.centerSection}>
                            <Form layout="vertical" onFinish={onFinish} className={styles.form}>
                                <Form.Item
                                    className={styles.formInput}
                                    name="username"
                                    rules={[
                                        {required: true, message: "Введите имя пользователя!"},
                                        {min: 1, max: 60, message: "От 1 до 60 символов"},
                                    ]}
                                >
                                    <Input placeholder="Имя пользователя" autoFocus/>
                                </Form.Item>

                                <Form.Item
                                    className={styles.formInput}
                                    name="login"
                                    rules={[
                                        {required: true, message: "Введите логин!"},
                                        {min: 2, max: 60, message: "От 2 до 60 символов"},
                                    ]}
                                >
                                    <Input placeholder="Логин"/>
                                </Form.Item>

                                <Form.Item
                                    className={styles.formInput}
                                    name="password"
                                    rules={[
                                        {required: true, message: "Введите пароль!"},
                                        {min: 6, max: 60, message: "От 6 до 60 символов"},
                                    ]}
                                >
                                    <Input.Password placeholder="Пароль"/>
                                </Form.Item>

                                <Form.Item
                                    className={styles.formInput}
                                    name="confirmPassword"
                                    dependencies={["password"]}
                                    rules={[
                                        {required: true, message: "Повторите пароль!"},
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("password") === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("Пароли не совпадают!"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Повторите пароль"/>
                                </Form.Item>

                                <Form.Item
                                    className={styles.formInput}
                                    name="email"
                                    rules={[{required: true, type: "email", message: "Введите корректный email!"}]}
                                >
                                    <Input placeholder="Email"/>
                                </Form.Item>

                                <Form.Item
                                    className={styles.formInput}
                                    name="phoneNumber"
                                    rules={[{pattern: /^\+?\d{10,15}$/, message: "Введите корректный номер телефона"}]}
                                >
                                    <Input placeholder="Телефон (необязательно)"/>
                                </Form.Item>

                                <Form.Item
                                    name="agreement"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value ? Promise.resolve() : Promise.reject(new Error("Вы должны согласиться с условиями!")),
                                        },
                                    ]}
                                >
                                    <Checkbox>Я согласен с условиями</Checkbox>
                                </Form.Item>

                                <div className={styles.buttonsForm}>
                                    <Button className={styles.button} type="primary" htmlType="submit"
                                            loading={mutation.isPending}>
                                        Зарегистрироваться
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </>
            
            )}
        </div>
    );
};

export default RegistrationForm;
