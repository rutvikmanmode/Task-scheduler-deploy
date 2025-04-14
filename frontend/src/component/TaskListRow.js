import "./TaskListRow.css";
import { useRef, useEffect, useContext, useState } from "react";
import { NotificationContext } from "./ViewPage";
import Notification from "./Notification";
import axios from "axios";
import { TasksContext } from "./ListView";

export const icons = {
    Food: <i className="fa-solid fa-utensils" style={{ marginRight: "10px" }}></i>,
    Map: <i className="fa-solid fa-map" style={{ marginRight: "10px" }}></i>,
    Meeting: <i className="fa-solid fa-handshake" style={{ marginRight: "10px" }}></i>,
    Travel: <i className="fa-solid fa-plane-arrival" style={{ marginRight: "10px" }}></i>,
    Games: <i className="fa-solid fa-gamepad" style={{ marginRight: "10px" }}></i>,
    Sport: <i className="fa-solid fa-volleyball" style={{ marginRight: "10px" }}></i>,
    Other: <i className="fa-regular fa-circle-question" style={{ marginRight: "10px" }}></i>
}

export default function TaskListRow({ completed, title, category, dueDate, _id, time, description, path }) {
    const notification = useContext(NotificationContext);
    const updateTask = useContext(TasksContext);
    const checkDIV = useRef(null);

    // ✅ Add your state hooks HERE:
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState({
        title,
        description,
        category,
        dueDate,
        time
    });

    // Handle submit for editing the task
    const submitEdit = async () => {
        const { data } = await axios.put(`http://localhost:3002/api/tasks/${_id}`, {
            ...editData
        });

        if (data.success) {
            notification(currentValue => {
                return [...(currentValue || []), <Notification msg={data.msg} type="success" />];
            });

            updateTask(currVal => !currVal);
            setShowEdit(false); // Close edit mode after successful edit
        }
    };

    // Handle change in the edit form input fields
    const handleEditChange = (e) => {
        setEditData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const dragStarted = (e) => {
        e.target.classList = "item_row dragging closed";
    }

    const dragEnded = (e) => {
        e.target.classList = "item_row closed";
        if (e.target.id)
            checkDIV.current.click();
    }

    const removeTask = async () => {
        const { data } = await axios.delete(`http://localhost:3002/api/tasks/${_id}`);
        if (data.success) {
            notification(currentValue => {
                if (currentValue) {
                    return [...currentValue, <Notification msg={data.msg} type="success" />];
                }
                return [<Notification msg={data.msg} type="success" />];
            });

            updateTask(currVal => {
                return !currVal
            })
        }
    };

    const changeTaskData = async (e) => {
        if (e) {
            e.preventDefault();
        }
        const { data } = await axios.put(`http://localhost:3002/api/tasks/${_id}`,
            {
                completed: !completed
            });
        if (data.success) {
            notification(currentValue => {
                if (currentValue) {
                    return [...currentValue, <Notification msg={data.msg} type="success" />];
                }
                return [<Notification msg={data.msg} type="success" />];
            });

            updateTask(currVal => {
                return !currVal
            })
        }
    }

    useEffect(() => {
        if (completed)
            checkDIV.current.classList = "checking checked";
        else
            checkDIV.current.classList = "checking";
    }, []);

    return (
        <tr className="item_row closed" draggable="true" onDragStart={dragStarted} onDragEnd={dragEnded}>
            <td>
                <i className="fa-solid fa-chevron-down" onClick={e => {
                    if (e.target.parentElement.parentElement.classList.value === "item_row" && e.target.parentElement.parentElement.classList.value !== "item_row dragging") {
                        e.target.parentElement.parentElement.classList = "item_row closed";
                    } else {
                        e.target.parentElement.parentElement.classList = "item_row";
                    }
                }}></i>
                <div className="task_row_header">
                    <div className="" ref={checkDIV} onClick={changeTaskData}>
                        <i className="fa-solid fa-check row"></i>
                    </div>
                    <div className="task_row_title">
                        <span style={{
                            textDecorationLine: completed ? "line-through" : ""
                        }}>
                            {title}
                            <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() => setShowEdit(true)} // Show edit form when clicked
                                style={{ position: "absolute", bottom: "10px", right: "40px", cursor: "pointer" }}
                            />

                            <i className="fa-solid fa-calendar-xmark" onClick={removeTask} style={{ position: "absolute", bottom: "10px", right: "10px", transition: "0.23s", cursor: "pointer" }}></i>
                        </span>
                    </div>
                </div>
            </td>

            {/* Edit Form */}
            {showEdit && (
                <div className="edit-form">
                    <h3>Edit Task</h3>
                    <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                    />
                    <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                    />
                    <input
                        type="text"
                        name="category"
                        value={editData.category}
                        onChange={handleEditChange}
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={editData.dueDate}
                        onChange={handleEditChange}
                    />
                    <input
                        type="time"
                        name="time"
                        value={editData.time}
                        onChange={handleEditChange}
                    />
                    <button onClick={submitEdit}>Save</button>
                    <button onClick={() => setShowEdit(false)}>Cancel</button>
                </div>
            )}
        </tr>
    );
}
