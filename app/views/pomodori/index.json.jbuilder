json.array!(@pomodori) do |pomodoro|
  json.extract! pomodoro, :id, :started_at, :completed_at, :length
  json.url pomodoro_url(pomodoro, format: :json)
end
