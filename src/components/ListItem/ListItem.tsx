import { useState } from "react";
import styles from "./ListItem.module.scss";
import { Button, Input, Form, Checkbox, message } from "antd";
import { useDeleteTodo, useUpdateTodo } from "../../api/api.ts";
import {Todo} from "../../types/todos.ts";

interface ListItemProps {
    todo: Todo;
}

const ListItem: React.FC<ListItemProps> = ({ todo }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const updateTodoMutation = useUpdateTodo();
    const deleteTodoMutation = useDeleteTodo();

    const handleSave = async (values: { title: string }) => {
        try {
            await updateTodoMutation.mutateAsync({ id: todo.id, title: values.title, isDone: todo.isDone });
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            message.error("Не удалось сохранить задачу");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        try {
            await deleteTodoMutation.mutateAsync(todo.id);
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            message.error("Не удалось удалить задачу");
        }
    };

    const handleToggleDone = async () => {
        try {
            await updateTodoMutation.mutateAsync({ id: todo.id, title: todo.title, isDone: !todo.isDone });
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
            message.error("Не удалось изменить статус задачи");
        }
    };

    return (
        <li className={styles.listItem}>
            {isEditing ? (
                <Form
                    layout="inline"
                    onFinish={handleSave}
                    initialValues={{ title: todo.title }}
                    className={styles.form}
                >
                    <Form.Item
                        name="title"
                        rules={[
                            { required: true, message: "Поле не может быть пустым." },
                            { min: 2, message: "Текст задачи должен содержать хотя бы 2 символа." },
                            { max: 64, message: "Текст задачи не должен превышать 64 символа." },
                        ]}
                        style={{ flex: 1 }}
                    >
                        <Input autoFocus />
                    </Form.Item>
                    <div className={styles.buttonsForm}>
                        <Checkbox checked={todo.isDone} onChange={handleToggleDone} disabled={updateTodoMutation.status === "pending"} />
                        <Button type="primary" htmlType="submit" loading={updateTodoMutation.status === "pending"}>
                            Сохранить
                        </Button>
                        <Button onClick={handleCancel} disabled={updateTodoMutation.status === "pending"}>
                            Отмена
                        </Button>
                    </div>
                </Form>
            ) : (
                <>
                    <span>{todo.title}</span>
                    <div className={styles.buttons}>
                        <Checkbox checked={todo.isDone} onChange={handleToggleDone} disabled={updateTodoMutation.status === "pending"} />
                        <Button onClick={() => setIsEditing(true)} disabled={updateTodoMutation.status === "pending"}>
                            Редактировать
                        </Button>
                        <Button danger onClick={handleDelete} disabled={deleteTodoMutation.status === "pending"}>
                            Удалить
                        </Button>
                    </div>
                </>
            )}
        </li>
    );
};

export default ListItem;
