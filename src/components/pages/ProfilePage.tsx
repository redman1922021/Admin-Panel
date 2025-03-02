import { Button, Form, Input, message } from "antd";
import { useProfile, useUpdateProfile } from "../../api/api";
import styles from "./ProfilePage.module.scss";
import { useEffect } from "react";
import {ProfileRequest} from "../../types/types.ts";

const ProfilePage: React.FC = () => {
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const [form] = Form.useForm();

    useEffect(() => {
        if (profile) {
            form.setFieldsValue(profile);
        }
    }, [profile, form]);

    const onFinish = async (values: ProfileRequest) => {
        try {
            await updateProfile.mutateAsync(values);
            message.success("Профиль успешно обновлён!");
        } catch (error) {
            message.error("Ошибка обновления профиля.");
        }
    };

    if (isLoading) return <p>Загрузка...</p>;

    return (
        <div className={styles.container}>
            <h2>Личный кабинет</h2>
            <Form form={form} layout="vertical" onFinish={onFinish} className={styles.form}>
                <Form.Item
                    label="Имя пользователя"
                    name="username"
                    rules={[
                        { required: true, message: "Имя пользователя обязательно" },
                        { min: 1, max: 60, message: "От 1 до 60 символов" },
                        { pattern: /^[А-Яа-яA-Za-z\s]+$/, message: "Только буквы русского/латинского алфавита" },
                    ]}
                >
                    <Input placeholder="Имя пользователя" />
                </Form.Item>

                <Form.Item
                    label="Почтовый адрес"
                    name="email"
                    rules={[
                        { required: true, message: "Email обязателен" },
                        { type: "email", message: "Некорректный email" },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    label="Телефон (необязательно)"
                    name="phoneNumber"
                    rules={[
                        { pattern: /^\+?[1-9][0-9]{7,14}$/, message: "Некорректный телефон" },
                    ]}
                >
                    <Input placeholder="Телефон" />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={updateProfile.isPending}>
                    Сохранить изменения
                </Button>
            </Form>
        </div>
    );
};

export default ProfilePage;
