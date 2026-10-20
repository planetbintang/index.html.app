const systemName = 'system-096';
const taskList = [
  { id: 1, title: 'Kebutuhan eksekusi otomatis', status: 'todo' },
  { id: 2, title: 'Task, output, dan review', status: 'todo' },
  { id: 3, title: 'Implementasi modul eksekusi', status: 'in-progress' },
  { id: 4, title: 'Uji kualitas dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menetapkan kebutuhan eksekusi otomatis.',
  'AI menyusun task, output, dan review.',
  'AI menyiapkan modul eksekusi dan review utama.',
  'AI menilai kualitas hasil dan dokumentasi akhir.'
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
