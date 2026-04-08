import { useState } from "react";
import { User, Plus, Trash2, Calendar } from "lucide-react"
import { useHospitalConfigStore } from "../../stores/useHospitalConfigStore";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const NurseConfig = () => {
    const {
        nurses,
        addNurse,
        removeNurse,
        updateNurse,
    } = useHospitalConfigStore();

    const [availabilityOpen, setAvailabilityOpen] = useState(null);
    const [tempDays, setTempDays] = useState([]);
    const [tempStartTime, setTempStartTime] = useState('');
    const [tempEndTime, setTempEndTime] = useState('');

    const openAvailability = (index) => {
        const nurse = nurses[index];
        setAvailabilityOpen(index);
        setTempDays(nurse.availableDays || [...DAYS]);
        setTempStartTime(nurse.availableStartTime || '');
        setTempEndTime(nurse.availableEndTime || '');
    };

    const closeAvailability = () => {
        setAvailabilityOpen(null);
    };

    const saveAvailability = () => {
        if (availabilityOpen !== null) {
            updateNurse(availabilityOpen, 'availableDays', tempDays);
            updateNurse(availabilityOpen, 'availableStartTime', tempStartTime);
            updateNurse(availabilityOpen, 'availableEndTime', tempEndTime);
        }
        closeAvailability();
    };

    const toggleDay = (day) => {
        setTempDays(prev => 
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const setAllDays = () => {
        setTempDays([...DAYS]);
    };

    const clearDays = () => {
        setTempDays([]);
    };

    return (
        <div className="mt-6">
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5 text-sm">
                <User className="w-3.5 h-3.5 text-slate-400" /> Your Nurses
            </h3>

            <p className="text-xs text-slate-400 mb-2">
                Define nurses and their preferences.
            </p>

            <div className="space-y-1.5">
                {nurses.map((nurse, index) => {
                        const hasCustomAvailability = nurse.availableDays && 
                            (nurse.availableDays.length !== 7 || 
                             !DAYS.every(d => nurse.availableDays.includes(d))) ||
                             nurse.availableStartTime || nurse.availableEndTime;

                        return (
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
                            <span className="text-[9px] text-slate-400">Shifts</span>
                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={nurse.maxShiftsPerWeek}
                                onChange={(e) => updateNurse(index, 'maxShiftsPerWeek', parseFloat(e.target.value) || 0)}
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
                            onClick={() => openAvailability(index)}
                            className={`p-1 rounded transition relative ${
                                hasCustomAvailability 
                                    ? 'text-indigo-500 bg-indigo-50' 
                                    : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
                            }`}
                            title="Set availability"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            {hasCustomAvailability && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                        </button>

                        <button
                            onClick={() => removeNurse(index)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            title="Remove nurse"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                );
            })}
            </div>

            <button
                onClick={addNurse}
                className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
                <Plus className="w-3 h-3" />
                Add Nurse
            </button>

            {availabilityOpen !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeAvailability}>
                    <div className="bg-white rounded-lg shadow-xl p-4 w-80" onClick={(e) => e.stopPropagation()}>
                        <h4 className="font-semibold text-sm mb-3">
                            {nurses[availabilityOpen]?.name || `Nurse ${availabilityOpen + 1}`} - Availability
                        </h4>
                        
                        <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2">Days</p>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {DAYS.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`w-8 h-8 text-xs rounded transition ${
                                            tempDays.includes(day)
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                    >
                                        {day.charAt(0)}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={setAllDays}
                                    className="flex-1 text-xs bg-slate-100 hover:bg-slate-200 py-1.5 rounded transition"
                                >
                                    All Days
                                </button>
                                <button
                                    onClick={clearDays}
                                    className="flex-1 text-xs bg-slate-100 hover:bg-slate-200 py-1.5 rounded transition"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2">Hours (optional)</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-400 block">Start</label>
                                    <input
                                        type="time"
                                        value={tempStartTime}
                                        onChange={(e) => setTempStartTime(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                                    />
                                </div>
                                <span className="text-slate-400 mt-4">to</span>
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-400 block">End</label>
                                    <input
                                        type="time"
                                        value={tempEndTime}
                                        onChange={(e) => setTempEndTime(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Leave empty for anytime</p>
                        </div>

                        <button
                            onClick={() => {
                                setTempStartTime('');
                                setTempEndTime('');
                            }}
                            className="mt-2 w-full text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-1.5 rounded transition"
                        >
                            Anytime (Clear Hours)
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={closeAvailability}
                                className="flex-1 text-xs bg-slate-100 hover:bg-slate-200 py-1.5 rounded transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAvailability}
                                className="flex-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 rounded transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NurseConfig
