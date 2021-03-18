import React, { useEffect, useState } from "react";
import moment from "moment";
import { Card, CardHeader, makeStyles, MenuItem, Select } from "@material-ui/core";
import AddToDo from "./AddToDo";
import UpcomingToDo from "./UpcomingToDo";
import TodaysToDo from "./TodaysToDo";

const saveListToStorage = (list) => {
    const listJson = JSON.stringify(list);
    localStorage.setItem("todoList", listJson);
};

const sortOverallTodosByDate = (overallTodos) => {
    let sorted = {};
    Object.keys(overallTodos).sort().forEach(date => {
        sorted[date] = overallTodos[date];
    });
    return sorted;
};

const sortSpecificTodoListByTime = (todos) => todos.sort((thisTodo, otherTodo) => thisTodo.time.localeCompare(otherTodo.time));

const getUpcomingToDoItems = (currentToDoList, today) => {
    let upcomingToDoItems = {...currentToDoList};
    Object.keys(upcomingToDoItems).forEach(date => {
        if (!moment(date).isAfter(moment(today))) {
            delete upcomingToDoItems[date];
        }
    })
    return upcomingToDoItems;
};

const useStyles = makeStyles({
    container: {
        margin: "10px",
        width: "25%"
    },
    listContainer: {
        display: "flex",
        flexDirection: "column"
    },
    todoListTitle: {
        textAlign: "center",
        backgroundColor: "#30A0F5",
        marginBottom: "1.5vh"
    },
    todoListTitleSelect: {
        color: "white"
    },
});

function ToDoList() {
    const [todaysDate, setTodaysDate] = useState(moment().format("YYYY-MM-D"));
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [selectedTimeline, setSelectedTimeline] = useState("today");
    const [todoList, setTodoList] = useState({ [todaysDate]: [] });

    const classes = useStyles();

    useEffect(() => {
        const newTodaysDate = moment().format("YYYY-MM-D");
        setTodaysDate(newTodaysDate);
        const savedTodoListJson = localStorage.getItem("todoList");
        let savedTodoList;
        if (savedTodoListJson) {
            savedTodoList = JSON.parse(savedTodoListJson);
            setTodoList(savedTodoList);
        }
        if (!savedTodoListJson || !savedTodoList[newTodaysDate]) {
            savedTodoList = {};
            savedTodoList[newTodaysDate] = [];
            setTodoList(savedTodoList);
        }
    }, []);

    const addTask = (date, time, title, details) => {
        const newTaskObject = {
            checked: false,
            time,
            title,
            details
        };
        const currentListOnThatDate = todoList[date] || [];
        const newList = [...currentListOnThatDate, newTaskObject];
        sortSpecificTodoListByTime(newList);

        let todoListCopy = {...todoList};
        todoListCopy[date] = newList;
        todoListCopy = sortOverallTodosByDate(todoListCopy);

        setTodoList(todoListCopy);
        setIsAddingTask(false);
        saveListToStorage(todoListCopy);
    };

    const deleteItem = (index, date) => {
        const newListOnThatDay = [...todoList[date]];
        newListOnThatDay.splice(index, 1);
        const newList = {...todoList};
        newList[date] = newListOnThatDay;
        setTodoList(newList);
        saveListToStorage(newList);
    };

    const toggleCheck = (index, date) => {
        const newListOnThatDay = [...todoList[date]];
        newListOnThatDay[index].checked = !newListOnThatDay[index].checked;
        const newList = {...todoList};
        newList[date] = newListOnThatDay;
        setTodoList(newList);
        saveListToStorage(newList);
    };

    const editItem = (index, date, field, updatedValue) => {
        const newListOnThatDay = [...todoList[date]];
        newListOnThatDay[index][field] = updatedValue;
        if (field === "time") {
            sortSpecificTodoListByTime(newListOnThatDay);
        }
        const newList = {...todoList};
        newList[date] = newListOnThatDay;
        setTodoList(newList);
        saveListToStorage(newList);
    };

    return (
        <Card className={classes.container}>
            {
                isAddingTask ?
                    <AddToDo 
                        cancelClicked={() => setIsAddingTask(false)}
                        addClicked={addTask}
                    /> : 
                    <div>
                        <CardHeader 
                            title={
                                <Select
                                    defaultValue={selectedTimeline} 
                                    classes={{ root: classes.todoListTitleSelect, icon: classes.todoListTitleSelect }}
                                    disableUnderline
                                    onChange={(e) => setSelectedTimeline(e.target.value)}
                                >
                                    <MenuItem value="today">Today</MenuItem>
                                    <MenuItem value="upcoming">Upcoming</MenuItem>
                                </Select>
                            }
                            className={classes.todoListTitle}
                        />
                        {
                            selectedTimeline === "upcoming" ?
                                <UpcomingToDo 
                                    upcomingToDoList={getUpcomingToDoItems(todoList, todaysDate)}
                                    switchToAdd={() => setIsAddingTask(true)}
                                    toggleCheck={toggleCheck}
                                    deleteItem={deleteItem}
                                    editItem={editItem}
                                /> :
                                <TodaysToDo 
                                    todoList={todoList[todaysDate]}
                                    switchToAdd={() => setIsAddingTask(true)}
                                    todaysDate={todaysDate}
                                    toggleCheck={toggleCheck}
                                    deleteItem={deleteItem}
                                    editItem={editItem}
                                />
                        }
                    </div>
            }
        </Card>
    );
}

export default ToDoList;
