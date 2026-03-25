import { Calendar } from "lucide-react"

const SkedDuration = ({duration, onDurationChange}) => {
    return (
        <div>
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Schedule Duration
            </h3>
            <p className="text-xs text-slate-400 mb-3">How many weeks should this schedule cover?</p>
            <div className="flex items-center gap-2">
                <input
                    type="number" min="1" max="12"
                    value={duration}
                    onChange={e => onDurationChange(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <span className="text-sm text-slate-500">weeks</span>
            </div>
        </div>
    )
}

export default SkedDuration