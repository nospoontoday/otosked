import SkedDuration from "../requirement-setter/SkedDuration"
import NurseShiftModel from "../requirement-setter/NurseShiftModel"
import { useState } from "react"

const HospitalConfig = ({ project }) => {
    const [shiftModel, setShiftModel] = useState(project.shiftModel || project.template.defaultShiftModel);
    const [shiftPerWeek, setShiftPerWeek] = useState(project.shiftPerWeek || 3);
    const [duration, setDuration] = useState(project.template.duration || 1);

    return (
        <div className="space-y-5">
            <SkedDuration duration={duration} onDurationChange={setDuration} />

            <NurseShiftModel
                shiftModel={shiftModel}
                shiftPerWeek={shiftPerWeek}
                shiftModels={project.template.shiftModels}
                shiftPerWeekOptions={project.template.shiftPerWeekOptions}
                onShiftModelChange={setShiftModel}
                onShiftPerWeekChange={setShiftPerWeek}
            />
        </div>
    )
}

export default HospitalConfig