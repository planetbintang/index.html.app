const systemName = 'system-070';
const taskList = [
  { id: 1, title: 'Identifikasi aset utama', status: 'todo' },
  { id: 2, title: 'Prioritas task dan alur kerja', status: 'todo' },
  { id: 3, title: 'Implementasi modul aset', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI merancang aset dan task menjadi kerangka kerja yang konsisten.',
  'AI menyusun prioritas alur kerja yang efektif.',
  'AI menghasilkan modul aset dan task management.',
  'AI menilai kualitas final dan kelengkapan dokumentasi.'
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
