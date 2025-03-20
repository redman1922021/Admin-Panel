import {useState} from "react";
import styles from "./Main.module.scss";
import Header from "../Header/Header.tsx";
import List from "../List/List.tsx";
import Navigate from "../Navigate/Navigate.tsx";
import {useTodos} from "../../api/api.ts";
import {TodoFilter, TodoInfo} from "../../types/todos.ts";

const todoInfoDefault: TodoInfo = {
    all: 0,
    completed: 0,
    inWork: 0,
};

const Main: React.FC = () => {
    const [currentFilter, setCurrentFilter] = useState<TodoFilter>(TodoFilter.ALL);
    const {data: todosData, isLoading, error} = useTodos(currentFilter);
    const todos = todosData?.data || [];
    const todoInfo = todosData?.info || todoInfoDefault;

    return (
        <div className={styles.main}>
            <Header/>
            <Navigate todoInfo={todoInfo} onFilterChange={setCurrentFilter} currentFilter={currentFilter}/>
            {isLoading ? <p>Загрузка...</p> : error ? <p>Ошибка загрузки</p> : <List todos={todos}/>}
        </div>
    );
};

export default Main;
