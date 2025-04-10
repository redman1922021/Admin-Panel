import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, Form, message } from "antd";
import {useUserById, useUpdateUser} from "../../hooks/useAdmin.ts";

const UserProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useUserById(Number(id));
    const updateUser = useUpdateUser();
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data);
        }
    }, [data, form]);

    const handleSave = async (values: { username: string; email: string; phoneNumber: string }) => {
        const updatedFields = Object.fromEntries(
            Object.entries(values).filter(([key, value]) => value !== data?.[key as keyof typeof data])
        );

        if (!Object.keys(updatedFields).length) {
            message.info("Нет изменений для сохранения");
            setIsEditing(false);
            return;
        }

        try {
            await updateUser.mutateAsync({ id: Number(id), data: updatedFields });
            message.success("Данные обновлены");
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            message.error(error.response?.status === 400 ? "Логин или почта уже используется" : "Ошибка обновления данных");
        }
    };

    if (isLoading) return <p>Загрузка...</p>;
    if (isError) return <p>Ошибка загрузки данных</p>;

    return (
        <div>
            <h2>Профиль пользователя</h2>
            <Form form={form} onFinish={handleSave} layout="vertical">
                <Form.Item label="Имя" name="username" rules={[{ required: true, message: "Введите имя" }]}>
                    <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Введите email" }]}>
                    <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Телефон" name="phoneNumber">
                    <Input disabled={!isEditing} />
                </Form.Item>
                {isEditing ? (
                    <Button type="primary" htmlType="submit">Сохранить</Button>
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        style={{
                            padding: "5px 15px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            cursor: "pointer",
                            backgroundColor: "#f5f5f5",
                            textAlign: "center",
                            color: "rgba(0, 0, 0, 0.85)",
                            transition: "all 0.3s",
                            display: "inline-block",
                            marginRight: "8px",
                        }}
                    >
                        Редактировать
                    </div>
                )}
            </Form>
            <Button onClick={() => navigate("/admin")} style={{ marginTop: 10 }}>Назад</Button>
        </div>
    );
};

export default UserProfilePage;
