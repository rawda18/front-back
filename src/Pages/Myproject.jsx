import { useState, useEffect } from 'react';
import { FolderKanban, Calendar, Users } from 'lucide-react';
import ThemeToggel from '../components/ThemToggel';
import Sidebare from '../components/Sidebare';
import CreateProjectModal from './CreateProjectModal';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, addProject } from '../Api/projects.api';

const ProjectCard = ({ project, navigate }) => (
  <div className="flex flex-col gap-2 transition-all hover:scale-[1.01] bg-[var(--card)] border-1 border-[var(--card-border)] p-6 rounded-xl w-full">
    <div className="flex items-start justify-between">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--icon-bg)]"
        style={{ color: '#51A2FF', transform: 'scale(1.4)', transformOrigin: 'left center' }}
      >
        <FolderKanban size={20} />
      </div>
      <div className="flex items-center gap-1 text-xs text-small-custom opacity-70">
        <span className="w-3 h-3 mt-[-4px]">
          <Calendar size={14} />
        </span>
        <span>{project.createdAt}</span>
      </div>
    </div>

    <div className="mt-2">
      <h3 className="text-lg font-semibold text-title-custom leading-tight">{project.title}</h3>
      <p className="text-sm text-small-custom mt-1">{project.desc}</p>
    </div>

    <div className="border-1 border-[var(--card-border)] mt-1" />

    <div className="flex items-center justify-between">
      <div className="flex items-center text-small-custom text-sm gap-2">
        <span className="w-4 h-4 mt-[-3px]">
          <Users size={16} />
        </span>
        <span>{project.members} members</span>
      </div>
      <button
        onClick={() => navigate(`/project/${project.id}`)}
        className="text-sm hover:opacity-80 transition-all text-[#2B4C9F]"
      >
        View Details
      </button>
    </div>
  </div>
);

export default function MyProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    };
    loadProjects();
  }, []);
  const [loading, setLoading] = useState(true);
  const handleCreate = async (newProject) => {
    try {
      const added = await addProject(newProject);
      setProjects((prev) => [...prev, added]);
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--background)', fontFamily: 'Inter' }}
    >
      <Sidebare activeLabel="My Projects" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-title-custom">My Projects</h1>
            <p className="text-small-custom text-sm mt-1">
              Manage your laboratory projects and teams
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-[#2B4C9F] rounded-xl transition-all hover:opacity-90 self-start sm:self-auto whitespace-nowrap"
          >
            <span className="text-base leading-none">+</span>
            Create Project
          </button>
        </div>
        {loading ? (
          <div className="text-center py-10">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} navigate={navigate} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
