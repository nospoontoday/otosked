import { Clock } from "lucide-react"
import ShiftDefinitions from "./ShiftDefinitions";
import RestDefinitions from "./RestDefinitions";
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";

const NurseShiftModel = ({
    shiftModels = [],
    shiftPerWeekOptions = [],
    restDaysPerNurse = 0,
}) => {
    const {
        selectedShiftModel,
        shiftsPerNursePerWeek,
        selectShiftModel,
        setShiftsPerNursePerWeek,
    } = useHospitalConfigStore();

    const is12h = selectedShiftModel === '12h';
    const modelDuration = is12h ? 12 : 8;

    return (
        <div>
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Nurse Shift Model
            </h3>

            <p className="text-xs text-slate-400 mb-3">
                Defines the shift structure for nursing staff.
            </p>

            {/* Shift model selector */}
            <select
                value={selectedShiftModel}
                onChange={e => selectShiftModel(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
                {shiftModels.map(model => (
                    <option key={model.value} value={model.value}>
                        {model.label}
                    </option>
                ))}
            </select>

            {is12h && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <label className="text-[11px] font-medium text-slate-500">
                        Shifts per week:
                    </label>

                    {shiftPerWeekOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setShiftsPerNursePerWeek(option.value)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                                shiftsPerNursePerWeek === option.value
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-500 border-slate-200'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {!is12h && (
                <p className="mt-2 text-[11px] text-slate-400">
                    8-hour model uses 3 shifts/day (21 shifts/week total).
                </p>
            )}

            {/* Editable shift definitions */}
            <ShiftDefinitions modelDuration={modelDuration} />

            {/* Rest Configuration */}
            <RestDefinitions restDaysPerNurse={restDaysPerNurse} />
        </div>
    )
}

export default NurseShiftModel