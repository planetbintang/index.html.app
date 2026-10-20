const systemName = 'system-068';
const taskList = [
  { id: 1, title: 'Definisi kebutuhan data', status: 'todo' },
  { id: 2, title: 'Alur akses dan output', status: 'todo' },
  { id: 3, title: 'Implementasi modul data', status: 'in-progress' },
  { id: 4, title: 'Uji integrasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengelompokkan kebutuhan data untuk penggunaan cepat.',
  'AI membangun alur akses dan output yang efisien.',
  'AI menghasilkan modul data utama.',
  'AI mengevaluasi integrasi dan kejelasan dokumentasi.'
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
