const systemName = 'system-079';
const taskList = [
  { id: 1, title: 'Kebutuhan stabilitas kerja', status: 'todo' },
  { id: 2, title: 'Model task dan integrasi modul', status: 'todo' },
  { id: 3, title: 'Implementasi modul stabilitas', status: 'in-progress' },
  { id: 4, title: 'Validasi dan documentasi', status: 'done' }
];

const aiWorkflow = [
  'AI mengelompokkan kebutuhan stabilitas kerja.',
  'AI menyusun model integrasi task dan modul.',
  'AI membangun modul stabilitas kerja.',
  'AI mengevaluasi hasil dan mendokumentasikan perubahan.'
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
