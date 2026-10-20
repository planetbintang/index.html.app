const systemName = 'system-056';
const taskList = [
  { id: 1, title: 'Penetapan KPI utama', status: 'todo' },
  { id: 2, title: 'Alur kontrol output', status: 'todo' },
  { id: 3, title: 'Implementasi modul output', status: 'in-progress' },
  { id: 4, title: 'Evaluasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengubah kebutuhan output menjadi KPI.',
  'AI membangun alur pengelolaan hasil kerja.',
  'AI menyiapkan modul manajemen output.',
  'AI melakukan evaluasi dan rekomendasi pelengkapan.'
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
