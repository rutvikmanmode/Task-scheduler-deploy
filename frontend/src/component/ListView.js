import "./ListView.css"
import axios from "axios";
import { useEffect, useState, createContext } from "react";
import TaskListRow from "./TaskListRow";

export const TasksContext = createContext();

export function dragAndDrop(doms) {
    if (doms instanceof NodeList) {
        doms.forEach(dom => {
            dom.addEventListener("dragover", container => {
                container.preventDefault();
                const draggedElement = document.querySelector(".dragging");
                if (draggedElement.parentElement.parentElement.id != dom.parentElement.id)
                    draggedElement.id = "changeMe";
            });
            dom.addEventListener("dragleave", container => {
                container.preventDefault();
                const draggedElement = document.querySelector(".dragging");
                draggedElement.id = "";
            });
        })
    } else {
        doms.addEventListener("dragover", container => {
            container.preventDefault();
            const draggedElement = document.querySelector(".dragging");
            if (draggedElement.parentElement.id != doms.id)
                draggedElement.id = "changeMe";

        });

        doms.addEventListener("dragleave", container => {
            container.preventDefault();
            const draggedElement = document.querySelector(".dragging");
            draggedElement.id = "";
        });
    }
}

export default function ListView() {
    const [updateTasks, setupdateTasks] = useState(false);
    const [uncompletedTasks, setuncompletedTasks] = useState();
    const [completedTasks, setcompletedTasks] = useState();

    const getTasks = async () => {
        const { data } = await axios.get("${process.env.REACT_APP_API_URL}/api/tasks")
        if (data.success === true && data.data.length > 0) {
            const uncompleted = data.data.filter(e => e.completed === false)
                .map((e, i) => {
                    return <TaskListRow key={i} {...e} />;
                });
            if (uncompleted.length > 0) {
                setuncompletedTasks([...uncompleted]);
            } else {
                setuncompletedTasks(<tr className="empty_list"><td>List is empty</td></tr>);
            }

            const completed = data.data.filter(e => e.completed === true)
                .map((e, i) => {
                    return <TaskListRow key={i} {...e} />;
                });
            if (completed.length > 0) {
                setcompletedTasks([...completed]);
            } else {
                setcompletedTasks(<tr className="empty_list"><td>List is empty</td></tr>);
            }

        } else {
            setuncompletedTasks(<tr className="empty_list"><td>List is empty</td></tr>);
            setcompletedTasks(<tr className="empty_list"><td>List is empty</td></tr>);
        }
    };

    // Fetch task by ID (example usage)
    const getTaskById = async (id) => {
        const { data } = await axios.get("https://task-scheduler-deploy.onrender.com/api/tasks/${id}");
        if (data.success) {
            console.log("Fetched Task:", data.data);
            // You can now update the UI with this task data
        } else {
            console.log("Error fetching task by ID:", data.msg);
        }
    };

    useEffect(() => {
        dragAndDrop(document.querySelectorAll("table tbody"));
    }, []);

    useEffect(() => {
        getTasks();
    }, [updateTasks]);

    return (
        <TasksContext.Provider value={setupdateTasks}>

            <table border={0} id="uncompleted_tasks_table">
                <thead>
                    <tr>
                        <td style={{ display: "flex", alignItems: "center" }}>
                            <h4>TO DO</h4>
                            <h6 style={{ margin: 10 }}>tasks {uncompletedTasks ? uncompletedTasks.length : 0}</h6>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {uncompletedTasks}
                </tbody>
            </table>

            <table id="completed_tasks_table">
                <thead>
                    <tr>
                        <td style={{
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <h4>COMPLETED</h4>
                            <h6 style={{ margin: 10 }}>tasks {completedTasks ? completedTasks.length : 0}</h6>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {completedTasks}
                </tbody>
            </table>
        </TasksContext.Provider>
    )
}
