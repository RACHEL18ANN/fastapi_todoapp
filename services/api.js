import axios from "axios";

const API_URL = "http://localhost:8001/todos/";

export const getTodos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTodo = async (todo) => {
    const response = await axios.post(API_URL, todo);
    return response.data;
};

export const updateTodo = async (id, todo) => {
    const response = await axios.put(`${API_URL}${id}`, todo);
    return response.data;
};

export const deleteTodo = async (id) => {
    const response = await axios.delete(`${API_URL}${id}`);
    return response.data;
};

export const filterTodos = async (completed) => {
    const response = await axios.get(`${API_URL}filter/`, { params: { completed } });
    return response.data;
};
