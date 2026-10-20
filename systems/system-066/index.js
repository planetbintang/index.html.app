const systemName = 'system-066';
const taskList = [
  { id: 1, title: 'Target sinkronisasi', status: 'todo' },
  { id: 2, title: 'Status dan referensi task', status: 'todo' },
  { id: 3, title: 'Implementasi modul sinkronisasi', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menetapkan target sinkronisasi dalam ekosistem kerja.',
  'AI memperjelas status dan referensi antar unit kerja.',
  'AI menghasilkan modul sinkronisasi utama.',
  'AI memvalidasi dan menyiapkan dokumentasi integrasi.'
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
