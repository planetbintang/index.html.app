const systemName = 'system-085';
const taskList = [
  { id: 1, title: 'Area operasi utama', status: 'todo' },
  { id: 2, title: 'Task dan review status', status: 'todo' },
  { id: 3, title: 'Implementasi modul integrasi', status: 'in-progress' },
  { id: 4, title: 'Validasi kualitas', status: 'done' }
];

const aiWorkflow = [
  'AI mendefinisikan area operasi utama.',
  'AI menyusun review status task dan workflow.',
  'AI membangun modul integrasi internal.',
  'AI memastikan kualitas dan dokumentasi.'
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
