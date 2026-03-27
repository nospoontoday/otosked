import { Moon } from "lucide-react"
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";
const NightShiftDefinition = () => {
    const {
        scheduleLengthWeeks,
        maxNightShiftsPerPeriod,
        setMaxNightShiftsPerPeriod,
    } = useHospitalConfigStore();

    return (
      <div>
        <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <Moon className="w-4 h-4 text-slate-400" /> Night Shift Rotation
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Max night shifts per nurse per schedule period ({scheduleLengthWeeks} week{scheduleLengthWeeks !== 1 ? 's' : ''}).
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number" min="0" max="14"
            value={maxNightShiftsPerPeriod}
            onChange={e => setMaxNightShiftsPerPeriod(parseInt(e.target.value) || 0 )}
            className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <span className="text-sm text-slate-500">night shifts</span>
        </div>
      </div>
    )
}

export default NightShiftDefinition