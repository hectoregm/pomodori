json.extract! @pomodoro, :id, :task_id, :length, :started_at, :completed_at, :created_at, :updated_at

json.long_break Pomodoro.long_break?
