const systemName = 'system-062';
const taskList = [
  { id: 1, title: 'Pengumpulan kebutuhan rutin', status: 'todo' },
  { id: 2, title: 'Model jadwal dan urgensi', status: 'todo' },
  { id: 3, title: 'Implementasi modul penjadwalan', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengumpulkan kebutuhan aktivitas rutin.',
  'AI menyusun prioritas dan jadwal kerja.',
  'AI membangun modul penjadwalan otomatis.',
  'AI menilai hasil dan menyiapkan dokumentasi.'
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
