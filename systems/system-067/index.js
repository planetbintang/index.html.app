const systemName = 'system-067';
const taskList = [
  { id: 1, title: 'Layanan utama orchestration', status: 'todo' },
  { id: 2, title: 'Profile task dan dependency', status: 'todo' },
  { id: 3, title: 'Implementasi modul orchestration', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI memetakan orchestrator berdasar layanan utama.',
  'AI menata task dan dependency modul.',
  'AI membuat modul orchestrasi dasar.',
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
