const systemName = 'system-090';
const taskList = [
  { id: 1, title: 'Perencanaan kerja utama', status: 'todo' },
  { id: 2, title: 'Struktur task dan output', status: 'todo' },
  { id: 3, title: 'Implementasi modulexec dan planning', status: 'in-progress' },
  { id: 4, title: 'Validasi sistem dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI membuat perencanaan kerja yang fokus.',
  'AI mengatur task, status, dan output.',
  'AI menghasilkan modul planning dan eksekusi.',
  'AI menilai hasil final dan dokumentasi.'
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
