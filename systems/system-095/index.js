const systemName = 'system-095';
const taskList = [
  { id: 1, title: 'Kebutuhan keputusan kerja', status: 'todo' },
  { id: 2, title: 'Model tugas dan prioritas', status: 'todo' },
  { id: 3, title: 'Implementasi modul keputusan', status: 'in-progress' },
  { id: 4, title: 'Validasi hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menentukan kebutuhan keputusan kerja.',
  'AI menyiapkan model task dan struktur prioritas.',
  'AI membuat modul utama untuk pengelolaan keputusan.',
  'AI menilai hasil dan dokumentasi akhir.'
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
