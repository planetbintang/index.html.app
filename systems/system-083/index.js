const systemName = 'system-083';
const taskList = [
  { id: 1, title: 'Identifikasi task kecil', status: 'todo' },
  { id: 2, title: 'Struktur status dan pengawasan', status: 'todo' },
  { id: 3, title: 'Implementasi modul workflow kecil', status: 'in-progress' },
  { id: 4, title: 'Validasi performa', status: 'done' }
];

const aiWorkflow = [
  'AI membagi workflow menjadi bagian kecil dengan task jelas.',
  'AI membuat struktur status dan pengawasan operasional.',
  'AI membangun modul workflow utama.',
  'AI mengevaluasi performa dan menyiapkan dokumentasi.'
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
