const systemName = 'system-097';
const taskList = [
  { id: 1, title: 'Ruang lingkup kerja khusus', status: 'todo' },
  { id: 2, title: 'Task dan monitoring utama', status: 'todo' },
  { id: 3, title: 'Implementasi modul kontrol', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menetapkan ruang lingkup kerja khusus.',
  'AI membangun model task dan monitoring.',
  'AI menghasilkan modul kontrol utama.',
  'AI memfinalisasi validasi dan dokumentasi.'
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
