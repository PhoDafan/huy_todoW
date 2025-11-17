import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import { handler } from "tailwindcss-animate";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({handlerNewTaskAdded}) => {
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const addTask = async () => {
        if(newTaskTitle.trim()) {
            try {
                await api.post("/tasks", {title: newTaskTitle});
                toast.success(`Nhiệm vụ "${newTaskTitle}" đã được thêm!`);
                handlerNewTaskAdded();
            } catch (error) {
                console.error("Lỗi khi thêm nhiệm vụ:", error);
                toast.error("Đã có lỗi xảy ra khi thêm nhiệm vụ.");
            }

            setNewTaskTitle("");
        } else {
            toast.error("Muốn làm nhiệm vụ gì thì ghi vô. Sao lại để trống??");
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addTask();
    }
};

    return (
        <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                    type="text"
                    placeholder="Muốn làm gì thì ghi vô?"
                    className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary-20"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    />

                    <Button
                        variant="gradient"
                        size="xl"
                        className="px-6"
                        onClick={addTask}
                        disabled={!newTaskTitle.trim()}
                    >
                        <Plus className="size-5"/>
                        Thêm 
                    </Button>
            </div>
        </Card>
    )
};

export default AddTask;