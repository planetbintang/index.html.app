const systemName = 'system-093';
const taskList = [
  { id: 1, title: 'Area modifikasi kerja', status: 'todo' },
  { id: 2, title: 'Model task dan catatan', status: 'todo' },
  { id: 3, title: 'Implementasi modul modifikasi', status: 'in-progress' },
  { id: 4, title: 'Validasi hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengidentifikasi area modifikasi kerja.',
  'AI menyusun model output dan catatan perubahan.',
  'AI membangun modul utama modifikasi.',
  'AI mengevaluasi kualitas output dan dokumentasi.'
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
