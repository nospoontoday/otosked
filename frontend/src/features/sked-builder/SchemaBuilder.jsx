import { ChevronRight } from "lucide-react";
import HospitalConfig from "./HospitalConfig";
import SchoolConfig from "./SchoolConfig";

const SchemaBuilder = ({templateKey, project}) => {
    const isUniversity = templateKey === 'university';
    const isHospital = templateKey === 'hospital';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {isUniversity ? 'Set Up Your Class Schedule' : isHospital ? 'Set Up Your Staff Schedule' : 'Set Up Your Schedule'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {isUniversity
                            ? 'Define your schedule categories, available class periods, and the specific instructors, rooms, and sections involved.'
                            : isHospital
                                ? 'Configure your shift model, departments, and staffing requirements.'
                                : 'Define the categories of things you need to schedule, the available time blocks, and the specific people/rooms/groups involved.'}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <button
                        // onClick={canProceed ? onNext : undefined}
                        // disabled={!canProceed}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                    {isUniversity
                        ? 'Next: Subjects & Classes'
                        : isHospital
                            ? 'Next: Tasks & Assignments'
                            : 'Next: Tasks & Assignments'} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row min-h-[500px]">
                <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                    {isHospital ? (
                        <HospitalConfig project={project} />
                    ) : (
                        <SchoolConfig />
                    )}
                </div>
            </div>
        </div>
    )
};

export default SchemaBuilder