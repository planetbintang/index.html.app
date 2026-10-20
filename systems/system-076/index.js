const systemName = 'system-076';
const taskList = [
  { id: 1, title: 'Workflow internal dan target output', status: 'todo' },
  { id: 2, title: 'Model status kerja dan prioritas', status: 'todo' },
  { id: 3, title: 'Implementasi modul workflow', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menyiapkan workflow internal yang modern dan terukur.',
  'AI menyusun model status serta prioritas kerja.',
  'AI menghasilkan modul workflow utama.',
  'AI mengevaluasi kualitas sistem dan dokumentasi akhir.'
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
