import { Clock } from "lucide-react"

const NurseShiftModel = () => {
    return (
        <div>
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Nurse Shift Model
            </h3>
            <p className="text-xs text-slate-400 mb-3">Defines the shift structure for nursing staff.</p>
            <select
                // value={c.nurseShiftModel}
                // onChange={e => handleShiftModelChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
                <option value="12h">12-Hour Shift Model</option>
                <option value="8h">8-Hour Shift Model</option>
            </select>

            <div className="mt-2 flex items-center gap-2">
                <label className="text-[11px] font-medium text-slate-500">Shifts per week:</label>
                <button
                    // onClick={() => update({ shiftsPerWeek: 3 })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                    3 === 3 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                    }`}
                >
                    3 (36h/wk)
                </button>
                <button
                    // onClick={() => update({ shiftsPerWeek: 4 })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                    3 === 4 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                    }`}
                >
                    4 (48h/wk)
                </button>
            </div>
        </div>
    )
}

export default NurseShiftModel