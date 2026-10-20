const systemName = 'system-073';
const taskList = [
  { id: 1, title: 'Kebutuhan augmentasi kerja', status: 'todo' },
  { id: 2, title: 'Struktur task dan kolaborasi', status: 'todo' },
  { id: 3, title: 'Implementasi modul kolaboratif', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menemukan titik augmentasi kerja antara manusia dan mesin.',
  'AI menyusun flow kerja kolaboratif yang konsisten.',
  'AI menghasilkan modul kolaboratif utama.',
  'AI menyelesaikan validasi dan review fungsi.'
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
