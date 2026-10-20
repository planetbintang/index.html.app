const systemName = 'system-072';
const taskList = [
  { id: 1, title: 'Alur kerja utama', status: 'todo' },
  { id: 2, title: 'Status, prioritas, dependency', status: 'todo' },
  { id: 3, title: 'Implementasi modul eksekusi', status: 'in-progress' },
  { id: 4, title: 'Validasi sistem', status: 'done' }
];

const aiWorkflow = [
  'AI menyusun alur kerja yang konsisten untuk operasional.',
  'AI memetakan status, prioritas, dan dependency.',
  'AI membangun modul eksekusi utama.',
  'AI menilai hasil tingkat kualitas dan dokumentasi.'
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
