import "./TaskForm.css";
import { forwardRef, useContext, useRef, useState } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import { NotificationContext } from "./ViewPage";
import Notification from "./Notification";
const TaskForm = forwardRef( ({reRendertasks},ref)=>{
    const notification = useContext(NotificationContext);
    
    const [
        tasknameInput,
        taskCategoryInput,
        HourInput,minutesInput,
        descriptionInput,
        pathInput] =
        [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];
    const sendData = async ()=>{
        
        const task = {
            title: tasknameInput.current.value,
            category:taskCategoryInput.current.value,
            dueDate:date,
            time:HourInput.current.value + ":" +  minutesInput.current.value,
            description: descriptionInput.current.value,
            path: pathInput.current.value == "" ? "/": pathInput.current.value.replace("C:\\fakepath\\","uploads/")
        }
        try{
            const {data} = await axios.post("http://localhost:3002/api/tasks/add",task);
            if(data.success === true){
                notification(currentValue=>{
                    if(currentValue){
                        return [...currentValue,<Notification  msg={data.msg} type="success"/>];
                    }
                        return [<Notification  msg={data.msg} type="success"/>]; 
                });
               reRendertasks(re=> re === true?false:true);
                const img = document.querySelector('input[type="file"]').files[0];
                if(img){
                    const {data} =  await axios.post(
                        "http://localhost:3002/api/tasks/upload",
                        {
                            image:img
                        },
                        {
                            headers:{
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    notification(currentValue=>{
                        if(currentValue){
                            return [...currentValue,<Notification  msg={data} type="success"/>];
                        }
                            return [<Notification  msg={data} type="success"/>]; 
                    });
                }
                tasknameInput.current.value = "";
                tasknameInput.current.value = "";
                HourInput.current.value = "";
                minutesInput.current.value = "";
                descriptionInput.current.value = "";
                pathInput.current.value = "";
                
                ref.current.style.display = "none";
            }
            else{
                data.msg.forEach((msg,i) => {
                    notification(currentValue=>{
                        if(currentValue === undefined){
                            return [<Notification key={i} type={"error"} msg={msg}/>];
                        }
                    return [...currentValue,<Notification key={i} type={"error"} msg={msg}/>];               
                    });
                });
                
            }

        }
        catch (err){
            console.error(err);
        }
    };
    const [date, setDate]  = useState("dd-mm-yyyy");
    return(
        <div id="form_container" ref={ref} onClick={e=>{
            if(e.target.id === ref.current.id || e.target.id === "close_form" || e.target.classList[1] === "fa-xmark")
                ref.current.style.display="none";
        }}>
            <div id="form_holder">

            <div id="close_form">
            <i className="fa-solid fa-xmark"></i>
            </div>
                <div id="infos_form_container">
                <div id="calendar_form_container">
                    <Calendar dateState={setDate}/>
                </div>
                <div id="inputs_form_container">
                <div className="input_con">
                    <span>Task name</span>
                    <input type="text" placeholder="task name" id="task_name_input" ref={tasknameInput}/>
                </div>
                <div className="input_con">
                <span>Priority</span>
                <select id="category_select" className="fa" ref={taskCategoryInput} >
                    <option className='fa' value="not urgent"> &nbsp; not urgent</option>
                    <option className="fa" value="very low">&nbsp; very low</option>
                    <option className="fa" value="low"> &nbsp; low</option>
                    <option className="fa" value="High"> &nbsp; High</option>
                    <option className="fa" value="Very High"> &nbsp; Very High</option>
                    <option className="fa" value="Urgent"> &nbsp; Urgent</option>
                    <option className="fa" value="Other">Other</option>
                </select>
                
                </div>
                    <div className="date_picker">
                        <div id="date_displayer">
                            {date} <div id="calendar_icon_con"><i className="fa-solid fa-calendar-check"></i></div>
                        </div> 
                        <div id="time_input">
                            <input type="number" placeholder="H" ref={HourInput}/> : <input type="number" placeholder="M" ref={minutesInput}/>
                            <div id="clock_icon_con">
                            <i className="fa-solid fa-clock"></i>

                            </div>
                        </div>
                    </div>
                    <div className="input_con desc_con">
                    <span>Description</span>
                    <textarea ref={descriptionInput}  cols={40} rows={100}>

                    </textarea>
                    </div>
                    <div className="upload_send_container">
                        <input type="file" multiple accept="image/*" id="file" ref={pathInput}/>
                    <button id="upload" onClick={()=>{ document.querySelector('#file').click()}}>Upload <i className="fa-solid fa-paperclip"/></button>
                    <button id="upload" onClick={sendData}>Send <i className="fa-regular fa-paper-plane"></i>
                
                    </button>

                    </div>
                </div>
                </div>
            </div>
        </div>
    )
})
export default TaskForm;