import { useState } from 'react';
import { Cpu, Layers, ArrowRight } from 'lucide-react';

const ENGINES = [
  {
    key: 'task',
    name: 'Schedule',
    description: 'Assigns time slots and resources simultaneously.',
    icon: <Cpu className="w-4 h-4" />,
  },
  {
    key: 'demandSlot',
    name: 'Shift',
    description: 'Allocates resources to predefined shifts.',
    icon: <Layers className="w-4 h-4" />,
  },
];

const DomainCard = ({ domain, onSelect, loading }) => {
  const [selectedEngine, setSelectedEngine] = useState('task');

  const handleSelect = (e) => {
    e?.stopPropagation();
    
    onSelect?.(domain, selectedEngine);
  };

  return (
    <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden 
                    hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 
                    transition-all group flex flex-col"
    >
      {/* Content (clickable) */}
      <div className="p-8 pb-4 cursor-pointer flex-1"
           onClick={handleSelect}
      >
        <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {domain.icon}
        </div>

        <h3 className="text-xl font-bold mb-2 text-slate-800">
          {domain.name}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed">
          {domain.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-8 pb-6 pt-2 space-y-3">
        {!domain.engineLocked && (
          <EngineSelector
            engines={ENGINES}
            selectedEngine={selectedEngine}
            onChange={setSelectedEngine}
          />
        )}

        <PrimaryButton onClick={handleSelect} loading={loading} />
      </div>
    </div>
  );
};

/* ---------- SUB COMPONENTS ---------- */

const EngineSelector = ({ engines, selectedEngine, onChange }) => (
  <>
    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
      Scheduling Mode
    </label>

    <div className="grid grid-cols-2 gap-2">
      {engines.map((engine) => {
        const isSelected = selectedEngine === engine.key;

        return (
          <button
            key={engine.key}
            onClick={(e) => {
              e.stopPropagation();
              onChange(engine.key);
            }}
            title={engine.description}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            <span className={isSelected ? 'text-indigo-500' : 'text-slate-400'}>
              {engine.icon}
            </span>
            {engine.name}
          </button>
        );
      })}
    </div>
  </>
);

const PrimaryButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`w-full flex items-center justify-center gap-2 
                bg-indigo-600 text-white px-4 py-2.5 rounded-xl 
                text-sm font-bold transition shadow-sm
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
  >
    {loading ? 'Creating...' : <>Get Started <ArrowRight className="w-4 h-4" /></>}
  </button>
);

export default DomainCard;