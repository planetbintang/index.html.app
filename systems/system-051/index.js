const systemName = 'system-051';
const taskList = [
  { id: 1, title: 'Analisis kebutuhan sistem', status: 'todo' },
  { id: 2, title: 'Perancangan arsitektur modul', status: 'todo' },
  { id: 3, title: 'Implementasi modul inti', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menguraikan kebutuhan sistem menjadi task yang spesifik.',
  'AI menyusun dependency modul agar integrasi lebih stabil.',
  'AI menghasilkan implementasi dasar untuk eksekusi tugas.',
  'AI menilai hasil, kualitas, dan dokumentasi final.'
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
