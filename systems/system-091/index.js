const systemName = 'system-091';
const taskList = [
  { id: 1, title: 'Definisi tugas kompleks', status: 'todo' },
  { id: 2, title: 'Struktur kerja dan dependency', status: 'todo' },
  { id: 3, title: 'Implementasi modul kompleks', status: 'in-progress' },
  { id: 4, title: 'Validasi hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI memecah task kompleks menjadi bagian kecil.',
  'AI mendefinisikan dependency untuk operasi terpadu.',
  'AI menyiapkan modul kompleks utama.',
  'AI mengevaluasi hasil akhir dan dokumentasi.'
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
