import styles from "./List.module.scss";
import ListItem from "../ListItem/ListItem.tsx";
import {Todo} from "../../types/todos.ts";

interface ListProps {
    todos: Todo[];
}

const List: React.FC<ListProps> = ({ todos }) => {
    return (
        <ul className={styles.list}>
            {todos.map((todo) => (
                <ListItem key={todo.id} todo={todo} />
            ))}
        </ul>
    );
};

export default List;
