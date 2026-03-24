import { Stethoscope, GraduationCap, Settings, Cpu, Layers, ArrowRight } from 'lucide-react';
import DomainCard from './DomainCard';

const DOMAINS = [
  {
    key: 'university',
    name: 'University Classes',
    description: 'Assign instructors, rooms, and student sections to class sessions across the week.',
    icon: <GraduationCap className="w-8 h-8 text-indigo-500" />,
    engineLocked: 'task',
  },
  {
    key: 'hospital',
    name: 'Hospital Shifts',
    description: 'Allocate doctors, nurses, and staff to departments across rotating shifts.',
    icon: <Stethoscope className="w-8 h-8 text-rose-500" />,
    engineLocked: 'demandSlot',
  },
  {
    key: 'custom',
    name: 'Start from Scratch',
    description: 'Build your own schedule from the ground up — define your own categories, people, and time blocks.',
    icon: <Settings className="w-8 h-8 text-slate-500" />,
    engineLocked: null,
  },
];

const DomainPicker = ({ onSelect, creatingKey }) => {
    return (
        <>
            <div>
                <div className='text-center mb-10'>
                    <h2 className='text-3xl font-bold mb-3 text-slate-900'>What are you scheduling?</h2>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Pick a ready-made template to get started quickly, or start from scratch to set up your own custom schedule.
                    </p>
                </div>
            </div>

            <div className='grid md:grid-cols-3 gap-6'>
                {DOMAINS.map((domain) => (
                    <DomainCard
                        key={domain.key}
                        domain={domain}
                        onSelect={onSelect}
                        loading={creatingKey === domain.key}
                    />
                ))}
            </div>
        </>
    )

}

export default DomainPicker