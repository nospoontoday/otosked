import { Moon } from "lucide-react"
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";
const RestDefinitions = ({ restDaysPerNurse }) => {
    const {
        selectedRestPattern,
        selectRestPattern,
        selectedShiftModel,
        maxConsecutiveShifts,
        setMaxConsecutiveShifts,
        minRestHours,
        setMinRestHours,
        toggleRestDaysPerNurse,
    } = useHospitalConfigStore();


    let withRest = restDaysPerNurse > 0;

    return (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-slate-400" /> Rest Configuration
          </label>
          <div className="flex items-center gap-3 mt-2 mb-3">
            <button
              onClick={() => toggleRestDaysPerNurse(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                !withRest ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              No Rest
            </button>
            <button
              onClick={() => toggleRestDaysPerNurse(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                withRest ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              With Rest
            </button>
          </div>

          {withRest && (
            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
                <div className="flex items-center gap-2">
                    <label className="text-[11px] font-medium text-slate-500 w-28">Rest days</label>
                    <span className="bg-slate-100 w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-300">
                        {restDaysPerNurse}
                    </span>
                    <span className="text-[11px] text-slate-400">days/week</span>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-[11px] font-medium text-slate-500 w-28">Rest pattern</label>
                    <select
                        value={selectedRestPattern}
                        onChange={e => selectRestPattern(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                    >
                    <option value="scattered">Scattered (spread out)</option>
                    <option value="fixed">Fixed Together (consecutive)</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-medium text-slate-500 w-28">Max consec. {selectedShiftModel}</label>
                  <input
                    type="number" min="1" max="7"
                    value={maxConsecutiveShifts}
                    onChange={e => setMaxConsecutiveShifts(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                  <span className="text-[11px] text-slate-400">shifts</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-medium text-slate-500 w-28">Min rest between</label>
                  <input
                    type="number" min="4" max="24"
                    value={minRestHours}
                    onChange={e => setMinRestHours(parseInt(e.target.value) || 8)}
                    className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                  <span className="text-[11px] text-slate-400">hours</span>
                </div>
            </div>
          )}

        </div>
    )
}

export default RestDefinitions