import { useEffect } from "react";
import SkedDuration from "../requirement-setter/SkedDuration"
import NurseShiftModel from "../requirement-setter/NurseShiftModel"
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";

const HospitalConfig = ({ project }) => {
    const {
        initializeFromProject,
        getStaffingMetrics
    } = useHospitalConfigStore();

    useEffect(() => {
        initializeFromProject(project);
    }, [project, initializeFromProject]);

    const { nursesNeeded, restDaysPerNurse } = getStaffingMetrics();

    return (
        <div className="space-y-5">
            <SkedDuration />

            <NurseShiftModel
                shiftModels={project.template.shiftModels}
                shiftPerWeekOptions={project.template.shiftPerWeekOptions}
                withRest={restDaysPerNurse > 0}
            />
        </div>
    )
}

export default HospitalConfig