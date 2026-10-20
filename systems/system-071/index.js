const systemName = 'system-071';
const taskList = [
  { id: 1, title: 'Kebutuhan knowledge base', status: 'todo' },
  { id: 2, title: 'Indikator monitoring output', status: 'todo' },
  { id: 3, title: 'Implementasi eksekusi dan monitoring', status: 'in-progress' },
  { id: 4, title: 'Validasi dan rilis', status: 'done' }
];

const aiWorkflow = [
  'AI menyusun knowledge base sebagai basis kerja utama.',
  'AI menetapkan indikator monitoring output yang terukur.',
  'AI membangun modul eksekusi dan monitoring.',
  'AI mengevaluasi kinerja dan persiapan rilis.'
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
