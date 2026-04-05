import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const COLUMNS = [
  { id: 'applied',   label: 'Applied',   color: 'border-indigo-400', bg: 'bg-indigo-50/50', dot: 'bg-indigo-400', ring: 'ring-indigo-200' },
  { id: 'screening', label: 'Screening', color: 'border-violet-400', bg: 'bg-violet-50/50', dot: 'bg-violet-400', ring: 'ring-violet-200' },
  { id: 'interview', label: 'Interview', color: 'border-blue-400',   bg: 'bg-blue-50/50',   dot: 'bg-blue-400',   ring: 'ring-blue-200' },
  { id: 'offer',     label: 'Offer',     color: 'border-emerald-400',bg: 'bg-emerald-50/50',dot: 'bg-emerald-400',ring: 'ring-emerald-200' },
  { id: 'rejected',  label: 'Rejected',  color: 'border-slate-300',  bg: 'bg-slate-50/50',  dot: 'bg-slate-400',  ring: 'ring-slate-200' },
]

function JobCard({ job, index, onDelete }) {
  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          className={`bg-white border rounded-xl p-3.5 mb-2 cursor-grab active:cursor-grabbing transition-all duration-200 ${
            snapshot.isDragging ? 'border-indigo-300 shadow-xl shadow-indigo-500/10 rotate-1 scale-105' : 'border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
          }`}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-slate-800 text-sm font-semibold leading-tight">{job.company}</p>
            <button onClick={() => onDelete(job.id)} className="text-slate-300 hover:text-red-400 text-xs shrink-0 transition-colors">&#10005;</button>
          </div>
          <p className="text-slate-400 text-xs mb-2">{job.role}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full font-medium">{job.source}</span>
            {job.salary_min && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                ${(job.salary_min / 1000).toFixed(0)}k{job.salary_max && `–${(job.salary_max / 1000).toFixed(0)}k`}
              </span>
            )}
          </div>
          {job.notes && <p className="text-slate-400 text-[11px] mt-2 truncate">{job.notes}</p>}
          <p className="text-slate-300 text-[10px] mt-1.5">{new Date(job.created_at).toLocaleDateString()}</p>
        </div>
      )}
    </Draggable>
  )
}

export default function KanbanBoard({ jobs, onStatusChange, onDelete }) {
  const getColumnJobs = (status) => jobs.filter(j => j.status === status)
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination || destination.droppableId === source.droppableId) return
    onStatusChange(draggableId, destination.droppableId)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const colJobs = getColumnJobs(col.id)
          return (
            <div key={col.id} className="shrink-0 w-60">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-[13px] font-semibold text-slate-600">{col.label}</span>
                <span className="ml-auto text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{colJobs.length}</span>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className={`min-h-24 rounded-xl p-2 border-2 border-dashed transition-all duration-200 ${
                      snapshot.isDraggingOver ? `${col.bg} ${col.color}` : 'border-slate-100 bg-slate-50/30'
                    }`}>
                    {colJobs.map((job, index) => <JobCard key={job.id} job={job} index={index} onDelete={onDelete} />)}
                    {provided.placeholder}
                    {colJobs.length === 0 && !snapshot.isDraggingOver && (
                      <p className="text-slate-300 text-xs text-center py-6">Drop here</p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
