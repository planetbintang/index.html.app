const systemName = 'system-078';
const taskList = [
  { id: 1, title: 'Unit kerja utama', status: 'todo' },
  { id: 2, title: 'Pola task dan pembaruan status', status: 'todo' },
  { id: 3, title: 'Implementasi modul task management', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengorganisir unit kerja menjadi struktur logis.',
  'AI mengelola task dan status pembaruan.',
  'AI membangun modul task management utama.',
  'AI menilai hasil dan kualitas dokumentasi.'
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
