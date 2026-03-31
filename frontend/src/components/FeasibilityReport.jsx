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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Departments</p>
            <p className="text-2xl font-bold text-slate-800">{summary?.totalDepartments || 0}</p>
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
