const systemName = 'system-063';
const taskList = [
  { id: 1, title: 'Definisi panel utama', status: 'todo' },
  { id: 2, title: 'Struktur data dan kebutuhan', status: 'todo' },
  { id: 3, title: 'Implementasi dashboard kerja', status: 'in-progress' },
  { id: 4, title: 'Validasi kualitas', status: 'done' }
];

const aiWorkflow = [
  'AI merancang panel utama berdasarkan kebutuhan user.',
  'AI menyusun struktur data untuk penggunaan mudah.',
  'AI menghasilkan dashboard kerja utama.',
  'AI mengevaluasi performa dan kualitas dashboard.'
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
