const systemName = 'system-094';
const taskList = [
  { id: 1, title: 'Area pemantauan utama', status: 'todo' },
  { id: 2, title: 'Indikator kerja dan prioritas', status: 'todo' },
  { id: 3, title: 'Implementasi modul monitoring', status: 'in-progress' },
  { id: 4, title: 'Validasi kinerja dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menentukan area pemantauan yang paling relevan.',
  'AI menyusun tanda indikator kerja dan prioritas.',
  'AI menghasilkan modul monitoring utama.',
  'AI mengevaluasi kinerja dan dokumentasi akhir.'
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
