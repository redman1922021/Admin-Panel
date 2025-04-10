import styles from "./Header.module.scss";
import {Button, Input, Form} from "antd";
import {useAddTodo} from "../../hooks/useTodos.ts";

function Header() {
    const [form] = Form.useForm();
    const addTodoMutation = useAddTodo();

    const handleSubmit = async (values: { title: string }) => {
        try {
            await addTodoMutation.mutateAsync(values.title);
            form.resetFields();
        } catch (error) {
            console.error("Ошибка при добавлении задачи:", error);
        }
    };

    return (
        <header className={styles.header}>
            <div>Logo</div>
            <div className={styles.wrapperSearch}>
                <Form form={form} onFinish={handleSubmit} layout="inline">
                    <Form.Item
                        name="title"
                        rules={[
                            {required: true, message: "Поле не может быть пустым."},
                            {min: 2, message: "Текст задачи должен содержать хотя бы 2 символа."},
                            {max: 64, message: "Текст задачи не должен превышать 64 символа."}
                        ]}
                    >
                        <Input className={styles.search} type="text" placeholder="Введите задачу"/>
                    </Form.Item>
                    <Form.Item>
                        <Button className={styles.buttonHeader} htmlType="submit" loading={addTodoMutation.status === "pending"}>
                            Добавить
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </header>
    );
}

export default Header;
