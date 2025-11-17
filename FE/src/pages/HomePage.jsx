import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, settaskBuffer] = useState([]);
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);
 
//  logic

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      settaskBuffer(res.data.tasks);
      setActiveTasksCount(res.data.activeTasksCount);
      setCompletedTasksCount(res.data.completedTasksCount);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks.");
    }
  }

  const handleTaskChanged = () => {
    fetchTasks();
  };
  
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  }


// biến
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    } 
  });

  const visibleTasks = filteredTasks.slice((page - 1) * visibleTaskLimit, page * visibleTaskLimit);

  if (visibleTasks.length === 0 && page > 1) {
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

    return (
        <div className="min-h-screen w-full bg-[#f0fdfa] relative">
  {/* Mint Fresh Breeze Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(45deg, 
          rgba(240,253,250,1) 0%, 
          rgba(204,251,241,0.7) 30%, 
          rgba(153,246,228,0.5) 60%, 
          rgba(94,234,212,0.4) 100%
        ),
        radial-gradient(circle at 40% 30%, rgba(255,255,255,0.8) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(167,243,208,0.5) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(209,250,229,0.6) 0%, transparent 45%)
      `,
    }}
  />
  {/* Your Content/Components */}
        <div className="container pt-8 mx-auto relative z-10f">
            <div className="w-full max-w-2xl p-6 mx-auto space-y-6">

                {/* Đầu trang */}
                <Header/>

                {/* Tạo nhiệm vụ */}
                <AddTask 
                  handlerNewTaskAdded={handleTaskChanged}
                />

                {/* Thống kê và bộ lọc */}
                <StatsAndFilters
                  filter={filter}
                  setFilter={setFilter}
                  activeTasksCount={activeTasksCount}
                  completedTasksCount={completedTasksCount}
                />

                {/* Danh sách nhiệm vụ */}
                <TaskList filteredTasks={visibleTasks} filter={filter} handleTaskChanged={handleTaskChanged}/>

                {/* Phân công và lọc theo Date */}
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <TaskListPagination 
                      handleNext={handleNext}
                      handlePrev={handlePrev}
                      handlePageChange={handlePageChange}
                      page={page}
                      totalPages={totalPages}
                    />
                    <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
                </div>

                {/* Chân trang */}
                <Footer
                  activeTasksCount={activeTasksCount}
                  completedTasksCount={completedTasksCount}
                />
            </div>
        </div>
</div>



    );
};

export default HomePage;