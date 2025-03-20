import {Table, Input, Button, Space, Tag, Popconfirm, Select} from "antd";
import {useCallback, useState} from "react";
import {useUsers, useDeleteUser, useBlockUser, useUnlockUser, useUpdateUserRights} from "../../api/api";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {Roles} from "../../types/types.ts";
import type {TableProps} from "antd";
import {AxiosError} from "axios";
import {format} from "date-fns";
import {debounce} from "lodash";
import {User} from "../../types/users.ts";

const AdminPage: React.FC = () => {
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [filterStatus, setFilterStatus] = useState<boolean | undefined>(undefined);

    const offset = currentPage - 1;
    const {data, isLoading, isError, error, refetch} = useUsers({
        search: debouncedSearch,
        sortBy,
        sortOrder,
        limit: pageSize,
        offset,
        isBlocked: filterStatus
    });

    const deleteUser = useDeleteUser();
    const blockUser = useBlockUser();
    const unlockUser = useUnlockUser();
    const updateUserRights = useUpdateUserRights();
    const navigate = useNavigate();

    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearch(value);
        }, 500),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSetSearch(e.target.value);
    };

    const handleTableChange: TableProps<User>["onChange"] = (pagination, _filters, sorter) => {
        if (!Array.isArray(sorter)) {
            setSortBy(sorter.columnKey as string);
            setSortOrder(sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : undefined);
        }
        setCurrentPage(pagination.current || 1);
        setPageSize(pagination.pageSize || 20);
    };

    const columns: TableProps<User>["columns"] = [
        {
            title: "Имя", dataIndex: "username", key: "username", sorter: true, render: (text: string) => (
                <div style={{wordWrap: "break-word", whiteSpace: "normal", wordBreak: 'break-all'}}>
                    {text}
                </div>
            ),
        },
        {
            title: "Email", dataIndex: "email", key: "email", sorter: true, render: (text: string) => (
                <div style={{wordWrap: "break-word", whiteSpace: "normal", wordBreak: 'break-all'}}>
                    {text}
                </div>
            ),
        },
        {
            title: "Дата регистрации",
            dataIndex: "date",
            key: "date",
            sorter: true,
            render: (date: string) => format(new Date(date), "dd.MM.yyyy"),
        },
        {
            title: "Статус",
            dataIndex: "isBlocked",
            key: "isBlocked",
            render: (isBlocked: boolean) => (
                <Tag color={isBlocked ? "red" : "green"}>{isBlocked ? "Заблокирован" : "Активен"}</Tag>
            ),
        },
        {title: "Телефон", dataIndex: "phoneNumber", key: "phoneNumber"},
        {
            title: "Роли",
            dataIndex: "roles",
            key: "roles",
            render: (roles: Roles[] | null) => roles ? roles.join(", ") : "Нет ролей",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_: unknown, record: User) => (
                <Space>
                    <Button onClick={() => navigate(`/admin/users/${record.id}`)}>Перейти к профилю</Button>
                    {
                        record.isBlocked ? (
                            <Popconfirm
                                title="Разблокировать пользователя?"
                                onConfirm={() => unlockUser.mutateAsync(record.id).then(() => refetch())}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Button>Разблокировать</Button>
                            </Popconfirm>
                        ) : (
                            <Popconfirm
                                title="Заблокировать пользователя?"
                                onConfirm={() => blockUser.mutateAsync(record.id).then(() => refetch())}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Button danger>Заблокировать</Button>
                            </Popconfirm>
                        )
                    }
                    <Popconfirm title="Удалить пользователя?"
                                onConfirm={() => deleteUser.mutateAsync(record.id).then(() => refetch())}>
                        <Button type="primary" danger>Удалить</Button>
                    </Popconfirm>
                    <Popconfirm
                        title={record.roles?.includes(Roles.ADMIN) ? "Удалить роль администратора?" : "Дать роль администратора?"}
                        onConfirm={() => {
                            const updatedRoles = record.roles?.includes(Roles.ADMIN)
                                ? record.roles.filter(role => role !== Roles.ADMIN)
                                : [...(record.roles || []), Roles.ADMIN];

                            updateUserRights.mutateAsync({
                                id: record.id,
                                roles: updatedRoles,
                            }).then(() => refetch());
                        }}
                    >
                        <Button danger={record.roles?.includes(Roles.ADMIN)}>
                            {record.roles?.includes(Roles.ADMIN) ? "Забрать роль админа" : "Дать роль админа"}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isError && (error as AxiosError)?.response?.status === 403) {
        return (
            <h2 style={{color: "red", textAlign: "center", margin: "2rem 0 0 2rem"}}>
                Смотреть могут только админы, куда мы лезем)
            </h2>
        );
    }
    if (isError && (error as AxiosError)?.response?.status === 401) {
        return (
            <h2 style={{color: "red", textAlign: "center", margin: "2rem 0 0 2rem"}}>
                Токен протух
            </h2>
        );
    }

    return (
        <div style={{width: "100%", padding: "2rem"}}>
            <h2>Пользователи</h2>
            <Space style={{marginBottom: 16}}>
                <Input
                    prefix={<SearchOutlined/>}
                    placeholder="Поиск..."
                    value={search}
                    onChange={handleSearchChange}
                    style={{width: 300}}
                />
                <Select
                    value={filterStatus === undefined ? "all" : filterStatus ? "blocked" : "active"}
                    onChange={(value) => setFilterStatus(value === "all" ? undefined : value === "blocked")}
                >
                    <Select.Option value="all">Все пользователи</Select.Option>
                    <Select.Option value="blocked">Только заблокированные</Select.Option>
                    <Select.Option value="active">Только активные</Select.Option>
                </Select>
            </Space>
            <Table<User>
                columns={columns}
                dataSource={data?.data}
                loading={isLoading}
                rowKey="id"
                onChange={handleTableChange}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: data?.meta.totalAmount,
                    showSizeChanger: true
                }}
            />
        </div>
    );
};

export default AdminPage;
