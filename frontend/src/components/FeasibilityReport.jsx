import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const FeasibilityReport = ({ feasibility }) => {
  if (!feasibility) {
    return null;
  }

  const { isFeasible, issues, warnings, info, summary } = feasibility;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isFeasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          {isFeasible ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h3 className={`font-bold ${isFeasible ? 'text-green-800' : 'text-red-800'}`}>
              {isFeasible ? 'Configuration Looks Good!' : 'Configuration Has Issues'}
            </h3>
            <p className="text-sm text-slate-600">
              {isFeasible 
                ? 'Your schedule configuration appears valid. You can proceed to add resources.'
                : 'Please fix the issues below before proceeding.'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-6 border-b border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500" />
          Weekly Staffing Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Departments</p>
            <p className="text-2xl font-bold text-slate-800">{summary?.totalDepartments || 0}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Nurses</p>
            <p className="text-2xl font-bold text-slate-800">{summary?.totalNursesAvailable || 0}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Nurses/Shift</p>
            <p className="text-2xl font-bold text-slate-800">{summary?.totalNursesPerShift || 0}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Doctors/Shift</p>
            <p className="text-2xl font-bold text-slate-800">{summary?.totalDoctorsPerShift || 0}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Shifts/Week</p>
            <p className="text-2xl font-bold text-slate-800">{summary?.totalShiftsPerWeek || 0}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div className="text-sm text-indigo-800">
              <p className="font-medium">What this means for staffing:</p>
              <ul className="mt-2 space-y-1 text-indigo-700">
                <li>• Each week needs <strong>{summary?.totalNurseShiftsNeeded || 0} nurse-shifts</strong> and <strong>{summary?.totalDoctorShiftsNeeded || 0} doctor-shifts</strong></li>
                <li>• With {summary?.shiftPerWeek} shifts per person per week, you'll need approximately:</li>
                <li className="ml-4">- <strong>{summary?.estimatedNursesNeeded || 0} nurses</strong> (assuming 3 shifts/week each)</li>
                <li className="ml-4">- <strong>{summary?.estimatedDoctorsNeeded || 0} doctors</strong> (assuming 3 shifts/week each)</li>
              </ul>
            </div>
          </div>
        </div>

        {summary?.nursesPerDay && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-600">Nurses Available vs Needed (Per Day)</p>
              <span className="text-[10px] text-slate-500">Need: {summary.totalNursesPerShift || 0} nurses/day</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                const data = summary.nursesPerDay[day];
                const needed = summary.totalNursesPerShift || 0;
                const status = data?.nurseCount < needed 
                  ? 'text-red-600' 
                  : data?.nurseCount < needed + 2 
                    ? 'text-yellow-600' 
                    : 'text-green-600';
                return (
                  <div key={day} className="bg-white rounded p-2 border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-medium">{day.slice(0,3)}</p>
                    <div className="mt-1">
                      <p className={`text-lg font-bold ${status}`}>{data?.nurseCount || 0}</p>
                      <p className="text-[9px] text-slate-400">avail</p>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-100">
                      <p className="text-lg font-bold text-slate-700">{needed}</p>
                      <p className="text-[9px] text-slate-400">need</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

{summary?.nursesPerShift && Object.keys(summary.nursesPerShift).length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-600">Shift Capacity vs Demand (Weekly)</p>
              <span className="text-[10px] text-slate-500">Total Needed: {(summary.totalNursesPerShift || 0) * 7 * 2} shifts/week</span>
            </div>
            
            {/* Total Capacity - shared between all shift types */}
            {(() => {
              const totalCapacity = (summary.totalNursesAvailable || 0) * (summary.shiftsPerNursePerWeek || 3);
              const totalNeeded = (summary.totalNursesPerShift || 0) * 7 * 2;
              const status = totalCapacity < totalNeeded 
                ? 'text-red-600 bg-red-50' 
                : totalCapacity < totalNeeded + (summary.totalNursesPerShift || 0)
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-green-600 bg-green-50';
              return (
                <div className={`mb-4 rounded-lg p-4 border ${status.includes('red') ? 'border-red-200' : status.includes('yellow') ? 'border-yellow-200' : 'border-green-200'}`}>
                  <p className="text-xs text-slate-500 mb-1">Total Shift Capacity (All Nurses)</p>
                  <p className={`text-3xl font-bold ${status}`}>
                    {totalCapacity}
                  </p>
                  <p className="text-[10px] text-slate-400">shifts/week available (shared by all shift types)</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    vs {totalNeeded} shifts/week needed
                  </p>
                </div>
              );
            })()}

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(summary.nursesPerShift).map(([shiftType, data]) => {
                const needed = (summary.totalNursesPerShift || 0) * 7;
                const shiftCapacity = data?.shiftCapacity || 0;
                const status = shiftCapacity < needed 
                  ? 'text-red-600' 
                  : shiftCapacity < needed + (summary.totalNursesPerShift || 0)
                    ? 'text-yellow-600' 
                    : 'text-green-600';
                return (
                  <div key={shiftType} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-700">{shiftType} Shift</p>
                      <p className="text-xs text-slate-500">{data?.timeLabel}</p>
                    </div>
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${status}`}>{shiftCapacity}</p>
                        <p className="text-[10px] text-slate-400">avail/wk</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-700">{needed}</p>
                        <p className="text-[10px] text-slate-400">need/wk</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="p-6 border-b border-slate-200">
          <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Issues to Fix ({issues.length})
          </h4>
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium text-red-800">{issue.message}</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">Tip:</span> {issue.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-6 border-b border-slate-200">
          <h4 className="font-semibold text-amber-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Warnings ({warnings.length})
          </h4>
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-medium text-amber-800">{warning.message}</p>
                <p className="text-sm text-amber-700 mt-1">
                  <span className="font-medium">Consider:</span> {warning.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Messages */}
      {info.length > 0 && (
        <div className="p-6">
          <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Additional Info
          </h4>
          <div className="space-y-2">
            {info.map((item, index) => (
              <div key={index} className="text-sm text-slate-600">
                • {item.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeasibilityReport;
