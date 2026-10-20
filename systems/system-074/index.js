const systemName = 'system-074';
const taskList = [
  { id: 1, title: 'Kebutuhan keamanan dan skalabilitas', status: 'todo' },
  { id: 2, title: 'Model task dan kontrol alur', status: 'todo' },
  { id: 3, title: 'Implementasi modul aman', status: 'in-progress' },
  { id: 4, title: 'Review keluaran dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI merancang sistem aman dan scalable untuk pekerjaannya.',
  'AI menyiapkan model task dan kontrol alur.',
  'AI membuat modul pengelolaan aman.',
  'AI mengecek stabilitas dan dokumentasi akhir.'
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
