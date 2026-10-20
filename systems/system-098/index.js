const systemName = 'system-098';
const taskList = [
  { id: 1, title: 'Kebutuhan operasional utama', status: 'todo' },
  { id: 2, title: 'Task, status, dan indikator output', status: 'todo' },
  { id: 3, title: 'Implementasi modul operasional', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI merangkum kebutuhan operasional secara jelas.',
  'AI membuat indikator output dan status kerja.',
  'AI membangun modul operasional utama.',
  'AI menilai hasil dan dokumentasi final.'
];

function runSystem() {
  return {
    name: systemName,
    totalTasks: taskList.length,
    completed: taskList.filter(item => item.status === 'done').length,
    status: 'ready',
    workflow: aiWorkflow
  };
}

module.exports = { systemName, taskList, aiWorkflow, runSystem };

if (require.main === module) {
  console.log(JSON.stringify(runSystem(), null, 2));
}
