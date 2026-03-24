import './App.css'
import {LogIn, Zap} from 'lucide-react'
import DomainPicker from './features/domain-selector/DomainPicker'
import { useState } from 'react';
import { createProject } from './services/api';
import { useProjects } from './hooks/useProjects';

const App = () => {

  const [templateKey, setTemplateKey] = useState('custom');
  const [engineType, setEngineType] = useState('task');
  const { createProject: createProjectMutation } = useProjects();

  const isCreating = createProjectMutation.isLoading;

  const handleTemplateSelect = (domain, selectedEngine) => {
    const engine = domain.engineLocked || selectedEngine;

    createProjectMutation.mutate(
      { templateKey: domain.key, engineType: engine },
      {
        onSuccess: (data) => {
          setTemplateKey(domain.key);
          setEngineType(engine);
          console.log('Project created:', data);
        },
        onError: (err) => {
          console.error('Failed to create project:', err);
          alert(err.message || 'Failed to create project');
        },
      }
    );
  };

  return (
    <main>
      <div className='wrapper'>
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => { setView('scheduler'); }}>
            {/* <Activity className="w-6 h-6" /> */}
            <h1 className="text-xl font-bold tracking-tight">
              Nexus <span className="text-slate-400 font-medium">AutoScheduler</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Credits pill */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>100</span>
              <span className="text-slate-400">/ 100</span>
            </div>
      
            <button
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>            
          </div>
        </header>

        <div className='p-6 max-w-6xl mx-auto mt-6'>
          <DomainPicker onSelect={handleTemplateSelect} loading={isCreating} />
        </div>
      </div>
    </main>
  )
}

export default App
