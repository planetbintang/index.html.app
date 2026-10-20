const systemName = 'system-057';
const taskList = [
  { id: 1, title: 'Identifikasi cakupan proyek', status: 'todo' },
  { id: 2, title: 'Audit dan review tugas', status: 'todo' },
  { id: 3, title: 'Implementasi modul proyek', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menyusun audit proyek berdasarkan kebutuhan nyata.',
  'AI memetakan review task dan keputusan prioritas.',
  'AI menghasilkan modul operasi proyek yang stabil.',
  'AI mengecek hasil dan memastikan dokumentasi lengkap.'
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
