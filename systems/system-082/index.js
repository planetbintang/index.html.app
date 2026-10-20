const systemName = 'system-082';
const taskList = [
  { id: 1, title: 'Kebutuhan kerja utama', status: 'todo' },
  { id: 2, title: 'Model task dari kebutuhan', status: 'todo' },
  { id: 3, title: 'Implementasi modul penerjemah', status: 'in-progress' },
  { id: 4, title: 'Validasi dan dokumentasi', status: 'done' }
];

const aiWorkflow = [
  'AI menerjemahkan kebutuhan kerja menjadi task operasional.',
  'AI mengatur model task agar mudah ditindaklanjuti.',
  'AI membangun modul penerjemah logika kerja.',
  'AI mengevaluasi output dan mendokumentasikan hasil.'
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
