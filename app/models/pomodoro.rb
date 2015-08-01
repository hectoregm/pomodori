class Pomodoro < ActiveRecord::Base
  validates_presence_of :task

  belongs_to :task

  def self.long_break?
    after(Time.current - 2.hours - 15.minutes, field: :started_at).count == 4
  end
end
