const systemName = 'system-061';
const taskList = [
  { id: 1, title: 'Aturan prioritas triage', status: 'todo' },
  { id: 2, title: 'Review status task', status: 'todo' },
  { id: 3, title: 'Implementasi modul triage', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI merancang sistem prioritas berdasarkan urgensi.',
  'AI menciptakan mekanisme review status task.',
  'AI menghasilkan modul triage utama.',
  'AI menilai hasil dan dokumentasi sistem.'
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
