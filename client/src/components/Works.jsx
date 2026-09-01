import { useEffect, useState } from 'react';
import api from '../api/client';
import WorkCard from './WorkCard';
import useReveal from '../hooks/useReveal';

export default function Works() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error

  useEffect(() => {
    api
      .get('/projects')
      .then((res) => {
        setProjects(res.data);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, []);

  useReveal([status, projects.length]);

  return (
    <section id="works">
      <div className="section-label reveal"><span className="section-num">03</span>Selected Works</div>

      {status === 'loading' && <div className="works-empty">Loading works…</div>}
      {status === 'error' && (
        <div className="works-error">Couldn't reach the API. Is the server running?</div>
      )}
      {status === 'ok' && projects.length === 0 && (
        <div className="works-empty">No projects yet — add some from the admin panel.</div>
      )}

      {status === 'ok' && projects.length > 0 && (
        <div className="works-grid">
          {projects.map((p) => (
            <WorkCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}
