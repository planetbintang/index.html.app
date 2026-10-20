const systemName = 'system-089';
const taskList = [
  { id: 1, title: 'Kebutuhan eksekusi data', status: 'todo' },
  { id: 2, title: 'Pola task dan kontrol utama', status: 'todo' },
  { id: 3, title: 'Implementasi modul eksekusi', status: 'in-progress' },
  { id: 4, title: 'Validasi performa', status: 'done' }
];

const aiWorkflow = [
  'AI memetakan kebutuhan data untuk eksekusi.',
  'AI menata pola task dan kontrol status.',
  'AI membangun modul eksekusi utama.',
  'AI mengevaluasi hasil dan menyiapkan dokumentasi.'
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
