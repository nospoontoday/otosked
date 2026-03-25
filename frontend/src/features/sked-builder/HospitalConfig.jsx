import { Calendar, Clock } from "lucide-react"
import SkedDuration from "../requirement-setter/SkedDuration"
import NurseShiftModel from "../requirement-setter/NurseShiftModel"

const HospitalConfig = () => {
    return (
        <div className="space-y-5">
            <SkedDuration />
            <NurseShiftModel />
        </div>
    )
}

export default HospitalConfig