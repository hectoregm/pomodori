class Project < ActiveRecord::Base
  validates_presence_of :name

  has_many :tasks

  def tasks_not_done
    tasks.where(done: false)
  end

  def progress
    total_estimate = 0
    total_done = 0
    tasks_not_done.each do |task|
      total_estimate += task.estimate
      total_done += task.pomodori.count
    end

    if total_estimate.zero?
      100
    else
      (total_done / total_estimate.to_f) * 100
    end
  end
end
