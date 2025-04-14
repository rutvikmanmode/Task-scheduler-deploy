// ReminderPopup.js
import React, { useEffect, useState } from "react";
import "./ReminderPopup.css";

export default function ReminderPopup({ tasks }) {
  const [upcomingTask, setUpcomingTask] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        const due = new Date(task.dueDateTime); // assuming ISO format
        const diff = due - now;

        if (diff > 0 && diff <= 5 * 60 * 1000) {
          setUpcomingTask(task);
        }
      });
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  const dismissPopup = () => setUpcomingTask(null);

  return (
    upcomingTask && (
      <div className="reminder-popup">
        <div className="reminder-content">
          <h4>⏰ Reminder</h4>
          <p>Task: <strong>{upcomingTask.title}</strong></p>
          <p>Due at: {new Date(upcomingTask.dueDateTime).toLocaleTimeString()}</p>
          <button onClick={dismissPopup}>Dismiss</button>
        </div>
      </div>
    )
  );
}
