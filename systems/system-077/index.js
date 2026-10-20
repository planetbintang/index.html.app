const systemName = 'system-077';
const taskList = [
  { id: 1, title: 'Output utama dan kebutuhan review', status: 'todo' },
  { id: 2, title: 'Proses validasi kerja', status: 'todo' },
  { id: 3, title: 'Implementasi modul review', status: 'in-progress' },
  { id: 4, title: 'Evaluasi hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menentukan indikator output dan review yang kritis.',
  'AI menyusun validasi kerja dan mekanisme kontrol.',
  'AI menghasilkan modul review & output.',
  'AI mengevaluasi kualitas final dan kemungkinan optimalisasi.'
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
