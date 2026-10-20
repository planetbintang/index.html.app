const systemName = 'system-060';
const taskList = [
  { id: 1, title: 'Spesifikasi kebutuhan adaptif', status: 'todo' },
  { id: 2, title: 'Pola task dan adaptasi IO', status: 'todo' },
  { id: 3, title: 'Implementasi modul adaptif', status: 'in-progress' },
  { id: 4, title: 'Testing dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI memetakan kebutuhan adaptif ke task yang terrstruktur.',
  'AI menyusun mekanisme perubahan status dan input-output.',
  'AI memproduksi modul adaptif dasar.',
  'AI melakukan review dan validasi kelengkapan.'
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
