import { Users, Plus, Trash2 } from "lucide-react"
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";

const DepartmentConfig = () => {
    const {
        departments,
        addDepartment,
        removeDepartment,
        updateDepartment,
    } = useHospitalConfigStore();

    return (
        <div>
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5 text-sm">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Your Staff & Departments
            </h3>

            <p className="text-xs text-slate-400 mb-2">
                Define departments and staffing per shift.
            </p>

            <div className="space-y-1.5">
                {departments.map((dept, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100"
                    >
                        <input
                            type="text"
                            value={dept.name}
                            onChange={(e) => updateDepartment(index, 'name', e.target.value)}
                            placeholder="Dept name"
                            className="flex-1 min-w-0 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                        />

                        <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-400">N</span>
                            <input
                                type="number"
                                min="0"
                                value={dept.nursesPerShift}
                                onChange={(e) => updateDepartment(index, 'nursesPerShift', parseInt(e.target.value) || 0)}
                                className="w-10 bg-white border border-slate-200 rounded px-1 py-1 text-xs text-center focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-400">D</span>
                            <input
                                type="number"
                                min="0"
                                value={dept.doctorsPerShift}
                                onChange={(e) => updateDepartment(index, 'doctorsPerShift', parseInt(e.target.value) || 0)}
                                className="w-10 bg-white border border-slate-200 rounded px-1 py-1 text-xs text-center focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={() => removeDepartment(index)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            title="Remove department"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addDepartment}
                className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
                <Plus className="w-3 h-3" />
                Add Department
            </button>
        </div>
    )
}

export default DepartmentConfig
