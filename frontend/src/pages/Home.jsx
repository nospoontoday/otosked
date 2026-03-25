import { LogIn, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DomainPicker from '../features/domain-selector/DomainPicker';
import Header from '../components/Header';
import { useProjects } from '../hooks/useProjects';

const Home = () => {
  const navigate = useNavigate();

  const { createProject: createProjectMutation, creatingKey } = useProjects();

  const handleTemplateSelect = (domain, selectedEngine) => {
    const engine = domain.engineLocked || selectedEngine;

    createProjectMutation.mutate(
      {
        templateKey: domain.key,
        engineType: engine,
      },
      {
        onSuccess: (data) => {
          const projectId = data?._id;

          if (!projectId) {
            console.error('No project ID returned from API');
            return;
          }

          navigate(`/projects/${projectId}`);
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
      <div className="wrapper">
        <Header
          left={
            <div
              className="flex items-center gap-2 text-indigo-600 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <h1 className="text-xl font-bold tracking-tight">
                Nexus <span className="text-slate-400 font-medium">AutoScheduler</span>
              </h1>
            </div>
          }
          right={
            <div className="flex items-center gap-3">
              {/* Credits */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>100</span>
                <span className="text-slate-400">/ 100</span>
              </div>

              {/* Sign In */}
              <button className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm">
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </div>
          }
        />

        {/* Content */}
        <div className="p-6 max-w-6xl mx-auto mt-6">
          <DomainPicker
            onSelect={handleTemplateSelect}
            creatingKey={creatingKey}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;