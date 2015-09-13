class Project < ActiveRecord::Base
  validates_presence_of :name

  has_many :tasks

  def tasks_done
    tasks.where(done: true)
  end

  def tasks_not_done
    tasks.where(done: false)
  end

  def progress
    total = 0
    total_done = 0
    total_partial = 0

    tasks_done.each do |task|
      total += task.estimate
      total_done += task.estimate
    end

    tasks_not_done.each do |task|
      total += task.estimate
      total_partial += (task.pomodori.count < task.estimate) ? task.pomodori.count : task.estimate
    end

    if total.zero?
      {
        done: 0,
        in_progress: 0,
      }
    else
      {
        done: (total_done / total.to_f) * 100,
        in_progress: (total_partial / total.to_f) * 100,
      }
    end
  end
end
