const systemName = 'system-055';
const taskList = [
  { id: 1, title: 'Definisi komponen kontrol', status: 'todo' },
  { id: 2, title: 'Penyusunan update status', status: 'todo' },
  { id: 3, title: 'Implementasi monitoring', status: 'in-progress' },
  { id: 4, title: 'Validasi kinerja', status: 'done' }
];

const aiWorkflow = [
  'AI menyusun peta kontrol untuk komponen utama.',
  'AI menetapkan mekanisme update status dan pelaporan.',
  'AI membangun modul monitoring terpadu.',
  'AI mengevaluasi hasil kinerja dan dokumentasi.'
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
