const systemName = 'system-092';
const taskList = [
  { id: 1, title: 'Target sistem berkelanjutan', status: 'todo' },
  { id: 2, title: 'Model review dan output tugas', status: 'todo' },
  { id: 3, title: 'Implementasi modul berkelanjutan', status: 'in-progress' },
  { id: 4, title: 'Validasi kualitas dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menetapkan target operational sustainability.',
  'AI membangun model review output tugas.',
  'AI menyiapkan modul utama untuk pengelolaan jangka panjang.',
  'AI mengevaluasi hasil dan kualitas dokumentasi.'
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
