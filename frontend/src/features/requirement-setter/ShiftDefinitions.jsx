
import { formatHour, getAutoEnd, generateHours, buildShiftSequence } from "../../utils/time";

const ShiftDefinitions = ({
  timeSlots = [],
  modelDuration,
  onTimeSlotsChange,
}) => {
  const hours = generateHours();

  const handleStartChange = (newStart) => {
    const newSequence = buildShiftSequence(newStart, modelDuration, timeSlots.length);
    const updatedSlots = timeSlots.map((slot, idx) => ({
      ...slot,
      start: newSequence[idx].start,
    }));
    onTimeSlotsChange(updatedSlots);
  };

  const handleLabelChange = (idx, newLabel) => {
    const updatedSlots = timeSlots.map((slot, i) =>
      i === idx ? { ...slot, label: newLabel } : slot
    );
    onTimeSlotsChange(updatedSlots);
  };

  return (
    <div className="mt-3 space-y-2">
      {timeSlots.map((slot, idx) => {
        const autoEnd = getAutoEnd(slot.start, modelDuration);

        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 space-y-2"
          >
            <input
              type="text"
              value={slot.label}
              onChange={(e) => handleLabelChange(idx, e.target.value)}
              placeholder="Shift name"
              className="w-full text-xs font-medium text-slate-700 bg-transparent border-b border-dashed border-slate-300 pb-1 focus:outline-none focus:border-indigo-400 placeholder:text-slate-300"
            />

            <div className="flex items-center gap-2 text-xs">
              {idx === 0 ? (
                <select
                  value={slot.start}
                  onChange={(e) => handleStartChange(parseInt(e.target.value))}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-300 focus:outline-none"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {formatHour(h)}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-slate-600 font-medium bg-slate-100 px-2 py-1.5 rounded-lg">
                  {formatHour(slot.start)}
                </span>
              )}

              <span className="text-slate-400">to</span>

              <span className="text-slate-600 font-medium bg-slate-100 px-2 py-1.5 rounded-lg">
                {formatHour(autoEnd)}
              </span>

              <span className="text-slate-400 ml-auto">
                ({modelDuration}h)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShiftDefinitions;