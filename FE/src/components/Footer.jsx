import React from "react";

const Footer = ({completedTasksCount = 0, activeTasksCount = 0}) => {
    return <>
        {completedTasksCount + activeTasksCount > 0 && (
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {
                        completedTasksCount > 0 && (
                            <>
                                Chúc mừng! Bạn đã hoàn thành {completedTasksCount} nhiệm vụ.
                                {
                                    activeTasksCount > 0 && `, còn ${activeTasksCount} việc nữa. Lo mà làm nha!`
                                }
                            </>
                        )
                    }

                    {completedTasksCount === 0 && activeTasksCount > 0 && (
                        <>
                            Hãy bắt đầu làm {activeTasksCount} nhiệm vụ đi phen!
                        </>
                        )}
                </p>
            </div>
        )}
    </>
};

export default Footer;