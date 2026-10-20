const systemName = 'system-064';
const taskList = [
  { id: 1, title: 'Target kualitas kerja', status: 'todo' },
  { id: 2, title: 'Model monitoring tugas', status: 'todo' },
  { id: 3, title: 'Implementasi kontrol kualitas', status: 'in-progress' },
  { id: 4, title: 'Validasi hasil dan rekomendasi', status: 'done' }
];

const aiWorkflow = [
  'AI menetapkan kriteria kualitas yang jelas.',
  'AI membuat model monitoring status dan output.',
  'AI membangun kontrol kualitas otomatis.',
  'AI mengevaluasi hasil dan mengarahkan perbaikan.'
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
