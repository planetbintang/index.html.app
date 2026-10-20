const systemName = 'system-069';
const taskList = [
  { id: 1, title: 'Target strategic workflow', status: 'todo' },
  { id: 2, title: 'Prioritas operasi', status: 'todo' },
  { id: 3, title: 'Implementasi modul strategis', status: 'in-progress' },
  { id: 4, title: 'Review hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI membuat strategy workflow yang jelas.',
  'AI menyesuaikan prioritas dengan kebutuhan produk.',
  'AI menghasilkan modul strategis utama.',
  'AI mengevaluasi hasil dan menyusun perbaikan.'
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
