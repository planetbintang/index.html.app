const systemName = 'system-088';
const taskList = [
  { id: 1, title: 'Ruang lingkup kerja AI', status: 'todo' },
  { id: 2, title: 'Model dokumentasi dan task', status: 'todo' },
  { id: 3, title: 'Implementasi modul integrasi', status: 'in-progress' },
  { id: 4, title: 'Uji hasil dan kesimpulan', status: 'done' }
];

const aiWorkflow = [
  'AI menentukan fokus dan ruang lingkup kerja.',
  'AI menyusun model task dan dokumentasi.',
  'AI membuat modul integrasi utama.',
  'AI menilai output dan menyusun kesimpulan.'
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
