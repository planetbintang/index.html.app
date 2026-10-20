const systemName = 'system-080';
const taskList = [
  { id: 1, title: 'Ruang lingkup tata kelola', status: 'todo' },
  { id: 2, title: 'Model task dan indikator kualitas', status: 'todo' },
  { id: 3, title: 'Implementasi modul tata kelola', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI memetakan ruang lingkup tata kelola.',
  'AI merancang model task dan indikator kualitas.',
  'AI menghasilkan modul tata kelola utama.',
  'AI menilai hasil serta menyusun dokumentasi akhir.'
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
