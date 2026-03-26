import { Moon } from "lucide-react"

const RestDefinitions = ({ withRest }) => {
    return (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-slate-400" /> Rest Configuration
          </label>
          <div className="flex items-center gap-3 mt-2 mb-3">
            <button
            //   onClick={() => handleToggleRest(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                !withRest ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              No Rest
            </button>
            <button
            //   onClick={() => handleToggleRest(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                withRest ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              With Rest
            </button>
          </div>
        </div>
    )
}

export default RestDefinitions