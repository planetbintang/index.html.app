const systemName = 'system-099';
const taskList = [
  { id: 1, title: 'Kebutuhan map eksekusi kerja', status: 'todo' },
  { id: 2, title: 'Task, output, dan review', status: 'todo' },
  { id: 3, title: 'Implementasi modul map kerja', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI memetakan eksekusi kerja menjadi modul yang jelas.',
  'AI menyusun task, output, dan review.',
  'AI membangun modul map kerja utama.',
  'AI mengevaluasi hasil dan laporan akhir.'
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
