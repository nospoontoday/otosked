import { useState, useEffect } from "react";
import SkedDuration from "../requirement-setter/SkedDuration"
import NurseShiftModel from "../requirement-setter/NurseShiftModel"

const HospitalConfig = ({ project }) => {
    const [shiftModel, setShiftModel] = useState(
        project.shiftModel || project.template.defaultShiftModel
    );

    const [shiftPerWeek, setShiftPerWeek] = useState(
        project.shiftPerWeek || 3
    );

    const [duration, setDuration] = useState(
        project.template.duration || 1
    );

    const [timeSlots, setTimeSlots] = useState(() => {
        return project.template.shiftConfigs.find(
            c => c.shiftModel === (project.shiftModel || project.template.defaultShiftModel)
        )?.timeSlots || [];
    });

    useEffect(() => {
        const config = project.template.shiftConfigs.find(
            c => c.shiftModel === shiftModel
        );
        if (config?.timeSlots) {
            setTimeSlots(config.timeSlots);
        }
    }, [shiftModel, project.template.shiftConfigs]);

    const handleTimeSlotsChange = (newSlots) => {
        setTimeSlots(newSlots);
    };

    useEffect(() => {
        const shiftsPerDay = timeSlots.length;

        const totalShifts = shiftsPerDay * 7 * duration;

        const effectiveShiftsPerWeek =
            shiftModel === '12h' ? shiftPerWeek : 5;

        const shiftsPerNurse = effectiveShiftsPerWeek * duration;

        Math.ceil(totalShifts / shiftsPerNurse);

        console.log(timeSlots);

    }, [shiftModel, shiftPerWeek, duration, timeSlots]);

    return (
        <div className="space-y-5">
            <SkedDuration 
                duration={duration} 
                onDurationChange={setDuration} 
            />

            <NurseShiftModel
                shiftModel={shiftModel}
                shiftPerWeek={shiftPerWeek}
                shiftModels={project.template.shiftModels}
                shiftPerWeekOptions={project.template.shiftPerWeekOptions}
                onShiftModelChange={setShiftModel}
                onShiftPerWeekChange={setShiftPerWeek}
                timeSlots={timeSlots}
                onTimeSlotsChange={handleTimeSlotsChange}
            />
        </div>
    )
}

export default HospitalConfig