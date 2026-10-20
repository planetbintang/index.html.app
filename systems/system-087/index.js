const systemName = 'system-087';
const taskList = [
  { id: 1, title: 'Rentang tugas', status: 'todo' },
  { id: 2, title: 'Pengelompokan struktur tugas', status: 'todo' },
  { id: 3, title: 'Implementasi modul routing', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengkategorikan tugas dari sederhana hingga kompleks.',
  'AI membangun struktur pengelompokan yang jelas.',
  'AI menghasilkan modul routing kerja.',
  'AI menilai kualitas fungsional dan dokumentasi.'
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
