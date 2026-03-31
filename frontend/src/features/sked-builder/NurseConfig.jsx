import { User, Plus, Trash2 } from "lucide-react"
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";

const NurseConfig = () => {
    const {
        nurses,
        addNurse,
        removeNurse,
        updateNurse,
    } = useHospitalConfigStore();

    return (
        <div className="mt-6">
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5 text-sm">
                <User className="w-3.5 h-3.5 text-slate-400" /> Your Nurses
            </h3>

            <p className="text-xs text-slate-400 mb-2">
                Define nurses and their preferences.
            </p>

            <div className="space-y-1.5">
                {nurses.map((nurse, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100"
                    >
                        <input
                            type="text"
                            value={nurse.name}
                            onChange={(e) => updateNurse(index, 'name', e.target.value)}
                            placeholder="Nurse name"
                            className="flex-1 min-w-0 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                        />

                        <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-400">Hrs</span>
                            <input
                                type="number"
                                min="0"
                                value={nurse.maxHoursPerWeek}
                                onChange={(e) => updateNurse(index, 'maxHoursPerWeek', parseInt(e.target.value) || 0)}
                                className="w-12 bg-white border border-slate-200 rounded px-1 py-1 text-xs text-center focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                            />
                        </div>

                        <select
                            value={nurse.shiftPreference}
                            onChange={(e) => updateNurse(index, 'shiftPreference', e.target.value)}
                            className="bg-white border border-slate-200 rounded px-1 py-1 text-xs focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                        >
                            <option value="day">Day</option>
                            <option value="night">Night</option>
                        </select>

                        <button
                            onClick={() => removeNurse(index)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            title="Remove nurse"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addNurse}
                className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
                <Plus className="w-3 h-3" />
                Add Nurse
            </button>
        </div>
    )
}

export default NurseConfig
