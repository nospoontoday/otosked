import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { useProject } from '../hooks/useProjects';
import Header from '../components/Header';
import SchemaBuilder from '../features/sked-builder/SchemaBuilder';
import { useEffect } from 'react';
import { setupHospitalConfigAutoSave } from '../stores/useHospitalConfigAutoSave';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = setupHospitalConfigAutoSave();
    return unsubscribe;
  }, []);

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProject(id);

  if (isLoading) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded" />
          <div className="h-64 bg-slate-200 rounded" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-6 max-w-6xl mx-auto text-center">
        <p className="text-red-500 font-medium mb-4">
          Failed to load project
        </p>
        <p className="text-sm text-slate-500 mb-6">
          {error?.message || 'Something went wrong.'}
        </p>

        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition"
        >
          Go back home
        </button>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="p-6 max-w-6xl mx-auto text-center">
        <p className="text-slate-500">Project not found.</p>
      </main>
    );
  }

  return (
    <main>
      <div className="wrapper">
        <Header
          left={
            <div
              className="flex items-center gap-2 text-indigo-600 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
              <h1 className="text-lg font-bold tracking-tight">
                Back
              </h1>
            </div>
          }
          right={
            <div className="text-sm text-slate-500">
              Project ID: <span className="font-mono">{id}</span>
            </div>
          }
        />

        {/* Content */}
        <div className="p-6 max-w-6xl mx-auto mt-6">
          <SchemaBuilder
            templateKey={project.template.key}
            project={project}
          />
        </div>
      </div>
    </main>
  );
};

export default ProjectPage;