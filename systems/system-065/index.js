const systemName = 'system-065';
const taskList = [
  { id: 1, title: 'Identifikasi kebutuhan pendataan', status: 'todo' },
  { id: 2, title: 'Model keputusan berbasis data', status: 'todo' },
  { id: 3, title: 'Implementasi modul integrasi', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI melakukan pemetaan kebutuhan data dan keputusan.',
  'AI menyusun model kerja yang terstruktur.',
  'AI membangun modul integrasi data dan keputusan.',
  'AI melakukan review hasil untuk penyesuaian lebih lanjut.'
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
