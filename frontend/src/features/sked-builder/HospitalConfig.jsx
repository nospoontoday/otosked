import { useState, useEffect } from "react";
import SkedDuration from "../requirement-setter/SkedDuration"
import NurseShiftModel from "../requirement-setter/NurseShiftModel"
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";

const HospitalConfig = ({ project }) => {
    const {
        selectedShiftModel,
        shiftsPerNursePerWeek,
        scheduleLengthWeeks,
        dailyShiftSlots,
        initializeFromProject,
        selectShiftModel,
        setShiftsPerNursePerWeek,
        setScheduleLengthWeeks,
        setDailyShiftSlots,
        getStaffingMetrics
    } = useHospitalConfigStore();

    useEffect(() => {
        initializeFromProject(project);
    }, [project, initializeFromProject]);

    const { nursesNeeded, restDaysPerNurse } = getStaffingMetrics();

    return (
        <div className="space-y-5">
            <SkedDuration 
                duration={scheduleLengthWeeks} 
                onDurationChange={setScheduleLengthWeeks} 
            />

            <NurseShiftModel
                shiftModel={selectedShiftModel}
                shiftPerWeek={shiftsPerNursePerWeek}
                shiftModels={project.template.shiftModels}
                shiftPerWeekOptions={project.template.shiftPerWeekOptions}
                onShiftModelChange={selectShiftModel}
                onShiftPerWeekChange={setShiftsPerNursePerWeek}
                timeSlots={dailyShiftSlots}
                onTimeSlotsChange={setDailyShiftSlots}
            />
        </div>
    )
}

export default HospitalConfig