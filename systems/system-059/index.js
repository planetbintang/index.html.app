const systemName = 'system-059';
const taskList = [
  { id: 1, title: 'Identifikasi modul utama', status: 'todo' },
  { id: 2, title: 'Definisi dependency', status: 'todo' },
  { id: 3, title: 'Implementasi koordinator', status: 'in-progress' },
  { id: 4, title: 'Uji hasil dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengelompokkan modul utama berdasarkan fungsi.',
  'AI menyiapkan dependency dan aturan komunikasi antar komponen.',
  'AI membangun koordinasi alur kerja utama.',
  'AI memvalidasi hasil dan merapikan dokumentasi.'
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
