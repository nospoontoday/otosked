import { Clock } from "lucide-react"

const NurseShiftModel = ({
    shiftModel,
    shiftPerWeek,
    shiftModels = [],
    shiftPerWeekOptions = [],
    onShiftModelChange,
    onShiftPerWeekChange
}) => {
    return (
        <div>
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Nurse Shift Model
            </h3>

            <p className="text-xs text-slate-400 mb-3">
                Defines the shift structure for nursing staff.
            </p>

            <select
                value={shiftModel}
                onChange={e => onShiftModelChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
                {shiftModels.map(model => (
                    <option key={model.value} value={model.value}>
                        {model.label}
                    </option>
                ))}
            </select>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
                <label className="text-[11px] font-medium text-slate-500">
                    Shifts per week:
                </label>

                {shiftPerWeekOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => onShiftPerWeekChange(option.value)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                            shiftPerWeek === option.value
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-500 border-slate-200'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
export default NurseShiftModel